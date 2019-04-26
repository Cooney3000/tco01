import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';


class Routing extends Component {
    render() {
      return (
        <React.Fragment>
          <Route exact path='/belegungsdetails/:op' component={BelDetails} />
          {/* <Route exact path='/:day' component={Belegungstag} /> */}
          <Route component={Belegungstag} />
        </React.Fragment>
      )
    }
}


export default Routing;
  