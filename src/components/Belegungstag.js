import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";
import "./tafel.css";
// import dateJs from 'datejs';

// Layout eines Tages

class Belegungstag extends Component {
  
  render() {
    //const day = (new Date()).toString("yyyy-MM-dd");
    const day = "2019-05-02";
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
              <td className="platz"><Platz court="1" day={day} /></td>
              <td className="platz"><Platz court="2" day={day} /></td>
              <td className="platz"><Platz court="3" day={day} /></td>
              <td className="platz"><Platz court="4" day={day} /></td>
              <td className="platz"><Platz court="5" day={day} /></td>
              <td className="platz"><Platz court="6" day={day} /></td>
            </tr>
          </tbody>
          </table>
        </div>
    );
  }
}

export default Belegungstag;








