<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-data/utils.php";

$domain = get_required(domain);

$axelerate = 0;
$difficulty_history = dataHistory([mining, $domain, difficulty], 0, 50);
for ($i = 1; $i < sizeof($difficulty_history); $i++) {
    if ($difficulty_history[$i] > $difficulty_history[$i - 1])
        $axelerate += 1;
    if ($difficulty_history[$i] < $difficulty_history[$i - 1])
        $axelerate -= 1;
}

$response[difficulty_history] = $difficulty_history;
$response[axelerate] = $axelerate;

commit($response);