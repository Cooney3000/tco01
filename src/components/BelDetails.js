import React, { Component } from 'react';
import BelForm from './BelForm';
import { Link } from 'react-router-dom';
import Config from './Defaults';

class BelDetails extends Component {

  constructor(props) {
    super(props);
    
    //let testdata = [{"id":3,"booking_state":"#","created_at":"2018-12-28 10:52:41","updated_at":"2018-12-28 10:52:41","user_id":20,"player1":21,"player2":22,"player3":23,"player4":24,"court":1,"starts_at":"2018-12-27 09:00:00","ends_at":"2018-12-27 10:00:00","booking_type":"Einzel","price":"0"},{"id":7,"booking_state":"A","created_at":"2018-12-28 10:52:41","updated_at":"2018-12-28 10:52:41","user_id":20,"player1":21,"player2":22,"player3":23,"player4":24,"court":2,"starts_at":"2018-12-27 09:00:00","ends_at":"2018-12-27 10:00:00","booking_type":"Einzel","price":"0"},{"id":1,"booking_state":"A","created_at":"2018-12-28 08:57:32","updated_at":"2018-12-28 08:57:32","user_id":2,"player1":8,"player2":9,"player3":0,"player4":0,"court":1,"starts_at":"2018-12-27 10:00:00","ends_at":"2018-12-27 11:00:00","booking_type":"Einzel","price":"0"},{"id":2,"booking_state":"A","created_at":"2018-12-28 10:50:18","updated_at":"2018-12-28 10:50:18","user_id":2,"player1":10,"player2":11,"player3":0,"player4":0,"court":1,"starts_at":"2018-12-27 11:00:00","ends_at":"2018-12-27 12:00:00","booking_type":"Einzel","price":"0"},{"id":9,"booking_state":"A","created_at":"2018-12-28 10:52:41","updated_at":"2018-12-28 10:52:41","user_id":20,"player1":21,"player2":22,"player3":23,"player4":24,"court":3,"starts_at":"2018-12-27 14:00:00","ends_at":"2018-12-27 15:00:00","booking_type":"Einzel","price":"0"},{"id":8,"booking_state":"A","created_at":"2018-12-28 10:50:18","updated_at":"2018-12-28 10:50:18","user_id":2,"player1":10,"player2":11,"player3":0,"player4":0,"court":1,"starts_at":"2018-12-27 16:00:00","ends_at":"2018-12-27 17:00:00","booking_type":"Einzel","price":"0"}];
    
    this.state = { 
      belegung : [],
      isLoading : false,
      error : false,
    };
  }  
  componentWillMount() {
    const id = this.props.match.params.id;
    const url = Config.hostname + "/intern/api/platz.php?op=r&i=" + id;
    // console.log(url);

    this.setState({isLoading : true});
    
    fetch(url)
    .then(result => {
      if (result.ok) {
          return result.json();
        } else {
          throw new Error('Fehler beim Laden der Platzbuchungsdetails');
        }
    })
    .then(result => {
      let belegung = result.records.map( r => {
        return (
          <div key={r.id} className="p-2 w-50">
              <Link to="/"><p className="btn btn-secondary">Zurück</p></Link>
              <BelForm r={r} />
          </div>
        )
      })
      this.setState({ belegung: belegung })
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    return (
      <div>{this.state.belegung}</div>
    );
  }
}


export default BelDetails;
  