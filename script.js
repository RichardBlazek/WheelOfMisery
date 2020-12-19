function get(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}

function drawWheel(canvas, questions, rotation) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = '#FFD';
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

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
    'Kirchhoffovy zákony',
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
    'Deformace v tahu, Hookův zákon'
]

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
]

var changeGrade = document.getElementById('changeGrade');
var spinIt = document.getElementById('spinIt');

var secondGrade = false, student = -1;

changeGrade.addEventListener('click', function () {
    secondGrade = !secondGrade;
    changeGrade.innerHTML = secondGrade ? 'Přepnout na třeťak' : 'Přepnout na druhák';
});

spinIt.addEventListener('click', function () {
    if (student !== 'loading') {
        student = 'loading';
        get('/victim', function (resp) {
            student = parseInt(resp);
        });
    }
});

drawWheel(document.getElementById('canvas'), questions2, 0.0);