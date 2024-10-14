<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/wallet/api/utils.php";

$domain = getDomain();

dataWalletRegScript($domain,  "mining", "$domain/api/mining/mint.php");

$response[success] = true;

commit($response);