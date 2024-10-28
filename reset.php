<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-data/utils.php";

$domain = getDomain();

dataSet([mining, $domain, difficulty], 1);

$response[success] = true;

commit($response);