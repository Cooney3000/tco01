import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";
import "./tafel.css";
import SwipeableViews from 'react-swipeable-views';
import config from './Defaults';

// Layout eines Tages

class Belegungstag extends Component {

  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };
  }    
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  
  render() {
    //const day = (new Date()).toString("yyyy-MM-dd");
    const day = "2019-05-02";
    console.log("RENDER BELTAG!");

    const { width } = this.state;
    const isMobile = width <= config.smartphoneWidth;
    if (isMobile) {
      return (
        <div>
          <SwipeableViews>
            <div><Platz court="1" day={day} /></div>
            <div><Platz court="2" day={day} /></div>
            <div><Platz court="3" day={day} /></div>
            <div><Platz court="4" day={day} /></div>
            <div><Platz court="5" day={day} /></div>
            <div><Platz court="6" day={day} /></div>
          </SwipeableViews>
        </div>
      )
    } else {
      return (
        <div>
          <table className="table">
            <tbody>
              <tr className="platzDim">
                <td className="zeitleisteCol"><Zeitleiste /></td>
                <td className="platz"><Platz court="1" day={day} /></td>
                <td className="platz"><Platz court="2" day={day} /></td>
                <td className="platz"><Platz court="3" day={day} /></td>
                <td className="platz"><Platz court="4" day={day} /></td>
                <td className="platz"><Platz court="5" day={day} /></td>
                <td className="platz"><Platz court="6" day={day} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default Belegungstag;








