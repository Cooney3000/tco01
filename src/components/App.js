import React, { Component } from 'react';
import Tagesanzeige from "./Tagesanzeige";
import Belegungstag from "./Belegungstag";

class App extends Component {
  
  state = { 
    bookingData : [],
  };

  componentDidMount () {
    const url = "http://localhost/api/api.php/records/bookings?filter=starts_at,ge,2018-12-27&filter=ends_at,lt,2018-12-28&order=starts_at";
    fetch(url)
        .then(result => result.json())
        .then(result => {
            this.setState({
                bookingData: result.records
            })
        })
        .catch(function(err) {
          console.log(err)
       });  
  }

  render() {
    return (
        <React.Fragment>
          <h1><Tagesanzeige /></h1>
          <Belegungstag bookingData={this.state.bookingData} />
        </React.Fragment>
    );
  }
}

export default App;