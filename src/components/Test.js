import React, { Component } from 'react';
import Zeitleiste from "./Zeitleiste";
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import Platz from "./Platz";

// Alle Belegungen an diesem Tag für einen Platz

class Test extends Component {
  render() {
    const day = "2019-05-02";
    return (
        <div>
          <SwipeableViews>
            <div><Platz court="1" day={day} /></div>
            <div>
              <table class="table">
                  <tbody>
                      <tr class="platzDim">
                          <td class="zeitleisteCol">
                              <div class="zeitleiste">
                                  <div class="stunde">08:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">09:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">10:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">11:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">12:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">13:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">14:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">15:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">16:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">17:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">18:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">19:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="stunde">20:00</div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                                  <div class="viertelstunde"></div>
                              </div>
                          </td>
                          <td class="platz">
                              <div class="platznummer">PLATZ X</div>
                              <a href="/belegungsdetails/146">
                                  <div class="D-60 ts T-16-00"><strong>16:00 </strong>Maass, Uhlmann </div>
                              </a>
                              <a href="/belegungsdetails/147">
                                  <div class="D-60 ts T-17-00"><strong>17:00 </strong>McDaniel, Brinkmann </div>
                              </a>
                              <a href="/belegungsdetails/148">
                                  <div class="D-60 ts T-18-00"><strong>18:00 </strong>Grau, Hille </div>
                              </a>
                              <a href="/belegungsdetails/149">
                                  <div class="D-60 ts T-19-00"><strong>19:00 </strong>Mair, Furt </div>
                              </a>
                              <a href="/belegungsdetails/150">
                                  <div class="D-120 ts T-08-00"><strong>08:00 </strong>Grimm, Wetzel </div>
                              </a>
                          </td>
                      </tr>
                  </tbody>
              </table>
            </div>
          </SwipeableViews>
        </div>
      );
  }
}

export default Test;