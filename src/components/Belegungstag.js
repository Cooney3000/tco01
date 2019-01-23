import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";
import "./tafel.css";

// Layout eines Tages

class Belegungstag extends Component {
  render() {
    return (
        <div>
          <table className="table">
          <thead>
            <tr>
              <th scope="col">Zeit</th>
              <th scope="col">Platz 1</th>
              <th scope="col">Platz 2</th>
              <th scope="col">Platz 3</th>
              <th scope="col">Platz 4</th>
              <th scope="col">Platz 5</th>
              <th scope="col">Platz 6</th>
            </tr>
          </thead>
          <tbody>
            <tr className="platzDim">
              <td className="zeitleiste"><Zeitleiste /></td>
              <td className="platz"><Platz /></td>
              <td className="platz"><Platz /></td>              
              <td className="platz"><Platz /></td>
              <td className="platz"><Platz /></td>
              <td className="platz"><Platz /></td>
              <td className="platz"><Platz /></td>
            </tr>
          </tbody>
          </table>
        </div>
    );
  }
}

function getBelegungstag(belegungDate) {
  const url = "http://localhost/api/api.php/records/bookings?filter=starts_at,ge,2018-12-27&filter=ends_at,lt,2018-12-28&order=starts_at";
  let r;
  fetch(url)
  .then(result => result.json())
  .then(result => {
      r = result.records
  })
  .catch(function(err) {
    console.log(err)
 });
 console.log(r);
 return r;
}

export default Belegungstag;








