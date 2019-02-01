import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';


class Routing extends Component {
    
    render() {
      return (
        <div>
          <Route exact path='/' component={Belegungstag} />
          <Route exact path='/belegungsdetails/:id' component={BelDetails} />
        </div>
      )
    }
}


export default Routing;
  