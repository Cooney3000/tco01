import Config from './Defaults';

export const formatDate = (d) => {
  var month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

// ***** date array 
export const getDateArray = (start, end) => {
  let dt = new Date(start),
    arr = [];
  while (dt <= end) {
    arr.push({ name: formatDate(dt), text: dt.toLocaleDateString("de-DE", { weekday: 'short', month: 'short', day: 'numeric' }) });
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
}

export const spielerzusatz = (geburtsdatum, schnupper) => {
  let aktuellesJahr = new Date();
  aktuellesJahr = aktuellesJahr.getFullYear();
  let geburtsjahr = new Date(geburtsdatum);
  geburtsjahr = geburtsjahr.getFullYear();
  const jugend = (aktuellesJahr - geburtsjahr) < 18 ? true : false;
  // console.log(`${geburtsdatum} ${geburtsjahr} ${aktuellesJahr} ${jugend}` );
  let zusatz = ' (' + (jugend ? 'Jug' : '') + (Number(schnupper) === 1 ? ',Schn' : '') + ')'
  zusatz = zusatz.replace('(,', '(')
  zusatz = zusatz.replace('()', '')
  return zusatz
}

// jugendlicher = nicht voll Berechtigt
export const jugendlicher = (geburtsdatum) => {
  if (typeof (geburtsdatum) === 'undefined' || geburtsdatum === null) {
    return false;
  }
  let aktuellesJahr = new Date();
  aktuellesJahr = aktuellesJahr.getFullYear();
  let geburtsjahr = new Date(geburtsdatum);
  geburtsjahr = geburtsjahr.getFullYear();
  const jugend = ((aktuellesJahr - geburtsjahr) < 18) ? true : false;
  // console.log(`${geburtsdatum} ${geburtsjahr} ${aktuellesJahr} ${jugend}` );
  return jugend;
}

// Serverzeit?
export const servertimeNow = () => {
  const cookies = parseCookie(document.cookie)
  const servertime = cookies['servertime']
  const st = new Date(Number(servertime))
  return st
}

//#Source https://bit.ly/2neWfJ2 
const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});


// Setze alle Zeiten auf false, die nicht als Start verwendet werden dürfen
export function getBookableTimes(tt) {
  // Zu welchem Slot kann auf einem Platz gestartet werden?
  let startBooking = ['--', '--', '--', '--', '--', '--']
  for (let slot in tt) {  // Iteration über die Indizes der Slots
    for (let p in tt[slot]) { // Iteration über die Indizes (0 - 5) der Plätze je Viertelstunden
      if (startBooking[p] === '--' && tt[slot][p] === Config.platzBelegt) {  // Wenn ein Platz an einer Stelle nicht buchbar ist, ist er ".."
        startBooking[p] = slot.substr(19, 2) // Merke dir die Minuten des Slots. An Pos 19 sind die Minuten
      }
    }
  }
  // Alle Plätze nur zu möglichen Startzeiten erlauben, andere Zeiten sperren ("--")
  // z. B. Wenn eine Buchung um xx:30 Uhr besteht, dann sind keine Buchungen zur vollen Stunde erlaubt, 
  // um nicht Lücken entstehen zu lassen
  // *****************  DERZEIT INAKTIV!!! ******************
  const timetable = []
  for (let slot in tt) {  // Iteration über die Indizes der Viertelstunden (0..51)
    timetable[slot] = []
    for (let p in tt[slot]) { // Iteration über die Indizes (0 - 5) der Plätze je Viertelstunden
      // console.log("p, tt[slot][p]: ", p, tt[slot][p])
      if (startBooking[p] === '--') { // Auf diesem Platz p gibt es an diesem Tag noch keine Buchung
        timetable[slot][p] = tt[slot][p]  // Platzziffer übernehmen
      }
      else {
        if ((startBooking[p] === slot.substr(19, 2) || tt[slot][p] === Config.platzBelegt)) {  // Das ist eine gültige Zeit für einen Platz
          timetable[slot][p] = tt[slot][p] // Platzziffer (oder eben Sperrzeichen) übernehmen
        } else {
          timetable[slot][p] = Config.platzLeer
        }
      }
    }
  }
  return timetable
}

// Liefere die Daten für einen HTML-SELECT mit belegten und freien Zeiten
export function getTimetable(belegungen) {
  // Erzeuge alle Zeiten als Timestamps für den HTML-Select in einem zweidimensionalen Objekt
  // mit Uhrzeiten im Slot-Takt (z. B. 30 oder 15 Minutene, je nach Config)
  // in der Form {<uhrzeit> : {platz: <platz>, <aktiv|inaktiv>}}

  let zeit = new Date();
  let endeTag = new Date();

  // Die Timetable erzeugen, alle Plätze und Zeiten "frei", also Anzeige der Platznummer
  zeit.setHours(8, 0, 0, 0);
  endeTag.setHours(21, 0, 0, 0);
  const timetable = [];
  for (; zeit <= endeTag; zeit = new Date(zeit.getTime() + Config.slotMinimalMinutes)) {
    const tagesZeit = zeit.toTimeString().substr(0, 5)
    timetable[tagesZeit] = [];
    for (let i = 1; i <= Config.anzahlPlaetze; i++) {
      timetable[tagesZeit].push(i);
    }
  }

  // Jetzt belegte Zeiten mit "X" belegen
  // Wir haben 2 Objekte: 
  // 1. Wir iterieren über die Belegungen, sortiert nach Anfangszeit und Platz. 
  // 2. timetable, auf das wir direkt über die Zeit zugreifen
  // console.log(belegungen)
  for (let bKey in belegungen) {
    let sa = new Date(belegungen[bKey].starts_at);
    let ea = new Date(belegungen[bKey].ends_at);
    // console.log(belegungen[bKey].starts_at + ", " + belegungen[bKey].ends_at)
    let anzahlSlots = (ea - sa) / Config.slotMinimalMinutes;
    for (let i = 0; i < anzahlSlots; i++) {
      let saTmp = new Date(sa.getTime() + (i * Config.slotMinimalMinutes));
      let cTmp = Number(belegungen[bKey].court) - 1;
      timetable[saTmp.toTimeString().substr(0, 5)][cTmp] = Config.platzBelegt;
      // console.log(saTmp, timetable[saTmp][cTmp], ', court: ', cTmp)
    }
  }
  return timetable;
}







///////////////////////// KANN DAS FUNKTIONIEREN??? //////////////////////
// const Model = () => {
//   let liste = {};
//   registerListener(callback) {
//     liste                               ;
//   }
//   unregisterListener(callback) {
//     callback.setTafelDatum(this.tafelDatum)///////////////////////////////////
//   }
// }

// Auswahl über Mausposition???
// handleClick (e) {

//   var offset = $(this).offset();
//   var hoehe = $(this).height(); 
//   var relativeX = (e.pageX - offset.left);
//   var relativeY = (e.pageY - offset.top);
//   var halbeStdHoehe = (hoehe - 30)/13;     
//   var std = relativeY/halbeStdHoehe;
//   var minuten = Math.round((std - Math.floor(std))) * 30;
//   std = Math.floor(std) + 7;

//   alert("X: " + relativeX + "  Y: " + relativeY + " Zeit: " + std + ":" + minuten + " h, Höhe: " + hoehe);

// };
