<?php

$body = json_decode(file_get_contents('php://input'));
$password = $body->password;
$selected = $body->selected;
        
$success = password_verify($password, file_get_contents('./password.txt'));
if ($success) {
    file_put_contents('./victim.txt', $selected);
}
echo json_encode($success);

?>