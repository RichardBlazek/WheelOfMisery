var questions2 = [
    'Teplotní roztažnost pevných látek',
    'Teplotní stupnice',
    'Děje s ideálním plynem',
    'Teplotní roztažnost kapalin',
    'Modely struktur látek',
    'Skupenské teplo',
    'Fázový diagram',
    'Absolutní a relativní vlhkost',
    'Vznik oblačnosti a srážek',
    'Elektrický náboj, elektrování těles',
    'Chování vodičů a nevodičů v elektrickém poli',
    'Coulombův zákon, intenzita elektrického pole',
    'Elektrické napětí',
    'Kondenzátor',
    'Jednoduchý obvod',
    'Práce a výkon v elektrickém obvodu',
    'Voltampérová charakteristika, Ohmův zákon',
    'Zdroje napětí, vnitřní odpor zdroje',
    'Odpor kovového vodiče',
    'Paralelní a sériové zapojení',
    'Tlak v tekutině',
    'Hydrostatický tlak',
    'Atmosférický tlak',
    'Vztlaková síla',
    'Objemový průtok, rovnice kontinuity',
    'Bernoulliova rovnice',
    'Obtékání těles, aerodynamický vztlak',
    'Atomová hypotéza a její důkazy',
    'Avogadrova konstanta, látkové množství',
    'Teplota, 0. zákon termodynamiky',
    'Teplotní stupnice',
    'Vnitřní energie, 1. zákon termodynamiky',
    'Zahřívání těles, tepelná kapacita',
    'Vedení, proudění, záření',
    'Model ideálního plynu, rychlost pohybu molekul',
    'Stavová rovnice ideálního plynu',
    'Děje s ideálním plynem',
    'Práce vykonaná plynem',
    'Tepelné stroje, chladící zařízení',
    '2. zákon termodynamiky',
    'Rozdělení pevných látek podle vnitřní struktury',
    'Model struktury krystalické pevné látky',
    'Deformace v tahu, Hookův zákon',
    'Kirchhoffovy zákony'
];

var questions3 = [
    'Princip vlastních a příměsových polovodičů',
    'PN přechod, dioda, LED',
    'Tranzistor, termistor, fotodioda, fotorezistor',
    'Vedení elektrického proudu kapalinou',
    'Galvanické články, akumulátory',
    'Vedení elektrického proudu plynem',
    'Druhy výbojů v plynech',
    'Magnetická indukce',
    'Magnetické pole magnetu, vodiče a cívky',
    'Magnetické vlastnosti látek',
    'Magnetická síla',
    'Pohyb částice v magnetickém poli',
    'Zákon elektromagnetické indukce',
    'Indukovaný elektrický proud, indukčnost cívky',
    'Elektromotory',
    'Maxwellovy rovnice'
];
function div(a, b) { return ~~(a / b); }
function getVictimsQuestion(victim, index, questions) {
    var value = (div(questions, 3) * index + victim * 3) % questions;
    value = questions === 16 && value === 15 && victim !== 0 ? victim % 15 : value;
    value = questions === 16 && victim === 0 && index === 0 ? 15 : value;
    return value;
}

var studentSelect = document.getElementById('student');
var answersOutput = document.getElementById('answers');
studentSelect.onchange = function () {
    var student = ~~studentSelect.value;
    answersOutput.innerHTML = '<h2>Druhák</h2>';
    for (var i = 0; i < 15; ++i) {
        answersOutput.innerHTML += questions2[getVictimsQuestion(student, i, questions2.length)] + '<br/>';
    }
    answersOutput.innerHTML += '<h2>Třeťák</h2>';
    for (i = 0; i < 15; ++i) {
        answersOutput.innerHTML += questions3[getVictimsQuestion(student, i, questions3.length)] + '<br/>';
    }
}
function compute(fn, count, samples) {
    var stat = new Array(count), i = 0;
    for (i = 0; i < count; ++i) {
        stat[i] = 0;
    }
    for (let i = 0; i < samples; ++i) {
        for (let victim = 0; victim < 17; ++victim) {
            stat[fn(victim, i, count)] += ~~(1 / count * 100);
        }
    }
    return stat;
}