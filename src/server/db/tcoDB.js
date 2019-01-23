// Alle Belegungsdaten eines Tages für alle Plätze

function getBelegungstag(belegungDate) {
  const url = "http://localhost/api/api.php/records/bookings?filter=starts_at,ge,2018-12-27&filter=ends_at,lt,2018-12-28&order=starts_at";

  fetch(url)
  .then(result => result.json())
  .then(result => {
      return result.records
  })
  .catch(function(err) {
    console.log(err)
 });

}
  
export default getBelegungstag;