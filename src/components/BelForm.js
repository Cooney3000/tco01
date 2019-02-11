import React, { Component } from 'react';
import Config from './Defaults';
import { Redirect } from 'react-router';
import classNames from 'classnames';


class BelForm extends Component {
  
  /////// TO DO: richtige User Id der Session einfügen!!
  userId = 8;

  constructor(props){
    super(props);
    const { r } = props;
    // Daten für Datum, Start und Ende extrahieren
    let [sd, st] = r.starts_at.split(' ');
    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
    // console.log("DATE: " + sd + " TIME: " + st);
    this.state = {
      r : r,
      spieltag: sdA[2] + '.' + sdA[1] + '.' + sdA[0],
      startsAtDate: sd,
      endsAtDate: ed,
      startsAtStd: st.substring(0,2),
      startsAtViertel: st.substring(3,5),
      endsAtStd: et.substring(0,2),
      endsAtViertel: et.substring(3,5),
      bookingType: r.booking_type,
      p1: r.p1id,
      p2: r.p2id,
      p3: r.p3id,
      p4: r.p4id,
      spieler: [],
      court: r.court,
      spielzeitClassnames : '',
      zurTafel: false,
    };
  }
  
  componentWillMount() {
    // Alle Spieler für die Select-Auswahl laden    
    const url = Config.hostname + "/intern/api/spieler.php";
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

  componentDidMount () {
    this.setState({spielzeitClassnames : document.getElementById('startsAtStd').className});
    // console.log(this.state.spielzeitClassnames);
  }

  render(){
    if (this.state.zurTafel === true) {
      return <Redirect to='/' />
    }
    // console.log("startsAtStd:" + this.state.startsAtStd);
    return (
      <div>
        <h1>Spieltag: {this.state.spieltag}</h1>
        <form className="form-inline">
          <fieldset className="fields">
            <div><strong>Platz</strong></div>
            <div className="form-group">
              <select id="court" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.court}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
            <div><strong>Start</strong> <span id="startsAtInvalid" className="invalidText"></span></div>
            <div className="form-group">
              <select id="startsAtStd" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.startsAtStd}>
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
              <select id="startsAtViertel" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.startsAtViertel}>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <div><strong>Ende</strong></div>
            <div className="form-group">
              <select id="endsAtStd" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.endsAtStd}>
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
              <select id="endsAtViertel" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.endsAtViertel}>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <br />
            <select id="bookingType" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.bookingType}>
                <option value="Einzel">Einzel</option>
                <option value="Doppel">Doppel</option>
                <option value="Turnier">Turnier</option>
            </select>
            <br />
            <div><strong>Spieler</strong></div>
            <div className="form-group">
              <select id="p1" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.p1}>
                {this.state.spieler.map( r => {
                  return (
                      <option key={'p1' + r.id} value={r.id}>{r.spieler}</option>
                      )
                })}
              </select>
              <select id="p2" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.p2}>
                {this.state.spieler.map( r => {
                  return (
                    <option key={'p2' + r.id} value={r.id}>{r.spieler}</option>
                    )
                })}
              </select>
            </div>
            <div className="form-group">
              { this.state.p3 > 0 ?
                  <select id="p3" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.p3}>
                    {this.state.spieler.map( r => {
                      return (
                        <option key={'p3' + r.id} value={r.id}>{r.spieler}</option>
                      )
                    })}
                  </select>
                : ''
              }
              { this.state.p4 > 0 ?
                  <select id="p4" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.p4}>
                    {this.state.spieler.map( r => {
                      return (
                          <option key={'p4' + r.id} value={r.id}>{r.spieler}</option>
                      )
                    })}
                  </select>
                : ''
              }
            </div>
            <button type="submit" onClick={e => {this.handleSave(e); return this.setState({ zurTafel: true })}}  className="btn btn-primary">Speichern</button>
            <button type="submit" onClick={e => {this.handleDelete(e); return this.setState({ zurTafel: true })}}  className="btn btn-primary">Löschen</button>
          </fieldset>
        </form>
      </div>
    )
  }

  handleSave(e) {
    // console.log("SAVE FORM DATA NOW!");
    let url = Config.hostname 
                + '/intern/api/platz.php?op=cu' 
                + '&i=' + this.state.r.id
                + '&ds=' + this.state.startsAtDate + ' ' + this.state.startsAtStd + ':' + this.state.startsAtViertel
                + '&de=' + this.state.endsAtDate + ' ' + this.state.endsAtStd + ':' + this.state.endsAtViertel
                + '&uid=' + this.userId
                + '&p1=' + this.state.p1
                + '&p2=' + this.state.p2
                + '&p3=' + this.state.p3
                + '&p4=' + this.state.p4
                + '&c=' + this.state.court
                + '&t=' + this.bookingType
                + '&pr=0'
                ;
    fetch(url)
    .then(result => {
      if (result.ok) {
        return result.json();
      } else {
        throw new Error('Fehler beim Erzeugen/Updaten der Belegung' + this.state.r.id);
        }
      })
    .catch(error => this.setState({ error, isLoading: false }));

    e.preventDefault();
  }
  handleDelete(e) {
    // console.log("DELETE ROW NOW!" + this.state.r.id);
    let url = Config.hostname 
                + '/intern/api/platz.php?op=d' 
                + '&i=' + this.state.r.id
                ;
    fetch(url)
    .then(result => {
      if (result.ok) {
        return result.json();
      } else {
        throw new Error('Fehler beim Löschen der Belegung' + this.state.r.id);
        }
      })
    .catch(error => this.setState({ error, isLoading: false }));
    
    e.preventDefault();
  }
  handleChange(e) {
    const id = e.target.id;
    this.setState({
      [e.target.id] : e.target.value
    })
    if (id.match(/(startsAtStd)|(startsAtViertel)|(endsAtStd)|(endsAtViertel)/ig)) {
      this.clearSpielzeit();
      this.validateSpielzeit();
    }    
  }
  
  clearSpielzeit() {
    document.getElementById("startsAtInvalid").innerHTML = ''
    const selects = document.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
      if (selects[i].id.match(/(startsAtStd)|(startsAtViertel)|(endsAtStd)|(endsAtViertel)/ig)) {
        selects[i].className =  classNames({[this.state.spielzeitClassnames] : true}, {invalidFeedback: false});
      }
    }
  }
  
  validateSpielzeit() {
    // Ende vor Start?
    const s = this.state.startsAtStd + this.state.startsAtViertel;
    const e = this.state.endsAtStd + this.state.endsAtViertel;
    console.log("Validate: " + s + ', ' + e + ', ' + (s >= e));
    if (s >= e) {
      document.getElementById("startsAtInvalid").innerHTML = "- Der Start muss vor dem Ende liegen!";
      const selects = document.querySelectorAll('select');
      for (let i = 0; i < selects.length; i++) {
        if (selects[i].id.match(/(startsAtStd)|(startsAtViertel)|(endsAtStd)|(endsAtViertel)/ig)) {
          selects[i].className = classNames({[this.state.spielzeitClassnames] : true}, {invalidFeedback: true});
        }
      }
      return;
    }
    // Überschneidung mit anderer Belegung?
    console.log(this.state.r.starts_at);
  }  
  
}

export default BelForm;
  