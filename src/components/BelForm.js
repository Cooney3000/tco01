import React, { Component } from 'react';
import Config from './Defaults';
import { Redirect } from 'react-router';


class BelForm extends Component {
  
  /////// TO DO: richtige User Id der Session einfügen!!
  userId = 8;

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    const { r } = props;
    // Daten für Datum, Start und Ende extrahieren
    let [sd, st] = r.starts_at.split(' ');
    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
    let doppel = (r.booking_type === "Doppel") ? true : false;
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
      zurTafel: false,
      doppel: doppel,
      fehlerSpielzeit: false,
      fehlerSpielzeitTxt: '',
      spielzeitClassnames: 'form-control',
      invalidClassname: '',
      saveActive: false,
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

  render(){
    // console.log("startsAtStd:" + this.state.startsAtStd);
    if (this.state.zurTafel === true) {
      return <Redirect to='/' />
    }
    return (
      <div>
        <h1>Spieltag: {this.state.spieltag}</h1>
        <form className="form-inline">
          <fieldset className="fields">
            <div><strong>Platz</strong></div>
            <div className="form-group">
              <select id="court" className="form-control" onChange={this.handleChange} value={this.state.court}>
                <option value="--">--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
            <div><strong>Start</strong> <span id="startsAtInvalid" className="invalidText">{this.state.fehlerSpielzeitTxt}</span></div>
            <div className="form-group">
              <select id="startsAtStd" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassname} onChange={this.handleChange} value={this.state.startsAtStd}>
                <option value="--">--</option>
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
              <select id="startsAtViertel" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassname} onChange={this.handleChange} value={this.state.startsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <div><strong>Ende</strong></div>
            <div className="form-group">
              <select id="endsAtStd" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassname} onChange={this.handleChange} value={this.state.endsAtStd}>
                <option value="--">--</option>
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
              <select id="endsAtViertel" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassname} onChange={this.handleChange} value={this.state.endsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <br />
            <select id="bookingType" className="form-control" onChange={this.handleChange} value={this.state.bookingType}>
                <option value="Einzel">Einzel</option>
                <option value="Doppel">Doppel</option>
                <option value="Turnier">Turnier</option>
                <option value="Punktspiele">Punktspiele</option>
                <option value="Training">Training</option>
            </select>
            <br />
            <div><strong>Spieler</strong></div>
            <div className="form-row">
              <select id="p1" className="form-control" onChange={this.handleChange} value={this.state.p1}>
                <option value="none">- Bitte auswählen -</option>
                <option value="Gast">Gast</option>
                {this.state.spieler.map( r => {
                  return (
                      <option key={'p1' + r.id} value={r.id}>{r.spieler}</option>
                      )
                })}
              </select>
              <select id="p2" className="form-control" onChange={this.handleChange} value={this.state.p2}>
                 <option value="none">- Bitte auswählen -</option>
                 <option value="Gast">Gast</option>
                  {this.state.spieler.map( r => {
                     return (
                     <option key={'p2' + r.id} value={r.id}>{r.spieler}</option>
                      )
                  })}
              </select>
            </div>
            <div className="form-row">
              { (this.state.doppel) ?
                  <select id="p3" className="form-control" onChange={this.handleChange} value={this.state.p3}>
                    <option value="none">- Bitte auswählen -</option>
                    <option value="Gast">Gast</option>
                    {this.state.spieler.map( r => {
                      return (
                        <option key={'p3' + r.id} value={r.id}>{r.spieler}</option>
                      )
                    })}
                  </select>
                : ''
              }
              { (this.state.doppel) ?
                  <select id="p4" className="form-control" onChange={this.handleChange} value={this.state.p4}>
                    <option value="none">- Bitte auswählen -</option>
                    <option value="Gast">Gast</option>
                    {this.state.spieler.map( r => {
                      return (
                          <option key={'p4' + r.id} value={r.id}>{r.spieler}</option>
                      )
                    })}
                  </select>
                : ''
              }
            </div>
            <button type="submit" onClick={e => {this.handleSave(e)}}  className="btn btn-primary m-1" disabled={!this.state.saveActive}>Speichern</button> 
            <button type="submit" onClick={e => {this.handleDelete(e)}}  className="btn btn-primary m-2">Löschen</button>
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
                + '&t=' + this.state.bookingType
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
      .then(result => {
        let rc = result.records.map ( r => {
            return r.returncode;
        })[0]
        if (rc === 'ok') { 
          this.setState({ zurTafel: true })
        } else {
          this.setState({fehlerSpielzeitTxt: '- Spielzeit bereits belegt!', fehlerSpielzeit: true});
          this.setState({invalidClassname: 'invalidFeedback'});
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
        this.setState( { zurTafel: true } );
      } else {
        throw new Error('Fehler beim Löschen der Belegung' + this.state.r.id);
      }
    })
    e.preventDefault();
  }
  handleChange(e) {
    let s = {};
    s = {
      id: e.target.id, 
      value: e.target.value,
    };
    if (s.id === "bookingType") {
      if (s.value === "Doppel") 
      {
        this.setState({doppel: true, p3: 0, p4: 0});
      } else {
        this.setState({doppel: false});
      }
    }    
    this.setState({[s.id] : s.value}, () => {
      if (s.id.match(/(startsAtStd)|(startsAtViertel)|(endsAtStd)|(endsAtViertel)|(court)|(p1)|(p2)|(p3)|(p4)/ig)) {
        this.clearSpielzeitFehler();
        this.validateSpielzeit();
      }    
    });
  }
  
  clearSpielzeitFehler() {
    this.setState({fehlerSpielzeitTxt: '', fehlerSpielzeit: false, invalidClassname: ''});
    this.setState({saveActive: true});
  }
  
  validateSpielzeit() {
    // Ende vor Start?
    const start = this.state.startsAtStd + this.state.startsAtViertel;
    const ende = this.state.endsAtStd + this.state.endsAtViertel;
    // console.log("Validate: " + start + ', ' + ende + ', ' + (start >= ende));
    if (start >= ende) {
      this.setState({fehlerSpielzeitTxt: '- Der Start muss vor dem Ende liegen!', fehlerSpielzeit: true});
      this.setState({invalidClassname: 'invalidFeedback'});
      this.setState({saveActive: false});
    return;
    } else if ((ende - start) > 200) {  // 200 sind 2 Stunden (z. B. "1500" - "1300")
      this.setState({fehlerSpielzeitTxt: '- Maximal 120 Minuten buchbar!', fehlerSpielzeit: true});
      this.setState({invalidClassname: 'invalidFeedback'});
      this.setState({saveActive: false});
  }
    // console.log(this.state.r.starts_at);
  }  
  
}

export default BelForm;
  