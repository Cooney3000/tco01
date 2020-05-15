import React, { Component } from 'react';
import Config, { permissions } from './Defaults';
import { Redirect } from 'react-router';
import { spielerzusatz, nvb } from './functions';
import _ from 'lodash';
import Holidays from 'date-holidays';


class BelForm extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.validateIfNecessary = this.validateIfNecessary.bind(this);
    this.clearFehler = this.clearFehler.bind(this);
    this.validateForm = this.validateForm.bind(this);
    
    const { r } = props;
    // Daten für Datum, Start und Ende extrahieren
    let [sd, st] = r.starts_at.split(' ');
    const dateIsToday = ((new Date(sd)).getDate() === (new Date()).getDate());

    // Initialer Wert für neue Buchungen. Wenn Einzel/Doppel erlaubt/nicht erlaubt sind, hier ändern
    const bookingType = (r.booking_type === '') ? (dateIsToday ? 'ts-einzel' : 'ts-turnier') : r.booking_type;
    // const bookingType = (r.booking_type === '') ? 'ts-turnier' : r.booking_type;
    const deleteActive = r.booking_type.match(/(ts-training)|(ts-nichtreservierbar)/ig) ? (permissions.T_ALL_PERMISSIONS === (permissions.T_ALL_PERMISSIONS & this.props.permissions)) : true;

    // console.log(deleteActive)

    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
    let doppel = (r.booking_type === "ts-doppel") ? true : false;
    // console.log("DATE: " + sd + " TIME: " + st);
    this.state = {
      r: r,
      spieltag: sdA[2] + '.' + sdA[1] + '.' + sdA[0],
      startsAtDate: sd,
      endsAtDate: ed,
      startsAtStd: st.substring(0, 2),
      startsAtViertel: st.substring(3, 5),
      endsAtStd: et.substring(0, 2),
      endsAtViertel: et.substring(3, 5),
      bookingType: bookingType,
      comment: (typeof r.comment === "undefined") ? "" : r.comment,
      p1: r.p1id,
      p2: r.p2id,
      p3: r.p3id,
      p4: r.p4id,
      p1geb: r.p1geb,
      p2geb: r.p2geb,
      p3geb: r.p3geb,
      p4geb: r.p4geb,
      spieler: [],
      court: r.court,
      zurTafel: false,
      doppel: doppel,
      fehlerSpielzeit: false,
      fehlerSpielzeitTxt: '',
      fehlerSpieler: false,
      fehlerSpielerTxt: '',
      spielzeitClassnames: 'form-control',
      invalidClassnameSpielzeit: '',
      invalidClassnameSpieler: '',
      saveActive: false,
      deleteActive: deleteActive,
      admin: false,
      dateIsToday: dateIsToday,
      overbooked: false,
      jugend: false,
      nichtVollBerechtigte: false,
    };

  }

  componentWillMount() {
    // Alle Spieler für die Select-Auswahl laden    
    let url = Config.protokoll + Config.hostname + "/intern/api/spieler.php";
    this.setState({ isLoading: true });
    fetch(url, { credentials: 'same-origin' })
      .then(result => {
        if (result.ok) {
          // console.log(result);
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

  render() {
    // console.log("startsAtStd:" + this.state.startsAtStd);
    if (this.state.zurTafel === true) {
      return <Redirect to={'/' + this.state.startsAtDate} />
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
              <select id="startsAtStd" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassnameSpielzeit} onChange={this.handleChange} value={this.state.startsAtStd}>
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
              <select id="startsAtViertel" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassnameSpielzeit} onChange={this.handleChange} value={this.state.startsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <div><strong>Ende</strong></div>
            <div className="form-group">
              <select id="endsAtStd" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassnameSpielzeit} onChange={this.handleChange} value={this.state.endsAtStd}>
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
                <option value="21">21</option>
              </select>
              <select id="endsAtViertel" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassnameSpielzeit} onChange={this.handleChange} value={this.state.endsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <br />
            <div><strong>Buchungstyp</strong></div>
            <select id="bookingType" className="form-control" onChange={this.handleChange} value={this.state.bookingType}>
              <option className="{ (! this.state.dateIsToday) ? 'aaa' : 'bbb'}" disabled={ ! this.state.dateIsToday} value="ts-einzel">Einzel</option>
              <option className="{ (! this.state.dateIsToday) ? 'aaa' : 'bbb'}" disabled={ ! this.state.dateIsToday} value="ts-doppel">Doppel</option>
              <option value="ts-turnier">Turnier</option>
              {/* (permissions.VORSTAND & this.props.permissions) */}
              <option className="{ (! (permissions.VORSTAND & this.props.permissions)) ? 'aaa' : 'bbb'}" disabled={ (permissions.VORSTAND & this.props.permissions)} value="ts-punktspiele">Punktspiele</option>
              <option className="{ (! (permissions.VORSTAND & this.props.permissions)) ? 'aaa' : 'bbb'}" disabled={ (permissions.VORSTAND & this.props.permissions)} value="ts-training">Training</option>
              <option className="{ (! (permissions.VORSTAND & this.props.permissions)) ? 'aaa' : 'bbb'}" disabled={ (permissions.VORSTAND & this.props.permissions)} value="ts-nichtreservierbar">Nicht reservierbar</option>
            </select>
            <br />
            <div><strong>Spieler</strong> <span id="playerInvalid" className="invalidText">{this.state.fehlerSpielerTxt}</span></div>
            <div className="form-row">
              <select id="p1" className={this.state.spielzeitClassnames + ' ' + this.state.invalidClassnameSpieler} onChange={this.handleChange} value={this.state.p1}>
                <option value="none">- Bitte auswählen -</option>
                {this.state.spieler.map(r => {
                  // console.log(r.geburtsdatum)
                  return (
                    // <option key={'p1' + r.id} value={r.id + Config.stringSeparator + r.geburtsdatum}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    <option key={'p1' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                  )
                })}
              </select>
              <select id="p2" className="form-control" onChange={this.handleChange} value={this.state.p2}>
                <option value="0">- Bitte auswählen -</option>
                {this.state.spieler.map(r => {
                  return (
                    <option key={'p2' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                  )
                })}
              </select>
            </div>
            <div className="form-row">
              {(this.state.doppel) ?
                <select id="p3" className="form-control" onChange={this.handleChange} value={this.state.p3}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p3' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    )
                  })}
                </select>
                : ''
              }
              {(this.state.doppel) ?
                <select id="p4" className="form-control" onChange={this.handleChange} value={this.state.p4}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p4' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    )
                  })}
                </select>
                : ''
              }
            </div>

            <div><strong>Bemerkung</strong></div>
            <div className="form-group">
              <input type="text" id="comment" className="form-control w-100" onChange={this.handleChange} value={this.state.comment} placeholder="Spielergebnis, Gastname, ..." />
            </div>

            <button type="submit" onClick={e => { this.handleSave(e) }} className="btn btn-primary m-1" disabled={!this.state.saveActive}>Speichern</button>
            <button type="submit" onClick={e => { this.handleDelete(e) }} className="btn btn-primary m-2" disabled={!this.state.deleteActive}>Löschen</button>
          </fieldset>
        </form>
      </div>
    )
  }

  handleSave(e) 
  {
    e.preventDefault();
    // console.log("SAVE FORM DATA NOW!");
    let parameters =
      '?op=cu'
      + '&rid=' + this.state.r.id
      + '&ds=' + this.state.startsAtDate + ' ' + this.state.startsAtStd + ':' + this.state.startsAtViertel
      + '&de=' + this.state.endsAtDate + ' ' + this.state.endsAtStd + ':' + this.state.endsAtViertel
      + '&uid=' + this.props.userId
      + '&p1=' + this.state.p1
      + '&p2=' + this.state.p2
      + '&p3=' + this.state.p3
      + '&p4=' + this.state.p4
      + '&c=' + this.state.court
      + '&t=' + this.state.bookingType
      + '&cmt=' + this.state.comment
      + '&pr=0'
      ;
    let url = Config.protokoll + Config.hostname
      + '/intern/api/platz.php'
      + parameters;
    // console.log(url);
    fetch(url, { credentials: 'same-origin' })
      .then(result => {
        if (result.ok) {
          // console.log(result.body);
          return result.json();
        } else {
          throw new Error('Fehler beim Erzeugen/Updaten der Belegung' + this.state.r.id);
        }
      })
      .then(result => {
        let rc = result.records[0].returncode;
        if (rc === 'ok') {
          // Logging der Buchung
          let logurl =
            Config.protokoll
            + Config.hostname
            + Config.buchungenlog
            + parameters;
          fetch(logurl, { credentials: 'same-origin' }); // Wenn Logging fehlschlagen sollte, dann verzichten wir eben darauf
          this.setState({ zurTafel: true })
        } else {
          this.setState({ fehlerSpielzeitTxt: '- Spielzeit bereits belegt!', fehlerSpielzeit: true });
          this.setState({ invalidClassnameSpielzeit: 'invalidFeedback' });
        }
      })
    // .catch(error => this.setState({ error, isLoading: false }));
    // e.preventDefault();
  }

  handleDelete(e) 
  {
    // FEHLT: Prüfung: Wenn der Buchungsstart in der Vergangenheit liegt, wird nicht gelöscht, auf keinen Fall GAST-Buchungen
    const sdStr = this.state.startsAtDate + 'T' + this.state.startsAtStd + ':' + this.state.startsAtViertel + "Z";
    const sd = new Date(sdStr);
    const jetzt = new Date();

    e.preventDefault();
    // console.log("DELETE ROW NOW!" + this.state.r.id);
    
    if (sd >= jetzt || (permissions.VORSTAND & this.props.permissions)) {
      let parameters =
        '?op=d'
        + '&rid=' + this.state.r.id
        + '&uid=' + this.props.userId;
      let url =
        Config.protokoll
        + Config.hostname
        + Config.platzbuchungen
        + parameters;
      fetch(url, { credentials: 'same-origin' })
        .then(result => {
          if (result.ok) {
            // Logging der Buchung
            let logurl = Config.protokoll + Config.hostname
              + Config.buchungenlog
              + parameters;
            fetch(logurl, { credentials: 'same-origin' });
            this.setState({ zurTafel: true });
          }
        })
    } else {
      this.setState({ zurTafel: true });
    }
    e.preventDefault();

  }

  handleChange(e) 
  {
    e.preventDefault();
    let s = {};
    s = {
      id: e.target.id,
      value: e.target.value,
    };
    if (s.id === "bookingType") {
      if (s.value === "ts-doppel") {
        this.setState({ doppel: true, p3: 0, p4: 0 });
      } else {
        this.setState({ doppel: false, p3: 0, p4: 0 });
      }
    }
    this.setState({[s.id]: s.value}, 
      this.validateIfNecessary(s.id)
      );
    
  }

  validateIfNecessary(id) 
  {
    if (id.match(/(startsAtStd)|(startsAtViertel)|(endsAtStd)|(endsAtViertel)|(court)|(p1)|(p2)|(p3)|(p4)|(bookingType)|(comment)/ig)) 
    {
      this.clearFehler();
      this.validateForm();
      if (this.state.bookingType.match(/(ts-training)|(ts-nichtreservierbar)/ig)) 
      {
        this.setState({ deleteActive: (permissions.T_ALL_PERMISSIONS === (permissions.T_ALL_PERMISSIONS & this.props.permissions)) })
        this.setState({ saveActive: (permissions.T_ALL_PERMISSIONS === (permissions.T_ALL_PERMISSIONS & this.props.permissions)) })
      }
    }
  }

  clearFehler() 
  {
    this.setState({ fehlerSpielzeitTxt: '', fehlerSpielzeit: false, invalidClassnameSpielzeit: '' });
    this.setState({ fehlerSpielerTxt: '', fehlerSpieler: false, invalidClassnameSpieler: '' });
    this.setState({ saveActive: true });
    this.setState({ overbooked: false });
    this.setState({ deleteActive: true })
  }

  validateForm() 
  {
    // Es wird validiert, ob Erwachsene, Schnuppermitglieder und Jugendliche 
    // wirklich spielberechtigt sind und ob die eingetragenen Zeiten stimmen

    const start = Number(this.state.startsAtStd + this.state.startsAtViertel)
    const ende = Number(this.state.endsAtStd + this.state.endsAtViertel)
    const { p1, p2, p3, p4, court } = this.state
    let p1geb, p2geb, p3geb, p4geb;

    p1geb = this.state.spieler.map( (r) => {
      if (r.id === p1) { 
        p1geb = r.geburtsdatum 
      }
      if (r.id === p2) { 
        p2geb = r.geburtsdatum 
      }
      if (r.id === p3) { 
        p3geb = r.geburtsdatum 
      }
      if (r.id === p4) { 
        p4geb = r.geburtsdatum 
      }
      return r
    })
    
    const sdStr = this.state.startsAtDate + 'T' + this.state.startsAtStd + ':' + this.state.startsAtViertel + "Z";
    const sd = new Date(sdStr);
    const hd = new Holidays()
    hd.init('DE', 'BY')

    // Bedingungen Spielberechtigung
    const feiertag = hd.isHoliday(sd) ? true : false;
    const sonnOderFeiertag = feiertag || sd.getDay() !== 0;
    // const anzahlSpieler = (p1 !== 0) + (p2 !== 0) + (p3 !== 0) + (p4 !== 0) 
    const platz6 = (court === 6);
    let einSpielerJug = false;
    let einSpielerErw = false;
    [p1geb, p2geb, p3geb, p4geb].map(g => {
      if (g !== 0) // 
      {
        if (! nvb(g)) {
          einSpielerErw = true
        } else {
          einSpielerJug = true
        }
      }
      return g
    })
    // const doppelteSpielerEinzel = (_.uniq([p1, p2]).length < 4)
    // const doppelteSpielerDoppel = (_.uniq([p1, p2, p3, p4]).length < 4)
    const abendZeit = (ende) > Config.eveningTime
    let err1 = false;
    const p12 = (p1 !== 0) && (p2 !== 0);
    const p34 = (p3 !== 0) && (p4 !== 0);


    // Auswertung Spielberechtigung

    // Formal müssen Spieler eingetragen sein
    // Sind Spieler doppelt?
    if (this.state.bookingType.match(/(ts-turnier)|(ts-einzel)/ig)) 
    {
    // console.log(this.state.r.starts_at);

      if ( (! p12) || (p1 === p2)  ) {
        err1 = true;
      }
    } else {
      // Kann hier nur noch Doppel sein. Spieler p1, p2, p3 und p4 müssen eingetragen sein
      const doppelteSpieler = (_.uniq([p1, p2, p3, p4]).length < 4);
      if ( ( ! (p12 && p34)) || doppelteSpieler ) {
        err1 = true;
      }
    }

    if (err1) {
      this.setState({ 
        fehlerSpielerTxt: '- Bitte 2 (Einzel) oder 4 (Doppel) verschiedene Spieler eintragen!', 
        fehlerSpieler: true, 
        invalidClassnameSpieler: 'invalidFeedback',
        saveActive: false 
      });
      // console.log("SPIELERPRÜFUNG");
    } 
    // Jetzt die Berechtigungen nach Alter, Status, Zeitpunkt
    else if (    (platz6 && einSpielerErw && !einSpielerJug && sonnOderFeiertag && abendZeit)
        ||  (platz6 && einSpielerErw && !einSpielerJug && sonnOderFeiertag && !abendZeit)
        ||  (platz6 && einSpielerErw && !einSpielerJug && !sonnOderFeiertag && abendZeit)) 
    {
      this.setState({
        fehlerSpielerTxt: `Achtung: Jugendliche haben auf Platz 6 zu dieser Zeit Vorrecht!`, 
        fehlerSpieler: true,
        invalidClassnameSpieler: '',
        overbooked: true,
        saveActive: true,  // nur eine Warnung
      });
    }
    else if (   (!platz6 && !einSpielerErw && einSpielerJug && sonnOderFeiertag && abendZeit)
            ||  (!platz6 && !einSpielerErw && einSpielerJug && sonnOderFeiertag && !abendZeit)
            ||  (!platz6 && !einSpielerErw && einSpielerJug && !sonnOderFeiertag && abendZeit)) 
    {
      this.setState({
        fehlerSpielerTxt: `Achtung: Erwachsene Vollmitglieder haben zu dieser Zeit Vorrecht!`, 
        fehlerSpieler: true,
        invalidClassnameSpieler: '',
        overbooked: true,
        saveActive: true,   // nur eine Warnung
      }); 
    }

    // Auswertung Spielzeit formal
    if (start >= ende) 
    {
      this.setState({ 
        fehlerSpielzeitTxt: '- Der Start muss vor dem Ende liegen!', 
        fehlerSpielzeit: true,
        invalidClassnameSpielzeit: 'invalidFeedback',
        saveActive: false,
      });
    } 
    else if (this.state.bookingType === "ts-einzel") 
    {
      if ((ende - start) > Config.singleTime)  
      {
        this.setState({
          fehlerSpielzeitTxt: 'Für ein Einzel maximal 60 Minuten buchen', 
          fehlerSpielzeit: true,
          invalidClassnameSpielzeit: '',
          saveActive: false,      // nur eine Warnung
        }); 
      }
    } 
    else if (this.state.bookingType === "ts-doppel")
    {
      if ((ende - start) > Config.doubleTime)  
      {
        this.setState({
          fehlerSpielzeitTxt: 'Für ein Doppel maximal 90 Minuten buchen', 
          fehlerSpielzeit: true,
          invalidClassnameSpielzeit: '',
          saveActive: false,    // nur eine Warnung
        });
      }
    }
  }
}

export default BelForm;
