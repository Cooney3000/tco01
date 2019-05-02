import React, { Component } from 'react';
import Routing from "./Routing";
import Config from './Defaults';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      isLoggedIn: false,
    };
  }
  
  // componentWillMount() {
  //   const url = Config.protokoll + Config.hostname + "/intern/api/checkuser.php";
  //   fetch(url)
  //   .then(result => {
  //     if (result.ok) {
  //       console.log('checking login status...');
  //     }
  //   });
          

  // }

  
  render() {
    return (
      <React.Fragment>
        <div className="p-1">
            <span className="logo"><a href="https://www.tcolching.de"><img src="/images/tcoplain_0,1x.png" alt="TCO -Logo" /></a></span> 
            <span className="w-75 text-center h4 align-middle ml-2">Platzbelegung</span> 
            <div className="small align-bottom"><span>(Wir verwenden Cookies!)</span><span>{this.state.isLoggedIn}</span></div>
        </div>
        <Routing />
      </React.Fragment>
    )
  };
  }


export default App;
  