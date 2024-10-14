<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/wallet/api/utils.php";

$domain = getDomain();

$response[balance] = dataWalletBalance($domain, mining);
$response[last_reward] = dataGet([$domain, mining, last_reward]) ?: 0;
$response[last_hash] = dataGet([$domain, mining, last_hash]) ?: "";
$response[difficulty] = dataGet([$domain, mining, difficulty]) ?: 1;

commit($response);