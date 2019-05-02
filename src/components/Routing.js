import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';


class Routing extends Component {
    render() {
      return (
        <Switch>
          <Route exact path='/belegungsdetails/:op' component={BelDetails} />
          <Route path='/:day' component={Belegungstag} />
          <Route component={Belegungstag} />
        </Switch>
      )
    }
}


export default Routing;
  