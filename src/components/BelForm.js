//
import React, { Component } from 'react';
import Config, { messages as Messages, permissions as Permissions } from './Defaults';
import { Redirect } from 'react-router';
import { spielerzusatz, servertimeNow, jugendlicher as isJugendlicher, getTimetable } from './functions';
import _ from 'lodash';
import Holidays from 'date-holidays';

class BelForm extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    const { r } = props;
    // Daten für Datum, Start und Ende extrahieren
    let [sd, st] = r.starts_at.split(' ')
    let scd = new Date(sd)
    let ssd = servertimeNow()
    scd.setHours(0, 0, 0, 0)
    ssd.setHours(0, 0, 0, 0)

    const dateIsToday = (scd.valueOf() === ssd.valueOf())

    // Initialer Wert für neue Buchungen. Wenn Einzel/Doppel erlaubt/nicht erlaubt sind, hier ändern
    const bookingType = (r.booking_type === '') ? (dateIsToday ? 'ts-einzel' : 'ts-turnier') : r.booking_type
    const userDarfAlles = [Number([r.user_id]),Number([r.p1id]),Number([r.p2id]),Number([r.p3id]),Number([r.p4id])].includes(Number(this.props.userId)) 
    const deleteActive =  userDarfAlles || (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))
      
    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
    this.state = {
      r: r,
      spieltag: sdA[2] + '.' + sdA[1] + '.' + sdA[0],
      startsAtDate: sd,
      endsAtDate: ed,
      startsAt: st.substring(0, 5),
      endsAt: et.substring(0, 5),
      bookingType: bookingType,
      comment: (typeof r.comment === "undefined") ? "" : r.comment,
      p1: (r.p1id === 0 ? Number(this.props.userId) :  Number(r.p1id)),
      p2: Number(r.p2id),
      p3: Number(r.p3id),
      p4: Number(r.p4id),
      spieler: [],
      belegungenAbJetzt: [],
      court: (typeof r.court === "undefined") ? "--" : r.court,
      zurTafel: false,
      saveActive: false,
      deleteActive: deleteActive,
      endeActive: false,
      admin: false,
      dateIsToday: dateIsToday,
      overbooked: false,
      jugend: false,
      nichtVollBerechtigte: false,
      timetable: [],
      isLoading1: true,
      isLoading2: true,
      courtBelegt: [],
    };

  }

  componentDidMount() {
    // Alle Spieler für die Select-Auswahl laden    
    let url = Config.protokoll + Config.hostname + "/intern/api/spieler.php";
    this.setState({ isLoading1: true });
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
        this.setState({ spieler: spieler, isLoading1: false })
      })
      .catch(error => this.setState({ error, isLoading1: false }));

    // Alle Belegungen des Tages für die Belegungsprüfung laden
    url = Config.protokoll + Config.hostname + "/intern/api/belegungenabjetzt.php";
    this.setState({ isLoading2: true });
    fetch(url, { credentials: 'same-origin' })
      .then(result => {
        if (result.ok) {
          // console.log(result);
          return result.json();
        } else {
          throw new Error('Fehler beim Laden der Belegungsdaten');
        }
      })
      .then(result => {
        // console.log(result.records)
        // this.setState({ timetable: getBookableTimes(getTimetable(result.records)), isLoading2: false }); 
        this.setState({ timetable: getTimetable(result.records), isLoading2: false });

      })
      .catch(error => this.setState({ error, isLoading2: false }));

  }

  render() {
    const { isLoading1, isLoading2 } = this.state;
    if (isLoading1 || isLoading2) {
      return <p>Loading...</p>
    }
    if (this.state.zurTafel === true) {
      return <Redirect to={{ pathname: "/intern/tafel/", state: this.state.startsAtDate }} />
    }
    const condMF = (Permissions.MANNSCHAFTSFUEHRER === (Permissions.MANNSCHAFTSFUEHRER & this.props.permissions))
    return (
      <div>
        <h1>Spieltag: {this.state.spieltag}</h1>
        <form className="form-inline">
          <fieldset className="fields">
            <div><strong>Buchungstyp</strong></div>
            {!this.state.dateIsToday &&
              <div>Einzel-/Doppel-Buchung nur am aktuellen Tag möglich</div>
            }
            <select id="bookingType" className="form-control" onChange={this.handleChange} value={this.state.bookingType}>
              <option disabled={!this.state.dateIsToday} value="ts-einzel">Einzel</option>
              <option disabled={!this.state.dateIsToday} value="ts-doppel">Doppel</option>
              <option value="ts-turnier">Turnier</option>
              <option disabled={!condMF} value="ts-veranstaltung">Veranstaltung</option>
              <option disabled={!condMF} value="ts-training">Training</option>
              <option disabled={!condMF} value="ts-punktspiele">Punktspiele</option>
            </select>
            <div><strong>Start</strong> <span id="startsAtMsg" className={this.state.startsAtMsgClass}>{this.state.startsAtMsgTxt}</span></div>
            <div className="form-group">
              <div>
                <select id="startsAt" className={'form-control ' + this.state.startsAtMsgClass} onChange={this.handleChange} value={this.state.startsAt}>
                  {
                    Object.keys(this.state.timetable).map(ttl => {

                      return (
                        <option key={ttl} value={ttl}>
                          {ttl}h 
                      {/*
                          &nbsp; {this.state.timetable[ttl][0]} 
                          &nbsp; {this.state.timetable[ttl][1]} 
                          &nbsp; {this.state.timetable[ttl][2]} 
                          &nbsp; {this.state.timetable[ttl][3]} 
                          &nbsp; {this.state.timetable[ttl][4]} 
                          &nbsp; {this.state.timetable[ttl][5]}
                      */}
                        </option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
            <div><strong>Platz</strong></div>
              <div className="form-group">
                <select id="court" className="form-control" onChange={this.handleChange} value={this.state.court}>
                  <option value="--">--</option>
                  <option disabled={this.state.courtBelegt[0]} value="1">1</option>
                  <option disabled={this.state.courtBelegt[1]} value="2">2</option>
                  <option disabled={this.state.courtBelegt[2]} value="3">3</option>
                  <option disabled={this.state.courtBelegt[3]} value="4">4</option>
                  <option disabled={this.state.courtBelegt[4]} value="5">5</option>
                  <option disabled={this.state.courtBelegt[5]} value="6">6</option>
                </select>
              </div>
          <div><strong>Ende</strong></div>
             <div className="form-group">
             <div>
                <select id="endsAt" className={'form-control ' + this.state.startsAtMsgClass} onChange={this.handleChange} value={this.state.endsAt}>
                  {
                    Object.keys(this.state.timetable).map(ttl => {
                      return (
                        // <option disabled={!this.state.endeActive} key={ttl} value={ttl}>
                        <option key={ttl} value={ttl}>
                          {ttl}h 
                          {/* &nbsp; {this.state.timetable[ttl][0]} 
                          &nbsp; {this.state.timetable[ttl][1]} 
                          &nbsp; {this.state.timetable[ttl][2]} 
                          &nbsp; {this.state.timetable[ttl][3]} 
                          &nbsp; {this.state.timetable[ttl][4]} 
                          &nbsp; {this.state.timetable[ttl][5]} */}
                        </option>
                      )
                    })
                  }
                </select>
              </div>

            </div>
            <div><strong>{(this.state.bookingType.match(/(ts-einzel)|(ts-doppel)|(ts-turnier)/ig)) ? 'Spieler' : 'Verantwortlicher'}</strong> <span id="p1Msg" className={this.state.p1MsgClass}>{this.state.p1MsgTxt}</span></div>
            <div className="form-row">
              <select id="p1" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p1}>
                <option value="0">- Bitte auswählen -</option>
                {this.state.spieler.map(r => {
                  return (
                    <option key={'p1' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum, r.schnupper)}</option>
                  )
                })}
              </select>
              {(this.state.bookingType.match(/(ts-einzel)|(ts-turnier)|(ts-doppel)/ig)) ?
                <select id="p2" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p2}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p2' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum, r.schnupper)}</option>
                    )
                  })}
                </select>
                : ''
              }
            </div>
            <div className="form-row">
              {(this.state.bookingType === "ts-doppel") ?
                <select id="p3" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p3}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p3' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum, r.schnupper)}</option>
                    )
                  })}
                </select>
                : ''
              }
              {(this.state.bookingType === "ts-doppel") ?
                <select id="p4" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p4}>
                  <option value="0">- Bitte auswählen -</option>
                  {this.state.spieler.map(r => {
                    return (
                      <option key={'p4' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum, r.schnupper)}</option>
                    )
                  })}
                </select>
                : ''
              }
            </div>

            <div><strong>Bemerkung</strong> <span id="commentMsg" className={this.state.commentMsgClass}>{this.state.commentMsgTxt}</span></div>
            <div className="form-group">
              <input type="text" id="comment" className={'form-control w-100 ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.comment} placeholder="Spielergebnis, Gastname, ..." />
            </div>

            <button type="submit" onClick={e => { this.handleSave(e) }} className="btn btn-primary m-1" disabled={!this.state.saveActive}>Speichern</button>
            <button type="submit" onClick={e => { this.handleDelete(e) }} className="btn btn-primary m-2" disabled={!this.state.deleteActive}>Löschen</button>
          </fieldset>
        </form>
      </div >
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
      + '&ds=' + this.state.startsAtDate + ' ' + this.state.startsAt
      + '&de=' + this.state.endsAtDate + ' ' + this.state.endsAt
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
          return result.json()
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
        } else if (rc === 'bereits belegt') {
          // Fehlermeldung
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.platzbelegt;
        } else {
          // User nicht authentifiziert oder etwas stimmt generell nicht
          window.location.href = Config.loginPage
        }
        // Alle Ergebnisse in den State
        this.setState(s)
      })
  }

  handleDelete(e) {

    const sdStr = this.state.startsAtDate + 'T' + this.state.startsAt + "Z";
    const sd = new Date(sdStr);
    const jetzt = new Date();

    e.preventDefault();

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
      s.endeActive = false
      s.p1MsgFormCtrl = ''
      s.overbooked = false
      s.startsAt = this.state.startsAt

      // Alle nicht buchbaren Zeiten der Timetable deaktivieren
      // s.timetable = getBookableTimes(this.state.timetable)
      s.timetable = this.state.timetable
      // Belegte Plätze im Select disablen
      s.courtBelegt = s.timetable[s.startsAt].map( c => c === Config.platzBelegt )

      // Endezeit errechnen
      let endsAtViertel = this.state.startsAt.substring(3, 5)
      let endsAtStd = this.state.endsAt.substring(0, 2)
      if (this.state.bookingType === "ts-einzel") {
        endsAtStd = (Number(this.state.startsAt.substring(0, 2)) + 1).toLocaleString('de-DE', {minimumIntegerDigits: 2, useGrouping: false})
      } 
      else if (this.state.bookingType.match(/(ts-turnier)|(ts-doppel)/ig)) {
        endsAtStd = (Number(this.state.startsAt.substring(0, 2)) + 2).toLocaleString('de-DE', {minimumIntegerDigits: 2, useGrouping: false})
      }
      s.endsAt = endsAtStd + ":" + endsAtViertel

      // Bedingungen
      let condEinGast = false
      let condEinMitglied = false
      let condEinSpielerErwVoll = false
      let condDoppelteSpieler = false
      let condUserIstSpieler = false

      const datestring = this.state.startsAtDate + 'T' + this.state.startsAt + "Z"
      const sd = new Date(datestring)
      const hd = new Holidays()
      hd.init('DE', 'BY')
      const condFeiertag = hd.isHoliday(sd) ? true : false
      const condSonnOderFeiertag = (condFeiertag || (sd.getDay() === 0) || (sd.getDay() === 6))
      // const condPlatz6 = (Number(this.state.court) === 6)

      // Validierung
      // -----------
      // Es wird validiert, ob Erwachsene, Schnuppermitglieder und Jugendliche 
      // wirklich spielberechtigt sind und ob die eingetragenen Zeiten stimmen

      // Buchungszeiten in Minuten
      const start = Number(s.startsAt.substring(0, 2)) * 60 + Number(s.startsAt.substring(3, 5))
      let ende = Number(s.endsAt.substring(0, 2)) * 60 + Number(s.endsAt.substring(3, 5))

      const pKeys = [Number(this.state.p1), Number(this.state.p2), Number(this.state.p3), Number(this.state.p4)]

      // Haben wir einen GAST oder ein Mitglied ohne Namen?
      // Ist der aktuelle User auch Spieler?
      // Ist ein erwachsenes Vollmitglied dabei?

      const spieler = this.state.spieler;
      condEinSpielerErwVoll = false
      pKeys.forEach((p) => {
        if (p != null && p != 0) // 
        {
          if (p === Number(this.props.userId)) {
            condUserIstSpieler = true
          }    if (p === Config.gastId || p === Config.gastJugId) {
            condEinGast = true
          }    if (p === Config.mitgliedId) {
            condEinMitglied = true
          }
          // Geburtsdatum und Schnupperstatus prüfen wir mittels spieler-SELECT-Array
          let pAttr = spieler.find(o => o.id === p.toString())
          if ( ! (isJugendlicher(pAttr['geburtsdatum']) || pAttr['schnupper'] === "1") ) {
            condEinSpielerErwVoll = true
          }
        }
      })
      // Auch der Ersteller der Buchung ist zu allem berechtigt
      condUserIstSpieler = condUserIstSpieler || this.props.userId === this.state.r.user_id

      let saveActiveMerker = true
      // Message an der Spielzeit
      // Formal müssen Spieler korrekt eingetragen sein
      if (this.state.bookingType.match(/(ts-veranstaltung)|(ts-training)|(ts-nichtreservierbar)/ig)) {
        // Ein Spieler muss eingetragen werden
        if (Number(this.state.p1) === 0) {
          [s.p1msgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl
          s.p1MsgFormCtrl = 'is-invalid'
        }
        // Spieler 2 bis 4 werden "gelöscht"
        s.p2 = s.p3 = s.p4 = 0
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      if (this.state.bookingType.match(/(ts-turnier)|(ts-einzel)/ig)) {
        // Zwei Spieler müssen eingetragen werden, beide nicht 0 und unterschiedlich
        if (Number(this.state.p1) === 0 || Number(this.state.p2) === 0) {
          [s.p1msgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        } else if (Number(this.state.p1) === Number(this.state.p2)) {
          // Sind die Spieler doppelt?
          condDoppelteSpieler = true;
          [s.p1msgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        }
        // Spieler 3 bis 4 werden "gelöscht"
        s.p3 = s.p4 = 0
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      if (this.state.bookingType === "ts-doppel") {
        // Vier Spieler
        // Sind unter 4 Spielern welche doppelt?
        condDoppelteSpieler = (_.uniq([this.state.p1, this.state.p2, this.state.p3, this.state.p4]).length < 4)

        if (!condEinGast) {
          if (condDoppelteSpieler || (Number(this.state.p3) === 0 || Number(this.state.p4) === 0)) {
            [s.p1MsgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl;
            s.p1MsgFormCtrl = 'is-invalid'
          }
        }
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      if (condEinGast || condEinMitglied) {
        if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)/ig)) {
          // Gäste und unbenannte Mitglieder müssen einen Kommentar/Namen vermerken. Mind. 2 Zeichen
          if (this.state.comment.length < 2) {
            [s.commentMsgClass, s.saveActive, s.commentMsgTxt] = condEinGast ? Messages.gast : Messages.mitglied
            s.p1MsgFormCtrl = 'is-invalid'
          }
        }
        else {
          [s.p1MsgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl;
          s.p1MsgFormCtrl = 'is-invalid'
        }
      }
      if (this.state.bookingType === "ts-veranstaltung") {
        [s.commentMsgClass, s.saveActive, s.commentMsgTxt] = Messages.veranstaltung
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)/ig)) {
        // Jetzt die Berechtigungen nach Alter, Status, Zeitpunkt. Message an der Spielzeit
        // Diese Bedingungen sind von der Entscheidungstabelle (Dokumentation, Excel) abgeleitet
        const dToday = new Date()

        const dH = dToday.getHours()
        const dM = dToday.getMinutes()
        const minutesToday = (dH * 60 + dM)
        if ((start - minutesToday) > Config.maxMinutesDistance && !condEinSpielerErwVoll && !condSonnOderFeiertag && ende > (Config.eveningTime / 100 * 60)) {
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.erwachsenenvorrecht;
          s.overbooked = true
        }
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      // Auswertung Spielzeit formal, Message an der Spielzeit
      if (start >= ende) {
        [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.zeit;
      }
      else if (this.state.bookingType === "ts-einzel") {
        if ((ende - start) > Config.singleTime) {
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.einzeldauer;
        }
      }
      else if (this.state.bookingType === "ts-doppel") {
        if ((ende - start) > Config.doubleTime) {
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.doppeldauer;
        }
      }
      else if (this.state.bookingType === "ts-turnier") {
        if ((ende - start) !== Config.turnierTime) {
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.turnierspieldauer;
        } else {
          [s.startsAtMsgClass, s.saveActive, s.startsAtMsgTxt] = Messages.turnier;
        }
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      // Berechtigung zum Speichern und Löschen und flexible Endezeit
      if (this.state.bookingType.match(/(ts-einzel)|(ts-doppel)|(ts-turnier)/ig)) {
        s.saveActive = condUserIstSpieler || (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))
        s.deleteActive = condUserIstSpieler || (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))
        s.endeActive = false
      }
      if (this.state.bookingType.match(/(ts-training)|(ts-punktspiele)|(ts-nichtreservierbar)|(ts-veranstaltung)/ig)) {
        s.saveActive = (Permissions.MANNSCHAFTSFUEHRER === (Permissions.MANNSCHAFTSFUEHRER & this.props.permissions))
        s.endeActive = true
      }
      if (this.state.bookingType.match(/(ts-training)|(ts-punktspiele)|(ts-nichtreservierbar)|(ts-veranstaltung)/ig)) {
        s.deleteActive = (Permissions.MANNSCHAFTSFUEHRER === (Permissions.MANNSCHAFTSFUEHRER & this.props.permissions))
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      s.saveActive = saveActiveMerker

      // Alle Ergebnisse in den State
      this.setState(s)

    });
  }
}

export default BelForm;



