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

function div(a, b) { return ~~(a / b); }
function getVictimsQuestion(victim, index, questions) {
    var value = (div(questions, 3) * index + victim * 3) % questions;
    value = questions === 16 && value === 15 && victim !== 0 ? victim % 15 : value;
    value = questions === 16 && victim === 0 && index === 0 ? 15 : value;
    return value;
}

function draw(canvas, ctx, image, count, rotation) {
    var angle = getAngle(count);
    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, -canvas.width / 2, -canvas.height / 2);

    ctx.rotate(rotation);
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.rotate(-rotation);

    ctx.strokeStyle = '#EEE';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle * 0.5) * (canvas.width / 8), Math.sin(angle * 0.5) * (canvas.width / 8));
    ctx.stroke();
}

var grade = 3;
var nextGrade = { 2: 3, 3: 2 };
var questions = { 2: 44, 3: 16 };
var gradeText = { 2: 'Přepnout na třeťak', 3: 'Přepnout na druhák' };

var changeGrade = document.getElementById('changeGrade');
var spinIt = document.getElementById('spinIt');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var image = { 2: document.getElementById('image2'), 3: document.getElementById('image3') };

var student = {
    index: 37, question2: 45, question3: 73, loading: false, getQuestion: function () {
        return getVictimsQuestion(this.index, grade === 2 ? this.question2 : this.question3, questions[grade]);
    },
    next: function (grade) {
        if (grade === 2) {
            this.question2 += 1;
        } else {
            this.question3 += 1;
        }
    },
    setIndex: function (i) {
        if (i !== this.index) {
            this.question2 = this.question3 = 0;
        }
        this.index = i;
    }
};
var spining = { started: false, stopping: false, rotation: 0.0, speed: 0.0, acceleration: 0.0 };

function drawAll() {
    draw(canvas, context, image[grade], questions[grade], spining.rotation);
}

changeGrade.addEventListener('click', function () {
    if (!spining.started) {
        grade = nextGrade[grade];
        changeGrade.innerHTML = gradeText[grade];
        spining.rotation = 0.0;
        drawAll();
    }
});

function turn() {
    drawAll();
    if (spining.speed > 0) {
        spining.rotation += spining.speed;
        spining.speed += spining.acceleration;
    } else {
        spining.started = spining.stopping = false;
    }
}

function startSpining() {
    student.loading = true;
    spining.started = true;
    spinIt.innerHTML = 'Zastavit';
    get('/victim.txt', function (response) {
        student.setIndex(parseInt(response));
        student.loading = false;
    });
    spining.acceleration = 0.0;
    spining.speed = getAngle(questions[grade]) * (questions[grade] == 16 ? 0.2 : 0.5);
}

function stopSpining() {
    spining.stopping = true;
    var position = getPosition(spining.rotation, questions[grade]);
    var destination = student.getQuestion() + 0.5;
    var diff = (destination - position) * getAngle(questions[grade]);
    diff = (diff < TAU * 2 / 3 ? diff + TAU : diff);
    spining.acceleration = -computeDeceleration(spining.speed, diff);
    student.next(grade);
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

drawAll();
window.setInterval(turn, 25);