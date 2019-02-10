import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Zeitleiste from "./Zeitleiste";
import config from './Defaults';


// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      bookingData : [],
      isLoading : false,
      error : false,
      width: window.innerWidth,
    };
  }  
  componentWillMount() {
    const { court, day } = this.props;
    const url = config.hostname + "/intern/api/platz.php?p=" + court + "&d=" + day + "";
    // console.log("PLATZ-URL: " + url);
    window.addEventListener('resize', this.handleWindowSizeChange);

    this.setState({isLoading : true});
    
    fetch(url)
    .then(result => {
      if (result.ok) {
          return result.json();
        } else {
          throw new Error('Fehler beim Laden der Platzbuchungsdaten');
        }
    })
    .then (
      result => {
        // console.log(result.records);
        let courtData = result.records.map ( r => {
            let k = r.id;
            let cn = computeBelClasses (r.starts_at, r.ends_at);
            //console.log("PLATZ:" + r.court)
            let spieler = 
                r.p1 
              + (r.p2 ? ', ' + r.p2 : ' ') 
              + (r.p3 ? ', ' + r.p3 : ' ') 
              + (r.p4 ? ', ' + r.p4 : ' ');
            return ( 
              <Link key={k} to={'/belegungsdetails/' + r.id}>
                <div key={k} className={cn}>
                  <strong>{r.starts_at.substring(11,16)} </strong>
                  {spieler}
                </div>
              </Link>
            )
        })
        this.setState({courtData: courtData});
      }
    )
    .catch(error => this.setState({ error, isLoading: false }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  
  render() {
    const { width } = this.state;
    const isMobile = width <= config.smartphoneWidth;
    
    if (isMobile) {
    
      return (
        <table className="table">
          <tbody>
            <tr className="platzDim">
              <td className="zeitleisteCol"><Zeitleiste /></td>
              <td className="platz">
                <div className="platznummer">PLATZ {this.props.court}</div>
                {this.state.courtData}
              </td>
            </tr>
          </tbody>
        </table>
      );

    } else {

      return (
        <div>
          <div className="platznummer">PLATZ {this.props.court}</div>
          <div>{this.state.courtData}</div>
        </div>
      );  

    }
  }
}

// CSS-Klassen bilden für die Positionierung und Höhe einer Blegung auf der Tafel
function computeBelClasses (s, e) {

  // Dauer berechnen, also z. B. '2019-05-02 16:00:00' - '2019-05-02 14:00:00' = 120
  let dauer = (Number(e.substring(11,13))*60 + Number(e.substring(14,16))) - (Number(s.substring(11,13))*60 + Number(s.substring(14,16)));
  let cn = classNames(
    'D-' + dauer,
    'ts', 
    'T-' + s.substring(11, 16).replace(':', '-'),
    
    );
  return cn;
}

export default Platz;