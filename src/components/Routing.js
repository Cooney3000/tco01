import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import BelDetails from './BelDetails';


class Routing extends Component {
    render() {
      return (
        <Switch>
          <Route exact path='/belegungsdetails/:op' render={(props) => <BelDetails {...props} userId={this.props.userId} permissions={this.props.permissions} />} />
          {/* <Route exact path='/belegungsdetails/:op' component={BelDetails} /> */}
          <Route path='/:day' render={(props) => <Belegungstag {...props} userId={this.props.userId} permissions={this.props.permissions} />} />
          <Route render={(props) => <Belegungstag {...props} userId={this.props.userId} permissions={this.props.permissions} />} />
        </Switch>
      )
    }
}


export default Routing;
  