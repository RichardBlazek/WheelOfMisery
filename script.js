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

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function toInt(f) {
    return ~~f;
}

TAU = 2 * Math.PI;

function getAngle(count) {
    return TAU / count;
}

function getPosition(rotation, count) {
    return toInt(Math.round(rotation / TAU * count)) % count;

}

function drawCircle(ctx, width, stroke, fill, x, y, r) {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    ctx.fill();
}

function drawInsideWheel(canvas, ctx, count) {
    var angle = getAngle(count);
    drawCircle(ctx, 6, '#888', '#222', 0, 0, canvas.width / 8 - 10);

    ctx.fillStyle = '#FF0';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -10);
    ctx.lineTo(Math.cos(-angle * 0.5) * (canvas.width / 8), Math.sin(-angle * 0.5) * (canvas.width / 8));
    ctx.fill();
}

function fillPie(ctx, style, x, y, r, start, stop) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, start, stop);
    ctx.fill();
}

function drawWheel(canvas, ctx, questions, rotation) {
    var count = questions.length, angle = getAngle(count), i = 0;
    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);

    drawCircle(ctx, 8, '#444', '#F88', 0, 0, canvas.width / 2 - 10);
    for (i = 0; i < count; i += 2) {
        fillPie(ctx, '#6F6', 0, 0, canvas.width / 2 - 10, TAU / count * i, TAU / count * (i + 1));
    }

    ctx.font = '11px Helvetica, Verdana, sans-serif';
    ctx.fillStyle = '#000';
    for (i = 0; i < count; ++i) {
        ctx.rotate(-angle * 0.5);
        ctx.fillText(questions[i], canvas.width / 8, 4);
        ctx.rotate(angle * 1.5);
    }
    ctx.rotate(-rotation);
    drawInsideWheel(canvas, ctx, count);
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

function getVictimsQuestion(victim, index, questions) {
    return questions[(victim * 2 + index * (victim + 3)) % questions.length];
}

var changeGrade = document.getElementById('changeGrade');
var spinIt = document.getElementById('spinIt');
var canvas = document.getElementById('canvas'), context = canvas.getContext('2d');

var student = -1;
var spining = { started: false, stopping: false };
var grade2 = { second: true, questions: questions2 };
var grade3 = { second: false, questions: questions3 };
var grade = grade3;

changeGrade.addEventListener('click', function () {
    if (!spining.started) {
        grade = grade.second ? grade3 : grade2;
        changeGrade.innerHTML = grade.second ? 'Přepnout na třeťak' : 'Přepnout na druhák';
        drawWheel(canvas, context, grade.questions, 0.0);
    }
});

function turn(angle, slowness, rotation) {
    drawWheel(canvas, context, grade.questions, rotation);
    if (spining.stopping) {
        slowness += angle / 25;
    }
    if (angle > slowness) {
        window.setTimeout(turn, 40, angle, slowness, rotation + angle - slowness);
    } else {
        spining = { started: false, stopping: false };
    }
}

function startSpining() {
    student = 'loading';
    spining.started = true;
    spinIt.innerHTML = 'Zastavit';
    get('/victim', function (resp) {
        student = parseInt(resp);
    });
    turn(getAngle(grade.questions.length) * 0.25, 0.0, 0.0);
}

function stopSpining() {
    spining.stopping = true;
    spinIt.innerHTML = 'Pořádně to roztočit';
}

spinIt.addEventListener('click', function () {
    if (student !== 'loading') {
        if (!spining.started && !spining.stopping) {
            startSpining();
        } else if (spining.started && !spining.stopping) {
            stopSpining();
        }
    }
});

drawWheel(canvas, context, grade.questions, 0.0);