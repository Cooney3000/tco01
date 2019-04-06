import React from 'react';
import { ADD_BELEGUNG, FETCH_BEL_REQUESTED, FETCH_BEL_SUCCESS } from "../constants/action-types";
import { HOSTNAME } from "../constants/config";
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export function addBel(payload) {
  return { type: ADD_BELEGUNG, payload }
};

export function requestBel(court, day1, day2) {
  return {
    FETCH_BEL_REQUESTED, 
    court, day1, day2
  }
}

export function fetchBel(court, day1, day2) {
  const url = HOSTNAME + "/intern/api/platz.php?op=ra&p=" + court + "&ds=" + day1 + "&de=" + day2;
  console.log("fetch " + url);
  return function(dispatch) {
    dispatch(requestBel(court, day1, day2));
    return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveBel(json)));
  };
}

function receiveBel(json) {

  // console.log("Daten erhalten von Platz", court + ", Datum:", day1, "-", day2);
  // console.log(json);
  let courtData = json.records.map ( r => {
    let k = r.id;
    let cn = computeBelClasses (r.starts_at, r.ends_at);
    let spieler = 
        r.p1 
      + (r.p2 ? ', ' + r.p2 : ' ') 
      + (r.p3 ? ', ' + r.p3 : ' ') 
      + (r.p4 ? ', ' + r.p4 : ' ');
    return ( 
      <Link key={k} to={'/belegungsdetails/' + r.id}>
        <div key={k} className={cn}>
          <strong>{r.starts_at.substring(11,16)} </strong>
          {spieler}
        </div>
      </Link>
    )
  })
  return {
    type: FETCH_BEL_SUCCESS,
    payload: courtData,
  }
}

// CSS-Klassen bilden für die Positionierung und Höhe einer Belegung auf der Tafel
function computeBelClasses (s, e) {
  // Dauer berechnen, also z. B. '2019-05-02 16:00:00' - '2019-05-02 14:00:00' = 120
  let dauer = (Number(e.substring(11,13))*60 + Number(e.substring(14,16))) - (Number(s.substring(11,13))*60 + Number(s.substring(14,16)));
  let cn = classNames(
    'D-' + dauer,
    'ts', 
    'T-' + s.substring(11, 16).replace(':', '-'),
    );
  return cn;
}
