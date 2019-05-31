import React, { Component } from 'react';
import Routing from "./Routing";
import config from "./Defaults";


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      user: {},
      isLoggedIn: false,
      permissions: 0,
      renderData: [],
      isLoading1: false,
      isLoading2: false,
    };
  }
  
  componentDidMount() {
    this.setState({ isLoading1: true , isLoading2: true});
    if (config.prod) { 
      this.checkUser();
      this.setPermission();
    } else {
      // In der Testumgebung simulierter User
      this.setState({user: {id:210, vorname:'ConnyTEST', nachname:'RoloffTEST'} });
      // this.setState({user: {id:212, vorname:'Norbert', nachname:'Maier'} });
      // this.setState({user: {id:220, vorname:'Peter', nachname:'Gallert'} });
    }
  }

  checkUser() {
    const url = config.protokoll + config.hostname + "/intern/api/checkuser.php";
    fetch(url, {credentials: 'same-origin'})
    .then( (res) => {
      if (res.ok) {
        res.json()
        .then( (user) => {
          if (user.retcode === 'OK') {
            this.setState({user: user, isLoading1: false});
          } else {
            window.location.href = config.protokoll + config.hostname + config.loginPage;
          }
        });
      } else {
        window.location.href = config.protokoll + config.hostname + config.loginPage;
      }
    })
  }
  setPermission() {
    const url = config.protokoll + config.hostname + "/intern/api/checkpermission.php";
    // console.log(url)
    fetch(url, {credentials: 'same-origin'})
    .then( (res) => {
      if (res.ok) {
        res.json()
        .then( (permissions) => {
          // console.log(permitted.retcode)
          this.setState({permissions: permissions.retcode, isLoading2: false})
        })
      }
    })
  }
  render() {
    const { isLoading1, isLoading2 } = this.state;
    if (config.prod && (isLoading1 || isLoading2)) {
      return <p>Loading...</p>
    } else {
      return (
        <React.Fragment>
          <div className="p-1">
              <span className="logo"><a href="https://www.tcolching.de"><img src="/images/tcoplain_0,1x.png" alt="TCO -Logo" /></a></span> 
              <span className="w-75 text-center h4 align-middle ml-2"><a href="/intern/tafel/" id="appname">Turnierplaner</a> ({this.state.user.vorname + ' ' + this.state.user.nachname})</span>
              <div className="small align-bottom"><span>(Wir verwenden Cookies!)</span><span className="pl-5"> 
              <a href="/intern/internal.php">->TCO Intern</a>&nbsp;&nbsp;&nbsp;<a href="/intern/logout.php">->Logout</a></span></div>
          </div>
          <Routing userId = {this.state.user.id} permissions = {this.state.permissions}/>
          <footer className="blockquote-footer">(c) 2019 by Conny Roloff. Dem TC Olching zur kostenlosen Nutzung zur Verfügung gestellt.</footer>
        </React.Fragment>
      )}
    }
  }


export default App;
  