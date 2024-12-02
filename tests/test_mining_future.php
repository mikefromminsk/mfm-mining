<?php


$bank = 1000000;
$last_bank = $bank;

for ($i = 0; $i < 4000000; $i++) {
    $bank -= $bank * 0.000001;
    if ($bank < $last_bank / 1.1){
        $last_bank = $bank;
        echo floor($i / 60 / 24/ 350 * 100) . " " . floor($bank)  . " " . ($i / 100) . "<br>";
    }
}