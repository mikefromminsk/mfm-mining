<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-data/utils.php";

$round_reward_percent = 0.001;
$round_seconds = 10;


function getReward($domain) {
    $round_reward_percent = 0.0001;
    $token_balance = tokenBalance($domain, mining);
    return round($token_balance * $round_reward_percent, 2);
}