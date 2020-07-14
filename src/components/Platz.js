import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { spielerzusatz } from './functions';
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
    const userIsAllowed = ((permissions.MANNSCHAFTSFUEHRER & this.props.permissions) > 0);
    const url = Config.protokoll + Config.hostname + "/intern/api/platz.php?op=ra&p=" + court + "&ds=" + day + "&de=" + day;
    window.addEventListener('resize', this.handleWindowSizeChange);
    
    this.setState({isLoading : true});
    fetch(url, {credentials: 'same-origin'})
    .then(result => {
      if (result.ok) {
        if (result.redirected) {
          // console.log("Platz.js/Checkuser: Authentifizierungsfehler")
          window.location.href = result.url
        }
        return result.json();
        } else {
          // In diesem Fall haben wir einen neuen, noch unbebuchten Tag
          this.setState({isLoading : false});
        }
      })
    .then (result => {
      let courtData = result.records.map ( r => {
        let k = r.id
        let spieler
        let cn = computeBelClasses (r.starts_at, r.ends_at, r.booking_type);
        spieler = formatSpieler(r, this.props.platzWide)

        if ( !userIsAllowed && (r.booking_type.match(/(ts-training)|(ts-punktspiele)|(ts-nichtreservierbar)|(ts-veranstaltung)/ig)))
        {
          return ( 
            <div key={k} className={cn}>
              <strong>{r.starts_at.substring(11,16)}</strong> {spieler} 
              <div> {r.comment} </div>
            </div>
          )
        } else {
          return ( 
            <Link key={k} className={cn} to={{ pathname: '/intern/tafel/belegung', state: {c: court, i: r.id, d: day, op: 'update'} }}>
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

// Spielernamen bilden
const formatSpieler = (r, platzWide) =>
{
  let spieler = []
  
  // Vorname und Name verketten. Vorname bei wenig Platz abkürzen
  spieler[0] = (r.p1vn ? (platzWide ? r.p1vn : r.p1vn.charAt(0) + '.') + ' ' + r.p1nn : (r.p1nn) ? r.p1nn : '') + spielerzusatz(r.p1geb, r.schnupper1)
  spieler[1] = (r.p2vn ? (platzWide ? r.p2vn : r.p2vn.charAt(0) + '.') + ' ' + r.p2nn : (r.p2nn) ? r.p2nn : '') + spielerzusatz(r.p2geb, r.schnupper2)
  spieler[2] = (r.p3vn ? (platzWide ? r.p3vn : r.p3vn.charAt(0) + '.') + ' ' + r.p3nn : (r.p3nn) ? r.p3nn : '') + spielerzusatz(r.p3geb, r.schnupper3)
  spieler[3] = (r.p4vn ? (platzWide ? r.p4vn : r.p4vn.charAt(0) + '.') + ' ' + r.p4nn : (r.p4nn) ? r.p4nn : '') + spielerzusatz(r.p4geb, r.schnupper4)
  
  // Führende Punkt und Whitespace entfernen, falls es sowas gibt
  spieler = spieler.map( s => s.replace(new RegExp(/^[\.\s]+/g), '') )
  
  spieler = spieler.join(', ')

  // ... und trailing Kommas, Whitespaces entfernen
  spieler = spieler.replace(new RegExp(/[,\s]*$/g), '')

  return spieler

}

// CSS-Klassen bilden für die Positionierung und Höhe einer Belegung auf der Tafel
const computeBelClasses = (s, e, bookingType) =>
{
  // Dauer berechnen, also z. B. '2019-05-02 16:00:00' - '2019-05-02 14:00:00' = 120
  const dauer = (Number(e.substring(11,13))*60 + Number(e.substring(14,16))) - (Number(s.substring(11,13))*60 + Number(s.substring(14,16)));
  const bt = bookingType
  let cn = classNames(
    'D-' + dauer,
    'ts', 
    'T-' + s.substring(11, 16).replace(':', '-'),
    bt
    );
  return cn;
}

export default Platz;
