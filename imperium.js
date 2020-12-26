function post(path, callback, body) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	};
	xhr.open('POST', path, true);
	xhr.send(body);
}

var heading = document.getElementById('heading');
var button = document.getElementById('confirm');
var student = document.getElementById('student');
var pwin = document.getElementById('pwin');

var password = null;

function doIt() {
	var choice = student.selectedIndex;
	var choiceIndex = parseInt(student.value);
	var choiceText = student.options[choice].text;
	var pw = (password === null ? pwin.value : password);

	post('/set-victim.php', function (response) {
		if (response.includes('true')) {
			heading.innerHTML = choiceText;
			password = pw;
			pwin.style.display = 'none';
		}
	}, JSON.stringify({ 'selected': choiceIndex, 'password': pw }));
}

button.addEventListener('click', doIt);