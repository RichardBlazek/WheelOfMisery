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
    return (rotation / TAU * count + 0.5) % count;
}

function computeDeceleration(speed, distance) {
    return speed * speed / (2 * distance - speed);
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
    drawCircle(ctx, 10, '#888', '#222', 0, 0, canvas.width / 8 - 10);

    ctx.fillStyle = '#EEE';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -10);
    ctx.lineTo(Math.cos(angle * 0.5) * (canvas.width / 8 + 5), Math.sin(angle * 0.5) * (canvas.width / 8 + 5));
    ctx.fill();
}

function fillPie(ctx, style, x, y, r, start, stop) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, start, stop);
    ctx.fill();
}

var colors = ['#58F', '#F5C', '#FC1', '#4D4'];
function drawWheel(canvas, ctx, questions, rotation) {
    var count = questions.length, angle = getAngle(count), i = 0;
    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);

    drawCircle(ctx, 10, '#444', '#FFF', 0, 0, canvas.width / 2 - 15);
    for (i = 0; i < count; ++i) {
        fillPie(ctx, colors[i & 3], 0, 0, canvas.width / 2 - 15, TAU / count * i, TAU / count * (i + 1));
    }

    ctx.font = '11px Helvetica, Verdana, sans-serif';
    ctx.fillStyle = '#000';
    for (i = 0; i < count; ++i) {
        ctx.rotate(angle * 0.5);
        ctx.fillText(questions[i], canvas.width / 8, 4);
        ctx.rotate(-angle * 1.5);
    }
    ctx.rotate(-rotation);
    drawInsideWheel(canvas, ctx, count);
}

function div(a, b) { return ~~(a / b); }
function getVictimsQuestion(victim, index, questions) {
    var value = (div(questions, 3) * index + victim * 3) % questions;
    value = questions === 16 && value === 15 && victim !== 0 ? victim % 15 : value;
    value = questions === 16 && victim === 0 && index === 0 ? 15 : value;
    return value;
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

var changeGrade = document.getElementById('changeGrade');
var spinIt = document.getElementById('spinIt');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var student = {
    index: 37, question2: 45, question3: 73, loading: false, getQuestion: function (questions, second) {
        return getVictimsQuestion(this.index, second ? this.question2 : this.question3, questions);
    },
    next: function (second, reset) {
        if (reset) {
            this.question2 = this.question3 = 0;
        } else if (second) {
            this.question2 += 1;
        } else {
            this.question3 += 1;
        }
    }
};
var spining = { started: false, stopping: false, rotation: 0.0, speed: 0.0, acceleration: 0.0, stopRotation: Infinity };
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

function turn() {
    drawWheel(canvas, context, grade.questions, spining.rotation);
    if (spining.speed > 0) {
        spining.rotation += spining.speed;
        if (spining.rotation >= spining.stopRotation) {
            spining.speed += spining.acceleration;
        }
    } else {
        spining.stopRotation = Infinity;
        spining.started = spining.stopping = false;
    }
}

function startSpining() {
    student.loading = true;
    spining.started = true;
    spinIt.innerHTML = 'Zastavit';
    get('/victim', function (response) {
        var index = parseInt(response);
        student.next(grade.second, index !== student.index);
        student.index = index;
        student.loading = false;
    });
    spining.acceleration = 0.0;
    spining.speed = getAngle(grade.questions.length) * (grade.questions.length == 16 ? 0.1 : 0.25);
}

function stopSpining() {
    spining.stopping = true;
    var position = getPosition(spining.rotation, grade.questions.length);
    var destination = student.getQuestion(grade.questions.length, grade.second) + 0.5;
    var diff = (destination - position) * getAngle(grade.questions.length);
    diff = (diff < TAU / 2 ? diff + TAU : diff);
    spining.stopRotation = spining.rotation + diff;
    spining.acceleration = -computeDeceleration(spining.speed, TAU / 2);
    spinIt.innerHTML = 'Pořádně to roztočit';
}

spinIt.addEventListener('click', function () {
    if (!student.loading) {
        if (!spining.started && !spining.stopping) {
            startSpining();
        } else if (spining.started && !spining.stopping) {
            stopSpining();
        }
    }
});

drawWheel(canvas, context, grade.questions, 0.0);
window.setInterval(turn, 25);