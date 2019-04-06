import React, { Component } from 'react';
import Zeitleiste from "./Zeitleiste";
import config from './Defaults';
import { connect } from "react-redux";
import { fetchBel } from "../actions/index";
import store from "../store/index";

// Alle Belegungen an diesem Tag für einen Platz

function mapStateToProps (state) {
  return { belegungen: state.belegungen };
};

class ConnectedPlatz extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      courtJSX : [],
      isLoading : false,
      error : false,
      width : window.innerWidth,
    };
  }
  componentWillMount() {
    const { court, day } = this.props;
    window.addEventListener('resize', this.handleWindowSizeChange);
    store.dispatch(fetchBel(court, day, day)); // Redux action
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  
  render() {
    const { width } = this.state;
    const isMobile = width <= config.smartphoneWidth;
    
    if (isMobile) {
    
      return (
        <table className="table">
          <tbody>
            <tr className="platzDim">
              <td className="zeitleisteCol"><Zeitleiste /></td>
              <td className="platz">
                <div className="platznummer">PLATZ {this.props.court}</div>
                {this.state.courtJSX}
              </td>
            </tr>
          </tbody>
        </table>
      );

    } else {

      return (
        <div>
          <div className="platznummer">PLATZ {this.props.court}</div>
          <div>{this.state.courtJSX}</div>
        </div>
      );  

    }
  }
}

const Platz = connect(mapStateToProps, {fetchBel} )(ConnectedPlatz);

export default Platz;