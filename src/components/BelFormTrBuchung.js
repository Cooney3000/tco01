//
import React, { Component } from 'react';
import Config, { messages as Messages, permissions as Permissions } from './Defaults';
import { Redirect } from 'react-router';
import { spielerzusatz, servertimeNow, jugendlicher as isJugendlicher, getTimetable } from './functions';
import Holidays from 'date-holidays';

class BelFormTrBuchung extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    const { r } = props;
    let [sd, st] = r.starts_at.split(' ')
    // Daten für Datum, Start und Ende
    let scd = new Date(r.starts_at)
    let ssd = servertimeNow()

    let timeDiff = scd.valueOf() - ssd.valueOf()
    // console.debug("ssd:", ssd, " scd:", scd, " timeDiff:", timeDiff)
    
    const userDarfLoeschen = ( timeDiff > Config.std24) // 24*60*60*1000 = 24 Stunden in Millisekunden
    // console.debug("ssd:", ssd, " scd:", scd, " timeDiff:", timeDiff, " userDarfLoeschen:", userDarfLoeschen)

    // Initialer Wert für neue Buchungen. Wenn Einzel/Doppel erlaubt/nicht erlaubt sind, hier ändern
    const bookingType = r.booking_type
    const userDarfAlles = userDarfLoeschen && ([Number([r.user_id]), Number([r.p1id]), Number([r.p2id]), Number([r.p3id]), Number([r.p4id])].includes(Number(this.props.userId)))
    const deleteActive = userDarfAlles || (Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))

    let [ed, et] = r.ends_at.split(' ');
    let sdA = sd.split('-');
    this.state = {
      r: r,
      spieltag: sdA[2] + '.' + sdA[1] + '.' + sdA[0],
      startsAtDate: sd,
      endsAtDate: ed,
      startsAt: st.substring(0, 5),
      endsAt: et.substring(0, 5),
      seriesId: r.series_id,
      bookingType: bookingType,
      comment: (typeof r.comment === "undefined") ? "" : r.comment,
      p1: Number(r.p1id),
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
      userDarfLoeschen: userDarfLoeschen,
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
    const trainer = this.state.spieler.find(sp => sp.id === this.state.p1.toString())
    return (
      <div>
        <h1>Spieltag: {this.state.spieltag}</h1>
        <form className="form-inline">
          <fieldset className="fields">
            <div><strong>Buchungstyp:</strong> <span>{this.state.bookingType}</span></div>

            <div><strong>Platz</strong> <span>{this.state.court}</span></div>
            <div><strong>Start</strong> <span>{this.state.startsAt}</span></div>
            <div><strong>Ende</strong> <span>{this.state.endsAt}</span></div>
            <div><strong>Trainer</strong> <span>{trainer.spieler}</span></div>

            <div><strong>Spieler</strong> <span id="p1Msg" className={this.state.p1MsgClass}>{this.state.p1MsgTxt}</span></div>
            <div className="form-row">
              <select id="p1" className={'form-control ' + this.state.p1MsgFormCtrl} onChange={this.handleChange} value={this.state.p1}>
                <option value="0">- Bitte auswählen -</option>
                {this.state.spieler.map(r => {
                  return (
                    <option key={'p1' + r.id} value={r.id}>{r.spieler + spielerzusatz(r.geburtsdatum, r.schnupper)}</option>
                  )
                })}
              </select>
            </div>
            <div><strong>Bemerkung</strong> <span id="commentMsg" className={this.state.commentMsgClass}>{this.state.commentMsgTxt}</span></div>
            <div className="form-group">
              <input type="text" id="comment" className={'form-control w-100 ' + this.state.p1MsgFormCtrl} onChange={this.handleChange}
               value={this.state.comment} placeholder="Weitere Spieler, ..." />
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
      + '&sid=' + this.state.seriesId
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
      s.seriesId = this.state.seriesId
      s.userDarfLoeschen = this.state.userDarfLoeschen

      // Alle nicht buchbaren Zeiten der Timetable deaktivieren
      // s.timetable = getBookableTimes(this.state.timetable)
      s.timetable = this.state.timetable
      // Belegte Plätze im Select disablen
      s.courtBelegt = s.timetable[s.startsAt].map(c => c === Config.platzBelegt)

      // Endezeit errechnen
      let endsAtViertel = this.state.startsAt.substring(3, 5)
      let endsAtStd = this.state.endsAt.substring(0, 2)
      if (this.state.bookingType === "ts-einzel") {
        endsAtStd = (Number(this.state.startsAt.substring(0, 2)) + 1).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false })
      }
      else if (this.state.bookingType === "ts-doppel") {
        endsAtStd = (Number(this.state.startsAt.substring(0, 2)) + 2).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false })
      }
      else if (this.state.bookingType === "ts-turnier") {
        if (!(Permissions.VORSTAND === (Permissions.VORSTAND & this.props.permissions))) {
          endsAtStd = (Number(this.state.startsAt.substring(0, 2)) + 2).toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false })
        } else {
          endsAtViertel = this.state.endsAt.substring(3, 5)
        }
      }
      s.endsAt = endsAtStd + ":" + endsAtViertel

      // Bedingungen
      let condEinGast = false
      let condEinMitglied = false
      let condEinSpielerErwVoll = false
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
        // eslint-disable-next-line
        if (p != null && p != 0) // 
        {
          if (p === Number(this.props.userId)) {
            condUserIstSpieler = true
          } if (p === Config.gastId || p === Config.gastJugId) {
            condEinGast = true
          } if (p === Config.mitgliedId) {
            condEinMitglied = true
          }
          // Geburtsdatum und Schnupperstatus prüfen wir mittels spieler-SELECT-Array
          let pAttr = spieler.find(o => o.id === p.toString())
          if (!(isJugendlicher(pAttr['geburtsdatum']) || pAttr['schnupper'] === "1")) {
            condEinSpielerErwVoll = true
          }
        }
      })
      // Auch der Ersteller der Buchung ist zu allem berechtigt
      condUserIstSpieler = condUserIstSpieler || this.props.userId === this.state.r.user_id

      let saveActiveMerker = true
      // Formal müssen Spieler korrekt eingetragen sein

      // Ein Spieler muss eingetragen werden. p1 < 50 sind reserviert IDs 
      if (Number(this.state.p1) < 50) {
        [s.p1msgClass, s.saveActive, s.p1MsgTxt] = Messages.spieleranzahl;
        s.p1MsgFormCtrl = 'is-invalid'
      } 
      
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      if (condEinGast || condEinMitglied) {
        // Gäste und unbenannte Mitglieder müssen einen Kommentar/Namen vermerken. Mind. 2 Zeichen
        if (this.state.comment.length < 2) {
          [s.commentMsgClass, s.saveActive, s.commentMsgTxt] = condEinGast ? Messages.gast : Messages.mitglied
          s.p1MsgFormCtrl = 'is-invalid'
        }
      }
      saveActiveMerker = (saveActiveMerker === true) ? s.saveActive : false

      s.saveActive = saveActiveMerker

      // Alle Ergebnisse in den State
      this.setState(s)

    });
  }
}


export default BelFormTrBuchung;



