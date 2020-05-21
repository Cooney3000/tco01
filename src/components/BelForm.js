//
import React, { Component } from 'react';
import Config, { Messages, Permissions } from './Defaults';
import { Redirect } from 'react-router';
import { spielerzusatz, nvb } from './functions';
import _ from 'lodash';
import Holidays from 'date-holidays';


class BelForm extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    const { r } = props

    // Haben wir einen Gast?
    const condEinGast = ([r.p1id, r.p2id, r.p3id, r.p4id].findIndex(e => Number(e) === Config.gastId)) !== -1
    // Daten für Datum, Start und Ende extrahieren
    let [sd, st] = r.starts_at.split(' ');
    const dateIsToday = ((new Date(sd)).getDate() === (new Date()).getDate());

    // Initialer Wert für neue Buchungen. Wenn Einzel/Doppel erlaubt/nicht erlaubt sind, hier ändern
    const bookingType = (r.booking_type === '') ? (dateIsToday ? 'ts-einzel' : 'ts-turnier') : r.booking_type;
    // const bookingType = (r.booking_type === '') ? 'ts-turnier' : r.booking_type;
    const deleteActive = r.booking_type.match(/(ts-training)|(ts-nichtreservierbar)/ig) 
        ? (Permissions.T_ALL_PERMISSIONS === (Permissions.T_ALL_PERMISSIONS & this.props.permissions)) 
        : true;

    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
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
      p1MsgClass: '',
      // p2MsgClass: '',
      // p3MsgClass: '',
      // p4MsgClass: '',
      spieler: [],
      court: r.court,
      paid: r.paid,
      zurTafel: false,
      saveActive: true,
      deleteActive: deleteActive,
      paidActive: r.paid,
      admin: false,
      dateIsToday: dateIsToday,
      overbooked: false,
      jugend: false,
      nichtVollBerechtigte: false,
      condEinGast: condEinGast,
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
    const condVorstand = (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))
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
            <div><strong>Start</strong> <span id="startsAtMsg" className={this.state.startsAtMsgClass}>{this.state.startsAtMsgTxt}</span></div>
            <div className="form-group">
              <select id="startsAtStd" className={'form-control ' + this.state.startsAtMsgClass} onChange={this.handleChange} value={this.state.startsAtStd}>
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
              <select id="startsAtViertel" className={'form-control ' + this.state.startsAtMsgClass} onChange={this.handleChange} value={this.state.startsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <div><strong>Ende</strong></div>
            <div className="form-group">
              <select id="endsAtStd" className={'form-control ' + this.state.endsAtMsgClass} onChange={this.handleChange} value={this.state.endsAtStd}>
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
              <select id="endsAtViertel" className={'form-control ' + this.state.endsAtMsgClass} onChange={this.handleChange} value={this.state.endsAtViertel}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
            <div><strong>Buchungstyp</strong></div>
            <select id="bookingType" className="form-control" onChange={this.handleChange} value={this.state.bookingType}>
              <option disabled={!this.state.dateIsToday} value="ts-einzel">Einzel</option>
              <option disabled={!this.state.dateIsToday} value="ts-doppel">Doppel</option>
              <option value="ts-turnier">Turnier</option>
              <option disabled={false} value="ts-training">Training</option>
              <option value="ts-veranstaltung">Veranstaltung</option>
              <option disabled={!condVorstand} value="ts-punktspiele">Punktspiele</option>
              <option disabled={!condVorstand} value="ts-nichtreservierbar">Nicht reservierbar</option>
            </select>
            <div><strong>Spieler</strong> <span id="p1Msg" className={this.state.p1MsgClass}>{this.state.p1MsgTxt}</span></div>
            <div className="form-row">
              <select id="p1" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p1}>
                <option value="none">- Bitte auswählen -</option>
                {this.state.spieler.map(r => {
                  return (
                    <option key={'p1' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                  )
                })}
              </select>
              {(this.state.bookingType.match(/(ts-einzel)|(ts-turnier)|(ts-doppel)/ig)) ?
                <select id="p2" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p2}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p2' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    )
                  })}
                </select>
                : ''
              }
            </div>
            <div className="form-group">
              {(this.state.bookingType==="ts-doppel") ?
                <select id="p3" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p3}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p3' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    )
                  })}
                </select>
                : ''
              }
              {(this.state.bookingType==="ts-doppel") ?
                <select id="p4" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p4}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p4' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum)}</option>
                    )
                  })}
                </select>
                : ''
              }
              {(this.state.condEinGast) ?
                <React.Fragment>
                  <div><strong>Gastgebühr</strong> </div>
                  <div class="form-check">
                    <input id="paid" className="form-check-input text-left ml-1" type="checkbox" onChange={this.handleChange} checked={this.state.paid} />
                    <label className="form-check-label  text-left" for="paid" disabled={!this.state.paidActive}>
                      bezahlt
                    </label>
                  </div>
                </React.Fragment>
                : ''
              }
            </div>
            <div><strong>Bemerkung</strong> <span id="commentMsg" className={this.state.commentMsgClass}>{this.state.commentMsgTxt}</span></div>
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

  handleSave(e) {
    e.preventDefault();
    // console.log("SAVE FORM DATA NOW!");
    const s = {}
    // Meldungen zurücksetzen
    s.startsAtMsgTxt = ''
    s.startsAtMsgClass = ''
    s.saveActive = true
    s.p1MsgFormCtrl = ''

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
          // Fehlermeldung
          [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.platzbelegt;
        }
      })
    // .catch(error => this.setState({ error, isLoading: false }));
    // e.preventDefault();
  }

  handleDelete(e) {
    const sdStr = this.state.startsAtDate + 'T' + this.state.startsAtStd + ':' + this.state.startsAtViertel + "Z";
    const sd = new Date(sdStr);
    const jetzt = new Date();

    e.preventDefault();
    // console.log("DELETE ROW NOW!" + this.state.r.id);

    if (sd >= jetzt || (Permissions.VORSTAND & this.props.permissions)) {
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

  handleChange(e) {
    e.preventDefault();

    this.setState({ [e.target.id]: e.target.value }, () => {
      const s = {}

      // Meldungen zurücksetzen
      s.p1MsgTxt = ''
      s.p1MsgClass = ''
      s.startsAtMsgTxt = ''
      s.startsAtMsgClass = ''
      s.commentMsgTxt = ''
      s.commentMsgClass = ''
      s.saveActive = true
      s.deleteActive = true
      s.paidActive = false
      s.p1MsgFormCtrl = ''
      s.overbooked = false
      s.condEinGast = false

      // Bedingungen
      let condEinSpielerJug = false
      let condEinSpielerErw = false
      let condDoppelteSpieler = false
      let condAbendZeit = false

      const datestring = this.state.startsAtDate + 'T' + this.state.startsAtStd + ':' + this.state.startsAtViertel + "Z"
      const sd = new Date(datestring)
      const hd = new Holidays()
      hd.init('DE', 'BY')
      const condFeiertag = hd.isHoliday(sd) ? true : false
      const condSonnOderFeiertag = (condFeiertag || (sd.getDay() === 0) || (sd.getDay() === 6))
      const condPlatz6 = (Number(this.state.court) === 6)

      // Validierung
      // -----------
      // Es wird validiert, ob Erwachsene, Schnuppermitglieder und Jugendliche 
      // wirklich spielberechtigt sind und ob die eingetragenen Zeiten stimmen

      const start = Number(this.state.startsAtStd + this.state.startsAtViertel)
      const ende = Number(this.state.endsAtStd + this.state.endsAtViertel)
      const pKeys = [];

      pKeys[0] = _.find(this.state.spieler, { 'id': this.state.p1 })
      pKeys[1] = _.find(this.state.spieler, { 'id': this.state.p2 })
      pKeys[2] = _.find(this.state.spieler, { 'id': this.state.p3 })
      pKeys[3] = _.find(this.state.spieler, { 'id': this.state.p4 })

      // Haben wir einen GAST?
      const {p1, p2, p3, p4} = this.state;
      s.condEinGast = ([p1, p2, p3, p4].findIndex(e => Number(e) === Config.gastId)) !== -1

      // Ist ein Jugendlicher dabei? Ist ein Erwachsener dabei?
      // Welche Geburtsdaten haben die Spieler?
      pKeys.map(k => {
        if (k != null) // 
        {
          if (!nvb(k['geburtsdatum'])) {
            condEinSpielerErw = true
          } else {
            condEinSpielerJug = true
          }
          return k['geburtsdatum']
        }
        return undefined
      })
      condAbendZeit = (ende) > Config.eveningTime

      // Message an der Spielzeit
      // Formal müssen Spieler korrekt eingetragen sein
      if (this.state.bookingType.match(/(ts-veranstaltung)|(ts-training)|(ts-nichtreservierbar)/ig)) { 
        // Ein Spieler muss eingetragen werden
        if (Number(this.state.p1) === 0) {
          [ s.p1msgClass, s.p1MsgClass, s.p1MsgTxt ] = Messages.spieleranzahl
          s.p1MsgFormCtrl = 'is-invalid'
        }
        // Spieler 2 bis 4 werden "gelöscht"
        s.p2 = s.p3 = s.p4 = 0
      }
      if (this.state.bookingType.match(/(ts-turnier)|(ts-einzel)/ig)) {
        // Zwei Spieler müssen eingetragen werden
        if ((this.state.p1 & this.state.p2) === 0) {
          [ s.p1msgClass, s.saveActive, s.p1MsgTxt ] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        } else if (this.state.p1 === this.state.p2) {  
          // Sind die Spieler doppelt?
          condDoppelteSpieler = true;
          [ s.p1msgClass, s.saveActive, s.p1MsgTxt ] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        }
        // Spieler 3 bis 4 werden "gelöscht"
        s.p3 = s.p4 = 0
      }
      if (this.state.bookingType === "ts-doppel") {
        // Vier Spieler
        // Sind unter 4 Spielern welche doppelt?
        condDoppelteSpieler = (_.uniq([this.state.p1, this.state.p2, this.state.p3, this.state.p4]).length < 4)
        
        if (!s.condEinGast) {
          if (condDoppelteSpieler || (Number(this.state.p3) === 0 || Number(this.state.p4) === 0)) {
            [ s.p1MsgClass, s.saveActive, s.p1MsgTxt ] = Messages.spieleranzahl;
            s.p1MsgFormCtrl = 'is-invalid'
          }
        }
      }
      if (s.condEinGast) {
        if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)/ig)) {
          [ s.commentMsgClass, s.saveActive, s.commentMsgTxt ] = Messages.gast
        }
         else {
          [ s.p1MsgClass, s.saveActive, s.p1MsgTxt ] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        }
      }
      if (this.state.bookingType === "ts-veranstaltung") {
          [ s.commentMsgClass, s.saveActive, s.commentMsgTxt ] = Messages.veranstaltung
      }
      
      if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)/ig)) {
        // Jetzt die Berechtigungen nach Alter, Status, Zeitpunkt, Message an der Spielzeit
        if ((condPlatz6 && condEinSpielerErw && !condEinSpielerJug && condSonnOderFeiertag && condAbendZeit)
          || (condPlatz6 && condEinSpielerErw && !condEinSpielerJug && condSonnOderFeiertag && !condAbendZeit)
          || (condPlatz6 && condEinSpielerErw && !condEinSpielerJug && !condSonnOderFeiertag && condAbendZeit)) {
            [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.jugendvorrecht;
            s.overbooked = true
        }
        else if ((!condPlatz6 && !condEinSpielerErw && condEinSpielerJug && condSonnOderFeiertag && condAbendZeit)
          || (!condPlatz6 && !condEinSpielerErw && condEinSpielerJug && condSonnOderFeiertag && !condAbendZeit)
          || (!condPlatz6 && !condEinSpielerErw && condEinSpielerJug && !condSonnOderFeiertag && condAbendZeit)) {
            [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.erwachsenenvorrecht;
            s.overbooked = true
        }
      }

      // Auswertung Spielzeit formal, Message an der Spielzeit
      if (start >= ende) {
          [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.zeit;
      }
      else if (this.state.bookingType === "ts-einzel") {
        if ((ende - start) > Config.singleTime) {
          [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.einzeldauer;
        }
      }
      else if (this.state.bookingType === "ts-doppel") {
        if ((ende - start) > Config.doubleTime) {
          [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.doppeldauer;
        }
      }
      else if (this.state.bookingType === "ts-turnier") {
        if ((ende - start) !== Config.turnierTime) {
          [ s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt ] = Messages.turnierspieldauer;
        }
      }

      // Trainingszeiten und Nicht Reservierbar ist nur für Berechtigte speicher- und löschbar
      if (this.state.bookingType.match(/(ts-punktspiele)|(ts-nichtreservierbar)/ig)) {
        s.saveActive   = (Permissions.T_ALL_PERMISSIONS === (Permissions.T_ALL_PERMISSIONS & this.props.permissions))
      }
      if (this.state.bookingType.match(/(ts-training)|(ts-punktspiele)|(ts-nichtreservierbar)/ig)) {
        s.deleteActive = (Permissions.T_ALL_PERMISSIONS === (Permissions.T_ALL_PERMISSIONS & this.props.permissions))
      }
      if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)/ig) && s.condEinGast) {
        s.paidActive = (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))
      }

      // Alle Ergebnisse in den State
      this.setState(s)

    });
  }
}

export default BelForm;
