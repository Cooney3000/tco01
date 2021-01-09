export const formatDate = (d) =>
{
  var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');  
}

// ***** date array 
export const getDateArray = (start, end) => 
{
  let dt = new Date(start),
      arr = [];
  while (dt <= end) {
    arr.push({ name: formatDate(dt), text: dt.toLocaleDateString("de-DE",{ weekday: 'short', month: 'short', day: 'numeric' })});
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export const isValidDate = (d) => 
{
  return d instanceof Date && !isNaN(d);
}

export const spielerzusatz = (geburtsdatum, schnupper) => 
{
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
  if (typeof(geburtsdatum) === 'undefined' || geburtsdatum === null)
  {
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


// Liefere die Daten für einen HTML-SELECT mit belegten und freien Zeiten
const getSelectFill = (belegungen) => {

  // Erzeuge alle Zeiten als Timestamps für den HTML-Select in einem zweidimensionalen Objekt
  // mit Uhrzeiten im Viertelstunden-Takt
  // in der Form {<uhrzeit> : {platz: <platz>, <aktiv|inaktiv>}}
  let zeit = new Date()
  let endeTag = new Date()
  
  // TESTDATEN ***************************************************
  zeit = new Date(2020, 4, 22)
  endeTag = new Date(2020, 4, 22)
  
  zeit.setHours(8,0,0,0)
  endeTag.setHours(21,0,0,0)
  const timetable = {}
  for ( ; 
        zeit <= endeTag; 
        zeit = new Date(zeit.getTime() + 900000) ) // 900000 Millisekunden sind 15 Minuten
  {
      timetable[zeit] = []
      for(let i = 0; i<config.anzahlPlaetze; i++) 
      {
        timetable[zeit].push(true)
      }
  }
  
  // Wir haben 2 Objekte: 
  // 1. Wir iterieren über die Belegungen, sortiert nach Anfangszeit und Platz. 
  // 2. timetable, auf das wir direkt über die Zeit zugreifen

  // console.log(belegungen)
  const viertelMs = 15*1000*60 // eine Viertelstunde in Millisekunden
  for(let bKey in belegungen) 
  {
    let sa = new Date(belegungen[bKey].starts_at)
    let ea = new Date(belegungen[bKey].ends_at)

    let anzahlViertel = (ea - sa)/viertelMs
    for (let i = 0; i < anzahlViertel; i++) 
    {
      let saTmp = new Date(sa.getTime() + (i * viertelMs))
      let cTmp = Number(belegungen[bKey].court) - 1
      timetable[saTmp][cTmp] = false
      console.log(saTmp, timetable[saTmp][cTmp], ', court: ', cTmp)
    }
    

    // console.log("Starts: ", sa, " Ende: ", ea, " Dauer: ", anzahlViertel, " Timetable: ", timetable[sa])
  }
  return timetable
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
