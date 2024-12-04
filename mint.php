<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-mining/utils.php";

$gas_address = get_required(gas_address);
$nonce = get_int_required(nonce);

$domain = get_required(domain);

tokenRegScript($domain, mining, "mfm-mining/mint.php");

$last_hash = dataGet([mining, $domain, last_hash]) ?: "";
$difficulty = dataGet([mining, $domain, difficulty]) ?: 1;

$str = $last_hash . $domain . $nonce;
$new_hash = md5($str);

$response[str] = $str;
$response[new_hash] = $new_hash;
$response[last_hash] = $last_hash;

$gmp = gmp_init("0x$new_hash");
$gmp = gmp_div_r($gmp, $difficulty);

if (gmp_strval($gmp) == "0") {
    $reward = getReward($domain);
    tokenSend($domain, mining, $gas_address, $reward);
    $interval = time() - dataInfo([mining, $domain, last_hash])[data_time];
    $need_interval = 5;
    $time_diff = $interval - $need_interval;

    $axelerate = 0;
    $difficulty_history = dataHistory([mining, $domain, difficulty], 0, 20);
    for ($i = 1; $i < sizeof($difficulty_history); $i++) {
        if ($difficulty_history[$i] > $difficulty_history[$i - 1])
            $axelerate += 1;
        if ($difficulty_history[$i] < $difficulty_history[$i - 1])
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
    $difficulty += $difficulty_diff;
    if ($difficulty < 1) {
        $difficulty = 1;
    }
    dataSet([mining, $domain, difficulty], $difficulty);
    dataSet([mining, $domain, last_hash], $new_hash);

    broadcast(mining, [
        domain => $domain,
        difficulty => $difficulty,
        last_hash => $last_hash,
        reward => $reward,
        address => $gas_address,
    ]);
} else {
    error("Invalid nonce", $response);
}

$response[minted] = $reward;

commit($response);