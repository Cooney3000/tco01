import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";
import "./tafel.css";

// Layout eines Tages

class Belegungstag extends Component {
  render() {
    const { bookingData } = this.props;
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
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===1) }/></td>
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===2) }/></td>
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===3) }/></td>
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===4) }/></td>
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===5) }/></td>
              <td className="platz"><Platz courtData={ bookingData.filter((e)=>e.court===6) }/></td>
            </tr>
          </tbody>
          </table>
        </div>
    );
  }
}

export default Belegungstag;








