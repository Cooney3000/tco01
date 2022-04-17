
// ****** Konfigurationsdaten *******

export const hostLocal = false   // true = localhost zum Testen

const config = {
  // testuser: {id:211, vorname:'Hart', nachname:'VerdrahtetAdm', permissions: 65535}, // mit Adminrechten
  testuser: {id:211, vorname:'Hart', nachname:'VerdrahtetUsr', permissions: 0}, // mit normalen Benutzerrechten
  //  testuser: {id:357, vorname:'Hart', nachname:'VerdrahtetUsr2', permissions: 432}, // mit normalen Benutzerrechten
  stringSeparator: ' ',
  smartphoneWidth: 578,
  anzahlPlaetze: 6,
  platzArray: [],
  daypickerMaxDays: 180,
  daypickerDaysBeforeToday: 3, 
  daypickerDaysBeforeTodayWide: 9, 
  buchungenlog: '/intern/api/buchungenlog.php',
  platzbuchungen: '/intern/api/platz.php',

  dailyStartTime: 8,
  dailyEndTime: 20,
  eveningTime: 1700,  // 17:00 Uhr, alte Platzordnung war 18:00 Uhr
  maxMinutesDistance: 15, // Gäste und Jugendliche dürfen abends erst kurz vor der Spielzeit buchen
  singleTime: 60, // = 1 Stunde
  doubleTime: 120, // = 2 Stunden 
  turnierTime: 120, // = 2 Stunden 
  gastId: 1,
  mitgliedId: 25,
  gastJugId: 28,
  mitgliedJugId: 29,
  platzLeer: "\u00A0\u00A0",
  platzBelegt: "\u29EB",
  slotMinimalMinutes: 1800000, // = 30 Minuten
  delimiter: "§§§",
  hostname: '',
  protokoll: '',
  loginPage: '',
  prod: false,
  std24: 93600000 // 24 Stunden + 1 Std Zeitzone + 1 Std Sommerzeit in Millisekunden 
  // std24: 50400000    // 12 Stunden + 1 Std Sommerzeit Zeitzone + 1 Std in Millisekunden
}
if (hostLocal) {
  config.hostname = 'localhost'
  config.protokoll = 'http://'
  config.loginPage = '/intern/login.php'
  config.prod = false
} else {    
  config.hostname = 'www.tcolching.de'
  config.protokoll = 'https://'
  config.loginPage = '/intern/login.php'
  config.prod = true
}

const IMPORTANT = "text-danger"
const MSG = "text-info"
const NOSAVE = false
const SAVE = true

export const messages = {
  gast: [IMPORTANT, NOSAVE, '- Bitte den Gastnamen ins Kommentarfeld schreiben und die Gebühr innerhalb einer Woche überweisen!'],
  mitglied: [IMPORTANT, NOSAVE, '- Bitte nur für Mitglieder ohne Email verwenden und den Namen ins Kommentarfeld schreiben!'],
  veranstaltung: [MSG, SAVE, '- Bitte den Veranstaltungsanlass ins Kommentarfeld schreiben und den Vorstand informieren!'],
  spieleranzahl: [IMPORTANT, NOSAVE, '- Bitte alle Personen eintragen!'],
  jugendvorrecht: [MSG, SAVE, '- Achtung: Jugendliche haben auf Platz 6 zu dieser Zeit Vorrecht!'],
  erwachsenenvorrecht: [IMPORTANT, NOSAVE, '- Buchung erst 15 Minuten vor Spielbeginn möglich, da werktags ab 17:00 Uhr ein erw. Vollmitglied mitspielen muss.'],
  einzeldauer: [IMPORTANT, NOSAVE, '- Für ein Einzel maximal 60 Minuten buchen'],
  doppeldauer: [IMPORTANT, NOSAVE, '- Für ein Doppel maximal 120 Minuten buchen'],
  turnier: [MSG, SAVE, '- Turnierspiele 120 Minuten. Falls möglich auf Platz 1 buchen. Parallel sollte ein Platz auf der Anlage nicht durch Turniere oder Training belegt sein! Wer Mannschaftstraining hat, darf nur auf den Plätzen der Mannschaft Turnier spielen.'],
  turnierspieldauer: [IMPORTANT, NOSAVE, '- Turnierspiele 120 Minuten. Falls möglich auf Platz 1 buchen. Parallel sollte ein Platz auf der Anlage nicht durch Turniere oder Training belegt sein! Wer Mannschaftstraining hat, darf nur auf den Plätzen der Mannschaft Turnier spielen.'],
  zeit: [IMPORTANT, NOSAVE, '- Der Start muss vor dem Ende liegen!'],
  platzbelegt:  [IMPORTANT, NOSAVE, '- Platz bereits belegt!'],
  max24h:  [IMPORTANT, NOSAVE, '- Einzel/Doppel maximal 24 Stunden im Voraus buchbar!'],
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
    MANNSCHAFTSFUEHRER : 32,
    WIRT : 64,
    T_ALL_PERMISSIONS : 128,    // Turnierverantwortliche
    TRAINER : 256,
    VORSTAND : 496,             // kombiniert 16, 32, 64, 128, 256
    ADMINISTRATOR : 65535,
};

export default config;
