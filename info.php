<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-mining/utils.php";

$domain = get_required(domain);
$address = get_required(address);
$gas_domain = get_required(gas_domain);

$response[last_hash] = dataGet([mining, $domain, last_hash]) ?: "";
$response[difficulty] = dataGet([mining, $domain, difficulty]) ?: 1;
$response[bank] = tokenBalance($domain, mining);
$response[last_reward] = getReward($domain);

commit($response);