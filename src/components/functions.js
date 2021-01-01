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
