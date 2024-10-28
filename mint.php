<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-data/utils.php";

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
    $token_balance = tokenBalance($domain, mining);
    $reward = round($token_balance * 0.001, 2);
    tokenSend($domain, mining, $gas_address, $reward);
    $timeDist = time() - dataInfo([mining, $domain, last_hash])[data_time];
    if ($timeDist < 10) {
        $new_difficulty = $difficulty + 1000000;
    } else {
        $new_difficulty = $difficulty - 1000000;
    }
    if ($new_difficulty != null)
        dataSet([mining, $domain, difficulty], $new_difficulty);
    dataSet([mining, $domain, last_hash], $new_hash);

    broadcast(mining, [
        domain => $domain,
        difficulty => $new_difficulty ?: $difficulty,
        last_hash => $last_hash,
        reward => $reward,
        address => $gas_address,
        balance => $token_balance - $reward
    ]);
} else {
    error("Invalid nonce", $response);
}

$response[minted] = $reward;

commit($response);