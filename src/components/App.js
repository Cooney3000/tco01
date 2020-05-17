import React, { Component } from 'react';
import Routing from "./Routing";
import Config from "./Defaults";


class App extends Component 
{
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
  
  componentDidMount()
  {
    this.setState(() => ({ isLoading1: true , isLoading2: true}));
    
    if (Config.prod) 
    { 
      this.checkUser();
      this.setPermission();
    } 
    else 
    {
      // In der Testumgebung simulierter User
      this.setState(() => ({user: Config.testuser, permissions: Config.testuser.permissions}));
    }
  }

  checkUser() 
  {
    const url = Config.protokoll + Config.hostname + "/intern/api/checkuser.php?prod=";
    fetch(url, {credentials: 'same-origin'})
    .then( (res) => {
      if (res.ok) {
        res.json()
        .then( (user) => {
          if (user.retcode === 'OK') {
            this.setState(() => ({user: user, isLoading1: false}));
          } else {
            window.location.href = Config.protokoll + Config.hostname + Config.loginPage;
          }
        });
      }
    })
  }
  
  setPermission() 
  {
    const url = Config.protokoll + Config.hostname + "/intern/api/checkpermission.php";
    // console.log(url)
    fetch(url, {credentials: 'same-origin'})
    .then( (res) => {
      if (res.ok) {
        res.json()
        .then( (permissions) => {
          // console.log(permitted.retcode)
          this.setState(() => ({permissions: permissions.retcode, isLoading2: false}))
        })
      }
    })
  }
  
  render() 
  {
    const { isLoading1, isLoading2 } = this.state;
    if (Config.prod && (isLoading1 || isLoading2)) {
      return <p>Loading...</p>
    } else {
      return (
        <React.Fragment>
          <div className="container">
            <div className="row">
              <div className="col text-left">
                <img src="/images/tcoplain_0,1x.png" alt="TCO -Logo" />
              </div>
              <div className="col">
                <span className="h6 text-center ml-2"><a href="/intern/tafel/" id="appname">Platzbuchung</a></span> 
                <span className="text-center ml-2"><small> ({this.state.user.vorname + ' ' + this.state.user.nachname})</small></span>
              </div>
              <div className="col">
                <div className="small align-bottom"><span className="pl-5"><a href="/intern/logout.php"><img src="/images/logout.png" alt="Logout" /></a></span></div> 
              </div>
            </div>
          </div>
              
          <Routing userId = {this.state.user.id} permissions = {this.state.permissions}/>
          <footer className="blockquote-footer">(c) 2019 by Conny Roloff. Dem TC Olching zur kostenlosen Nutzung zur Verfügung gestellt.</footer>
        </React.Fragment>
      )}
    }
  }


export default App;
  