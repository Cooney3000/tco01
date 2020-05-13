import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { spielerzusatz, nvb } from './functions';
import Config, { permissions } from './Defaults';


// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      courtData: [],
      isLoading : false,
      error : false,
      width: window.innerWidth,
      zumBelegungstag: false,
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
    const userIsAdmin = (permissions.T_ALL_PERMISSIONS === (permissions.T_ALL_PERMISSIONS & this.props.permissions));
    const url = Config.protokoll + Config.hostname + "/intern/api/platz.php?op=ra&p=" + court + "&ds=" + day + "&de=" + day;
    window.addEventListener('resize', this.handleWindowSizeChange);
    
    this.setState({isLoading : true});
    fetch(url, {credentials: 'same-origin'})
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
        let cn = computeBelClasses (r.starts_at, r.ends_at, r.booking_type, r.p1geb, r.p2geb, r.p3geb, r.p4geb);
        let spieler = 
            r.p1.replace(new RegExp("^[\\.\\s]+"), "") + spielerzusatz(r.p1geb)
          + (r.p2 ? ', ' + r.p2.replace(new RegExp("^[\\.\\s]+"), "") : ' ') + spielerzusatz(r.p2geb)
          + (r.p3 ? ', ' + r.p3.replace(new RegExp("^[\\.\\s]+"), "") : ' ') + spielerzusatz(r.p3geb)
          + (r.p4 ? ', ' + r.p4.replace(new RegExp("^[\\.\\s]+"), "") : ' ') + spielerzusatz(r.p4geb);
        if ( !userIsAdmin && (r.booking_type.match(/(ts-training)|(ts-nichtreservierbar)/ig)))
        {
          return ( 
            <div key={k} className={cn}>
              <strong>{r.starts_at.substring(11,16)}</strong> {spieler} 
              <div> {r.comment} </div>
            </div>
          )
        } else {
          return ( 
            <Link key={k} className={cn} to={{ pathname: '/belegungsdetails/update', state: {c: court, i: r.id, d: day} }}>
              <strong>{r.starts_at.substring(11,16)}</strong> {spieler}
              <div> {r.comment} </div>
            </Link>
          )
        }
      })
      this.setState({courtData: courtData});
      this.setState({isLoading : false});
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    // this.setState({ width: window.innerWidth });
    this.setState({ zumBelegungstag: true });
  };
  
  render() {
    return this.state.courtData;
  }
}

// CSS-Klassen bilden für die Positionierung und Höhe einer Blegung auf der Tafel
function computeBelClasses (s, e, bookingType, p1geb, p2geb, p3geb, p4geb) {

  // Dauer berechnen, also z. B. '2019-05-02 16:00:00' - '2019-05-02 14:00:00' = 120
  const dauer = (Number(e.substring(11,13))*60 + Number(e.substring(14,16))) - (Number(s.substring(11,13))*60 + Number(s.substring(14,16)));
  const bt = bookingType
  const overbooked = ( (bt === 'ts-einzel' && dauer > 60) || (bt === 'ts-doppel' && dauer > 120) 
                        || (e.substring(11,16) > "17:00" && (nvb(p1geb) || nvb(p2geb) || nvb(p3geb) || nvb(p4geb))) ) ? 'overbooked' : '';
  let cn = classNames(
    'D-' + dauer,
    'ts', 
    'T-' + s.substring(11, 16).replace(':', '-'),
    bt,
    overbooked
    );
  return cn;
}

export default Platz;
