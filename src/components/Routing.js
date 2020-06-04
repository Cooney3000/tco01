import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Belegungstag from './Belegungstag';
import Belegung from './Belegung';


class Routing extends Component {
    render() {
      return (
        <Switch>
          <Route exact path='/intern/tafel/belegung' render={(props) => <Belegung {...props} userId={this.props.userId} permissions={this.props.permissions} op={'update'} />} />
          <Route path='/:day' render={(props) => <Belegungstag {...props} userId={this.props.userId} permissions={this.props.permissions} day={} />} />
          <Route render={(props) => <Belegungstag {...props} userId={this.props.userId} permissions={this.props.permissions} />} />
        </Switch>
      )
    }
}


export default Routing;
  