import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Zeitleiste from "./Zeitleiste";
import Config from './Defaults';


// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      courtData: [],
      isLoading : false,
      error : false,
      width: window.innerWidth,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const {court, day} = nextProps;
    this.fetchPlatz(court, day);
  }

  componentWillMount() {
    const { court, day } = this.props;
    this.fetchPlatz(court, day);
  }

  fetchPlatz(court, day) {
    const url = Config.protokoll + Config.hostname + "/intern/api/platz.php?op=ra&p=" + court + "&ds=" + day + "&de=" + day;
    window.addEventListener('resize', this.handleWindowSizeChange);
    
    this.setState({isLoading : true});
    fetch(url)
    .then(result => {
      if (result.ok) {
          return result.json();
        } else {
          // In diesem Fall haben wir einen neuen, noch unbebuchten Tag
          this.setState({isLoading : false});
        }
      })
    .then (result => {
        let courtData = result.records.map ( r => {
            let k = r.id;
            let cn = computeBelClasses (r.starts_at, r.ends_at, r.booking_type);
            let spieler = 
                r.p1 
              + (r.p2 ? ', ' + r.p2 : ' ') 
              + (r.p3 ? ', ' + r.p3 : ' ') 
              + (r.p4 ? ', ' + r.p4 : ' ');
            return ( 
                <Link key={k} className={cn} to={{ pathname: '/belegungsdetails/update', state: {c: this.props.court, i: r.id, d: day} }}>
                  <strong>{r.starts_at.substring(11,16)}</strong> {spieler}
                </Link>
            )
        })
        this.setState({courtData: courtData});
        this.setState({isLoading : false});
      }
    )
    .catch(error => this.setState({ error, isLoading: true }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  
  render() {
    if (this.state.isLoading === true) {
      return (
        <div>Loading...</div>
        );
    }
    const { width } = this.state;
    const isMobile = width <= Config.smartphoneWidth;
      
    if (isMobile) {
    
      return (
        <table className="table">
          <tbody>
            <tr className="platzDim">
              <td className="zeitleisteCol"><Zeitleiste /></td>
              <td className="platz">
                <div className="platznummer">
                  <span className="platzziffer">{this.props.court}</span> 
                  <Link to={{pathname: '/belegungsdetails/new', state: {c: this.props.court, d: this.props.day} }} className="neuBtn">NEU</Link> 
                </div>
                <div>
                  {this.state.courtData}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      );

    } else {

      return (
        <div>
          <div className="platznummer">
            <span className="platzziffer">{this.props.court}</span> 
            <Link to={{pathname: '/belegungsdetails/new', state: {c: this.props.court, d: this.props.day} }} className="neuBtn">NEU</Link> 
          </div>
          <div>{this.state.courtData}</div>
        </div>
      );  
    }
  }
}

// CSS-Klassen bilden für die Positionierung und Höhe einer Blegung auf der Tafel
function computeBelClasses (s, e, bookingType) {

  // Dauer berechnen, also z. B. '2019-05-02 16:00:00' - '2019-05-02 14:00:00' = 120
  const dauer = (Number(e.substring(11,13))*60 + Number(e.substring(14,16))) - (Number(s.substring(11,13))*60 + Number(s.substring(14,16)));
  const bt = bookingType === 'Turnier' ? 'ts-turnier' : '' 
  let cn = classNames(
    'D-' + dauer,
    'ts', 
    'T-' + s.substring(11, 16).replace(':', '-'),
    bt,
    );
  return cn;
}

export default Platz;
