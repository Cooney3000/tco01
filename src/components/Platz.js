import React, { Component } from 'react';

// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
    componentWillMount() {
      this.setState ({ myClass: this.props.courtData.map( (e)=> {
        let dauer = ((new Date(e.ends_at)) - (new Date(e.starts_at)))/6000; // Umrechnung der Spieldauer in Minuten
        console.log(e);
        return ('ts D-' + dauer)
        })
      })
    }
    bearbeiteBelegung(b) {
      console.log("Belegung " + b + " in Bearbeitung!")
    }
    render() {
      console.log(this.props);
      return (
        <React.Fragment>
          {this.state.myClass.map( e=><div>e</div>)}
        </React.Fragment>
    );
  }
}

export default Platz;