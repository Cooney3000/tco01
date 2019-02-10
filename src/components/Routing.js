import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';
import Test from './Test';


class Routing extends Component {
    
    render() {
      return (
        <React.Fragment>
          <Route exact path='/' component={Belegungstag} />
          <Route exact path='/belegungsdetails/:id' component={BelDetails} />
          <Route exact path='/test' component={Test} />
        </React.Fragment>
      )
    }
}


export default Routing;
  