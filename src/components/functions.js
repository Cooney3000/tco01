export function formatDate (d) {
  var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');  
}
// ***** date array 
export const getDateArray = function(start, end) {
  let dt = new Date(start),
      arr = [];
  while (dt <= end) {
    arr.push({ name: formatDate(dt), text: dt.toLocaleDateString("de-DE",{ weekday: 'short', month: 'short', day: 'numeric' })});
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export function spielerzusatz(geburtsdatum) 
{
  let aktuellesJahr = new Date();
  aktuellesJahr = aktuellesJahr.getFullYear();
  let geburtsjahr = new Date(geburtsdatum);
  geburtsjahr = geburtsjahr.getFullYear();
  const jugend = (aktuellesJahr - geburtsjahr) < 18 ? true : false;
  // console.log(`${geburtsdatum} ${geburtsjahr} ${aktuellesJahr} ${jugend}` );
  return jugend ? ' (Jugend)' : '';
}

export function nvb(geburtsdatum) // nvb = nicht voll Berechtigt
{
  if (typeof(geburtsdatum) === 'undefined' || geburtsdatum === null)
  {
    return false;
  }
  // später Schnuppermitglieder hier dazunehmen
  let aktuellesJahr = new Date();
  aktuellesJahr = aktuellesJahr.getFullYear();
  let geburtsjahr = new Date(geburtsdatum);
  geburtsjahr = geburtsjahr.getFullYear();
  const jugend = (aktuellesJahr - geburtsjahr) < 18 ? true : false;
  // console.log(`${geburtsdatum} ${geburtsjahr} ${aktuellesJahr} ${jugend}` );
  return jugend;
}



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
