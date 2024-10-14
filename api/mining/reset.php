<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/wallet/api/utils.php";

$domain = getDomain();

dataSet([$domain, mining, difficulty], 1);

$response[success] = true;

commit($response);