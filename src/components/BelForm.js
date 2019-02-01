import React, { Component } from 'react';

class BelForm extends Component {

  constructor(props){
    super(props);
    const { r } = props;
    let std = r.starts_at;
    let viertel = std.substring(14,16);
    std = std.substring(11,13);
    this.state = {
      std: std,
      viertel: viertel,
      p1: r.p1id,
      p2: r.p2id,
      p3: r.p3id,
      p4: r.p4id,
      spieler: [],
    };
  }
  componentWillMount() {
    const url = "http://localhost/intern/api/spieler.php";

    this.setState({isLoading : true});
    
    fetch(url)
    .then(result => {
      if (result.ok) {
          return result.json();
        } else {
          throw new Error('Fehler beim Laden der Spielerdaten');
        }
    })
    .then(result => {
      let spieler = result.records;
      // console.log(spieler);
      this.setState({ spieler: spieler })
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }
  render(){
    return (
      <div className="form-group">
        <form className="form-inline">
          <fieldset className="fields">
            <h4 className="d-inline">Start: </h4> 
            <select id="belStartStd" className="form-control" onChange={this.handleStdChange.bind(this)} value={this.state.std}>
              <option value="08">08</option>
              <option value="09">09</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
            <select id="belStartViertel" className="form-control" onChange={this.handleViertelChange.bind(this)} value={this.state.viertel}>
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
            <br />
            <h4>Spieler:</h4>
            <select id="belSpieler1" className="form-control" onChange={this.handleSpieler1Change.bind(this)} value={this.state.p1}>
              {this.state.spieler.map( r => {
                return (
                    <option key={'1-' + r.id} value={r.id}>{r.spieler}</option>
                )
              })}
            </select>
            <select id="belSpieler2" className="form-control" onChange={this.handleSpieler2Change.bind(this)} value={this.state.p2}>
              {this.state.spieler.map( r => {
                return (
                    <option key={'2-' + r.id} value={r.id}>{r.spieler}</option>
                )
              })}
            </select>
            <select id="belSpieler3" className="form-control" onChange={this.handleSpieler3Change.bind(this)} value={this.state.p3}>
              {this.state.spieler.map( r => {
                return (
                    <option key={'3-' + r.id} value={r.id}>{r.spieler}</option>
                )
              })}
            </select>
            <select id="belSpieler4" className="form-control" onChange={this.handleSpieler4Change.bind(this)} value={this.state.p4}>
              {this.state.spieler.map( r => {
                return (
                    <option key={'4-' + r.id} value={r.id}>{r.spieler}</option>
                )
              })}
            </select>
          </fieldset>
        </form>
      </div>
    )
  }
  handleViertelChange(e) {
    this.setState({
      viertel: e.target.value
    })
  }
  handleStdChange(e) {
    this.setState({
      std: e.target.value
    })
  }
  handleSpieler1Change(e) {
    this.setState({
      p1: e.target.value
    })
  }
  handleSpieler2Change(e) {
    this.setState({
      p2: e.target.value
    })
  }
  handleSpieler3Change(e) {
    this.setState({
      p3: e.target.value
    })
  }
  handleSpieler4Change(e) {
    this.setState({
      p4: e.target.value
    })
  }
}


export default BelForm;
  