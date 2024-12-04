<?php

$difficulty_diff = 1;
$complexity = 1;
$history = [];
for ($i = 0; $i < 100; $i++) {

    $needInterval = 10;
    $interval = rand(8, 12);
    $time_diff = $interval - $needInterval;

    $axelerate = 0;
    for ($j = 1; $j < sizeof($history) && $j < 10; $j++) {
        if ($history[$j] > $history[$j - 1])
            $axelerate += 1;
        if ($history[$j] < $history[$j - 1])
            $axelerate -= 1;
    }
    if ($time_diff > 0) {
        $axelerate += 1;
    } else if ($time_diff < 0) {
        $axelerate -= 1;
    }

    $difficulty_diff = pow(2, abs($axelerate));

    if ($time_diff == 0) {
        $difficulty_diff = 0;
    } else if ($time_diff > 0) {
        $difficulty_diff = -$difficulty_diff;
    }
    $new_difficulty += $difficulty_diff;
    if ($new_difficulty < 1) {
        $new_difficulty = 1;
    }
    array_unshift($history, $complexity);
    echo $time_diff . " " . round($difficulty_diff, 2) . " " . $axelerate . " " . round($complexity, 2) . " <br>";
}