import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";
import DayPicker from "./DayPicker";
import "./tafel.css";
import SwipeableViews from 'react-swipeable-views';
import config from './Defaults';
import {formatDate, isValidDate} from "./functions";

// Layout eines Tages

class Belegungstag extends Component {

  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      day: '',
      dayDate: '',
    };
  }    
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    let dayDate = this.props.match.params.day;
    if ( ! isValidDate(new Date(dayDate)) ) {
      dayDate = new Date();
    } else {
      dayDate = new Date(dayDate);
    }
    this.setState({ dayDate: dayDate, day: formatDate(dayDate) });
    // let day = "2019-05-02";
    this.setDay = this.setDay.bind(this);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  setDay(dString) {
    const d = new Date(dString);
    this.setState({dayDate: d, day: formatDate(d)});
  }
    
  render() {
    const { width } = this.state;
    const isMobile = width <= config.smartphoneWidth;
    if (isMobile) {
      return (
        <div>
          <DayPicker startswith={new Date()} day={this.state.day} onClickHandler={this.setDay} />
          <SwipeableViews>
            <div id="platz1"><Platz court="1" day={this.state.day} /></div>
            <div id="platz2"><Platz court="2" day={this.state.day} /></div>
            <div id="platz3"><Platz court="3" day={this.state.day} /></div>
            <div id="platz4"><Platz court="4" day={this.state.day} /></div>
            <div id="platz5"><Platz court="5" day={this.state.day} /></div>
            <div id="platz6"><Platz court="6" day={this.state.day} /></div>
          </SwipeableViews>
        </div>
      )
    } else {
      return (
        <div>
          <DayPicker startswith={new Date()} day={this.state.day} onClickHandler={ this.setDay } />
          <table className="table">
            <tbody>
              <tr className="platzDim">
                <td className="zeitleisteCol"><Zeitleiste /></td>
                <td id="platz1" className="platz"><Platz court="1" day={this.state.day} /></td>
                <td id="platz2" className="platz"><Platz court="2" day={this.state.day} /></td>
                <td id="platz3" className="platz"><Platz court="3" day={this.state.day} /></td>
                <td id="platz4" className="platz"><Platz court="4" day={this.state.day} /></td>
                <td id="platz5" className="platz"><Platz court="5" day={this.state.day} /></td>
                <td id="platz6" className="platz"><Platz court="6" day={this.state.day} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default Belegungstag;








