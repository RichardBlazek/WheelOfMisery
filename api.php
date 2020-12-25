<?php

file_put_contents('./password.txt', password_hash('time', PASSWORD_DEFAULT));
$f3 = require('fatfree/base.php');

$f3->route('GET /victim',
    function($f3) {
        echo file_get_contents('./victim.txt');
    }
);

$f3->route('POST /set-victim/',
    function($f3) {
        $body = json_decode($f3->get('BODY'));
        $password = $body->password;
        $selected = $body->selected;
        
        $success = password_verify($password, file_get_contents('./password.txt'));
        if ($success) {
            file_put_contents('./victim.txt', $selected);
        }
        echo json_encode($success);
    }
);

$f3->run();

?>