import React, { Component } from 'react';
import Platz from "./Platz";
import DayPicker from "./DayPicker";
import "./tafel.css";
import SwipeableViews from 'react-swipeable-views';
import config from './Defaults';
import {formatDate, isValidDate} from "./functions";
import { Link } from 'react-router-dom';

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
    let firstDaypickerDay = new Date();

    // //### TESTDATEN ###################
    // firstDaypickerDay = new Date(2020, 4, 22);
    
    const isMobile = (width <= config.smartphoneWidth);
    if (isMobile) {
      firstDaypickerDay.setDate(firstDaypickerDay.getDate() - config.daypickerDaysBeforeToday);
      const courtDiv = config.platzArray.map( (court) => {
        return (
          <div key={court} id={"platz" + court}>
            <table className="table">
              <tbody>
                <tr className="platzDim">
                  <td className="zeitleisteCol"><Zeitleiste /></td>
                  <td className="platz">
                    <div className="platznummer">
                      <span className="platzziffer">{court}</span> 
                      <Link to={{pathname: '/intern/tafel/belegung', state: {c: court, d: this.state.day, op: 'new'} }}><img  className="neuBtn p-1 rounded-circle" src="images/add.png" alt="Neue Belegung" /></Link> 
                    </div>
                    <div>
                      <Platz court={court} day={this.state.day} permissions={this.props.permissions} platzWide={true} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })
      return (
        <div>
          <DayPicker startswith={firstDaypickerDay} day={this.state.day} onClickHandler={this.setDay} />
          <SwipeableViews>
            {courtDiv}
          </SwipeableViews>
          <Legende />
        </div>
      )
    } else {
      firstDaypickerDay.setDate(firstDaypickerDay.getDate() - config.daypickerDaysBeforeTodayWide);
      const courtDiv = config.platzArray.map( (court) => {
        return (<td key={court} id={"platz" + court} className="platz">
          <div>
            <div className="platznummer">
              <span className="platzziffer rounded-circle">{court}</span> 
              <Link to={{pathname: '/intern/tafel/belegung', state: {c: court, d: this.state.day, op: 'new'} }}><img  className="neuBtn p-1 rounded-circle" src="images/add.png" alt="Neue Belegung" /></Link> 
            </div>
            <div>            
              <Platz court={court} day={this.state.day} permissions={this.props.permissions} platzWide={false} />
              </div>
            </div>
          </td>
        )
      })
      return (
        <div>
          <DayPicker startswith={firstDaypickerDay} day={this.state.day} onClickHandler={this.setDay} />
          <table className="table">
            <tbody>
              <tr className="platzDim">
                <td className="zeitleisteCol"><Zeitleiste /> </td>
                {courtDiv}
              </tr>
            </tbody>
          </table>
          <Legende />
        </div>
      )
    }
  }
}

const Zeitleiste = () => {
  let zeit = [];
  for (let s = config.dailyStartTime; s <= config.dailyEndTime; s++) {
    for (let m = 0; m < 60; m=m+60) {
      zeit.push (s.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0'));
    }
  } 
  return (
    <div className="zeitleiste">
      {
        zeit.map((e, index) => 
          <React.Fragment key={index}>
            <div className="stunde"><div className="stundetext">{e}</div></div>
            <div className="viertelstunde"></div>
            <div className="viertelstunde"></div>
            <div className="viertelstunde"></div>
          </React.Fragment>
        )
      }
    </div>
  );
}

const Legende = () => {
  return (
    <div className="container">
      <div className="row l-einzeldoppel p-0 pl-1 m-1">Einzel/Doppel</div>
      <div className="row l-turnier p-0 pl-1 m-1">Turnier</div>
      <div className="row l-trbuchung p-0 pl-1 m-1">Trainerbuchung</div>
      <div className="row l-veranstaltung p-0 pl-1 m-1">Veranstaltung</div>
      <div className="row l-punktspiele p-0 pl-1 m-1">Punktspiele</div>
      <div className="row l-training p-0 pl-1 m-1">Training</div>
      {/* <div className="row l-nichtreservierbar p-0 pl-1 m-1">Frei verfügbar / Anderes</div> */}
    </div>
  );
}

export default Belegungstag;








