<?php

session_start();

$loggedIn = false;
$hash = file_get_contents('./password.txt');

if (isset($_SESSION['password']) && password_verify($_SESSION['password'], $hash)) {
    $loggedIn = true;
} else if (isset($_POST['password']) && password_verify($_POST['password'], $hash)) {
    $loggedIn = true;
    $_SESSION['password'] = $_POST['password'];
}

if ($loggedIn && isset($_POST['victim'])) {
    file_put_contents('./victim.txt', $_POST['victim']);
}

$victim = file_get_contents('./victim.txt');

?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Přístup vládce</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./site.css" rel="stylesheet" />
</head>

<body>
    <h1 id="heading"></h1><br />
    <form method="POST">
        <?php if ($loggedIn) { ?>
            <label for="victim">Student:</label><br/>
            <select id="victim" name="victim">
                <option value="0">Blažek</option>
                <option value="1">Bušová</option>
                <option value="2">Dominik</option>
                <option value="3">Halaštová</option>
                <option value="4">Heroudková</option>
                <option value="5">Kadeřábek</option>
                <option value="6">Krupka</option>
                <option value="7">Malota</option>
                <option value="8">Nevrlka</option>
                <option value="9">Pezlar</option>
                <option value="10">Povolný</option>
                <option value="11">Punčochář</option>
                <option value="12">Reichertová</option>
                <option value="13">Rychlý</option>
                <option value="14">Tlačbaba</option>
                <option value="15">Tran</option>
                <option value="16">Veselý</option>
            </select>
        <?php } else { ?>
            <label for="password">Heslo:</label><br/>
            <input type="password" id="password" name="password"><br/>
        <?php } ?>
        <button type="submit">Potvrdit</button>
    </form>
    <?php if ($loggedIn) { ?>
        <script>
            window.onload = function() {
                var victim = document.getElementById('victim');
                var heading = document.getElementById('heading');
                heading.innerHTML = victim.options[ <?php echo $victim ?>].text;
            }
        </script>
    <?php }?>
</body>

</html>