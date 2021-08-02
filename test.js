 
  let zeit = new Date()
  let endeTag = new Date()
  
  // // TESTDATEN ***************************************************
  // zeit = new Date(2020, 4, 23)
  // endeTag = new Date(2020, 4, 23)
  
  zeit.setHours(8,0,0,0)
  endeTag.setHours(21,0,0,0)
  const timetable = []
  for ( ; 
        zeit <= endeTag; 
        zeit = new Date(zeit.getTime() + 900000) ) // 900000 Millisekunden sind 15 Minuten
  {
    timetable[zeit] = []
    for( let i = 0; i < 6; i++) 
    {
      timetable[zeit].push(true)
    }
  }
  let startBooking = ['--', '--', '--', '--', '--', '--']
  // for (let slot in timetable) {
    // for (p of timetable[slot]) {
    //   console.log(slot, slot.substr(19, 2))
    //   // if (timetable[slot][p] === false) {
    //   //   startBooking [timetable[slot][p]] = slot.substr(0, 2)
    //   // }
    // }
  // }
  for (t in timetable) {
    console.log(t)
  }
  

  /*
UPDATE bookings set starts_at = DATE_ADD(starts_at, INTERVAL 9 MONTH) WHERE id = 4855


  */