
// ****** Konfigurationsdaten *******
const config = {

  // hostname: 'localhost',
  // protokoll: 'http://',
  // loginPage: '/intern/login.php',
  // prod: false,
  
  hostname: 'localhost',
  protokoll: 'http://',
  loginPage: '/intern/login.php',
  prod: true,
  
  // hostname: 'www.tcolching.de',
  // protokoll: 'https://',
  // loginPage: '/intern/login.php',
  // prod: true,
  
  // testuser: {id:211, vorname:'Hart', nachname:'VerdrahtetAdm', permissions: 65535}, // mit Adminrechten
  testuser: {id:211, vorname:'Hart', nachname:'VerdrahtetUsr', permissions: 0}, // mit normalen Benutzerrechten
  stringSeparator: ' ',
  smartphoneWidth: 578,
  anzahlPlaetze: 6,
  platzArray: [],
  daypickerMaxDays: 180,
  daypickerDaysBeforeToday: 3, 
  buchungenlog: '/intern/api/buchungenlog.php',
  platzbuchungen: '/intern/api/platz.php',

  dailyStartTime: 8,
  dailyEndTime: 20,
  eveningTime: 1800,  // 18:00 Uhr
  singleTime: 100, // = 1 Stunde
  doubleTime: 130, // = 1,5 Stunden (1 Stunde, 30 Minuten)
  turnierTime: 200, // = 2 Stunden 
  gastId: 1,
  mitgliedId: 25,
}

const ERR = "text-danger"
const MSG = "text-info"
const NOSAVE = false
const SAVE = true

export const messages = {
  gast: [MSG, SAVE, '- Bitte den Gastnamen ins Kommentarfeld schreiben!'],
  mitglied: [MSG, SAVE, '- Bitte nur für Mitglieder ohne Email verwenden und den Namen ins Kommentarfeld schreiben!'],
  veranstaltung: [ERR, SAVE, '- Bitte den Veranstaltungsanlass ins Kommentarfeld schreiben und den Vorstand informieren!'],
  spieleranzahl: [ERR, NOSAVE, '- Bitte alle Spieler eintragen!'],
  jugendvorrecht: [ERR, SAVE, '- Achtung: Jugendliche haben auf Platz 6 zu dieser Zeit Vorrecht!'],
  erwachsenenvorrecht: [ERR, SAVE, '- Achtung: Erwachsene Vollmitglieder haben zu dieser Zeit Vorrecht!'],
  einzeldauer: [ERR, NOSAVE, '- Für ein Einzel maximal 60 Minuten buchen'],
  doppeldauer: [ERR, NOSAVE, '- Für ein Doppel maximal 90 Minuten buchen'],
  turnierspieldauer: [ERR, NOSAVE, '- Für ein Turnierspiel 120 Minuten buchen'],
  zeit: [ERR, NOSAVE, '- Der Start muss vor dem Ende liegen!'],
  platzbelegt:  [ERR, NOSAVE, '- Platz bereits belegt!'],
};
for (let i = 1; i <= config.anzahlPlaetze; i++) {
  config.platzArray.push(i);
}

// ******* Rechtevergabe **********
export const permissions = {
  // Es gibt 16 Rechte. Übereinandergelegt
  
  // Recht:        1 2 3 4  5  6  7   8   9  10   11   12   13   14    15    16
  // Dezimalwert:  1 2 4 8 16 32 64 128 256 512 1024 2048 4096 8192 16384 32768 
  //
  // Summen daraus sind kombinierte Rechte, z.B. 
  //                3 ist Recht 1 und Recht 2
  //               15 ist Recht 1, 2, 3, 4 (1+2+4+8)
  //              128 ist Recht 8
  //              143 ist Recht 1,2,3,4,8
    NONE : 0,
    MYDATA_READ : 1,
    MYDATA_WRITE : 2,
    MYDATA_UPDATE : 3,          // kombiniert
    ALLDATA_READ : 5,           // kombiniert
    ALLDATA_WRITE : 8,  
    ALLDATA_UPDATE : 15,        // kombiniert
    PERMISSION_FREE_2 : 32,
    PERMISSION_FREE_3 : 64,
    T_ALL_PERMISSIONS : 128,    // Turnierverantwortliche
    VORSTAND : 144,             // kombiniert Vorstand und Turnierverantwortliche
    T_REGISTER : 256,
    PERMISSION_FREE_5 : 512,
    PERMISSION_FREE_6 : 1024,
    PERMISSION_FREE_7 : 2048,
    PERMISSION_FREE_8 : 4096,
    PERMISSION_FREE_9 : 8192,
    PERMISSION_FREE_10 : 16384,
    PERMISSION_UPDATE : 32768,
    ADMINISTRATOR : 65535,
};

export default config;
