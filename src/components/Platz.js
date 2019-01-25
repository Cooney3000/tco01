import React, { Component } from 'react';
import classNames from 'classnames';

// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { 
      bClass: '',
    };
  }
  computeBClass() {
    let s = this.props.starts_at;
    let e = this.props.ends_at;
    let bClass = 'D-' + ((new Date(e)) - (new Date(s)))/6000; // Umrechnung der Spieldauer in Minuten
    //console.log(s + '####' + e);
    //belegungClass += ' ' + s.substring()
  }
  render() {
    this.computeBClass();
    return (
      <React.Fragment>
        {this.props.starts_at}
      </React.Fragment>
    );
  }
}

export default Platz;