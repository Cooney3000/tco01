import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';


class Routing extends Component {
    
    render() {
      return (
        <React.Fragment>
          <Route exact path='/' component={Belegungstag} />
          <Route exact path='/belegungsdetails/:id' component={BelDetails} />
        </React.Fragment>
      )
    }
}


export default Routing;
  