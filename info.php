<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-mining/utils.php";

$domain = get_required(domain);
$address = get_required(address);
$gas_domain = get_required(gas_domain);

$response[last_hash] = dataGet([mining, $domain, last_hash]) ?: "";
$response[difficulty] = dataGet([mining, $domain, difficulty]) ?: 1;

$response[balance] = tokenBalance($domain, mining);
$response[last_reward] = tokenLastTran($domain, mining)[amount];
$response[round_seconds] = get_int_required(round_seconds);
$response[gas_balance] = tokenBalance($gas_domain, $address);

commit($response);