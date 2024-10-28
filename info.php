<?php
require_once $_SERVER[DOCUMENT_ROOT] . "/mfm-data/utils.php";

$domain = get_required(domain);

$response[last_hash] = dataGet([mining, $domain, last_hash]) ?: "";
$response[difficulty] = dataGet([mining, $domain, difficulty]) ?: 1;

$response[balance] = tokenBalance($domain, mining);
$response[last_reward] = tokenLastTran($domain, mining)[amount];

commit($response);