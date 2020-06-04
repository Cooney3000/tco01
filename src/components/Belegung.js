import React, { Component } from 'react';
import BelForm from './BelForm';
import { Link } from 'react-router-dom';
import Config from './Defaults';

class Belegung extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      belegung : [],
      isLoading : false,
      error : false,
    };
  }  
  componentWillMount() {
    const {op} = this.props.location.state;
    if (op === "update") {
      const {i, d} = this.props.location.state;
      this.updateBel(i, d);
    } else if (op === "new") {
      const {c, d} = this.props.location.state;
      this.newBel(c, d);
    }
  }
  
  updateBel(id, day) {
    const url = Config.protokoll + Config.hostname + "/intern/api/platz.php?op=r&rid=" + id;
    // console.log(url);
  
    this.setState({isLoading : true});
    
    fetch(url, {credentials: 'same-origin'})
    .then(result => {
      if (result.ok) {
        if (result.redirected) {
          console.log("BelDetails.js/Checkuser: Authentifizierungsfehler")
          // window.location.href = result.url
        }
        return result.json();
      } else {
        throw new Error('Fehler beim Laden der Platzbuchungsdetails');
      }
    })
    .then(result => {
      let belegung = result.records.map( r => {
        return (
          <div key={r.id} className="p-2">
              <Link to={'/' + day}><p className="btn btn-secondary">Zurück</p></Link>
              <BelForm r={r} userId={this.props.userId} permissions={this.props.permissions} />
          </div>
        )
      })
      this.setState({ belegung: belegung })
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }
  
  newBel(court, day)
  {
    let r = getEmptyBel(court, day);
    let belegung = [
        <div key={-1} className="p-2">
            <Link to={'/' + day}><p className="btn btn-secondary">Zurück</p></Link>
            <BelForm r={r} userId={this.props.userId} permissions={this.props.permissions} />
        </div>
    ];
    this.setState({ belegung: belegung })
  }
  
  render() {
    return (
      <div>{this.state.belegung}</div>
    );
  }
}

function getEmptyBel(court, day) {
  return {
    id: 0,
    user_id: 0,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    court: court,
    starts_at: day + ' 08:00:00',
    ends_at: day + ' 09:00:00',
    booking_type: '',
    geburtsdatum: '0000-00-00',
    p1id: 0,
    p2id: 0,
    p3id: 0,
    p4id: 0,    
  }
}
export default Belegung;
  