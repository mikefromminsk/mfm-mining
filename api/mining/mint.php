<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/wallet/api/utils.php";

$address = get_required(address);
$nonce = get_required(nonce);

$domain = getDomain();

$last_hash = dataGet([$domain, mining, last_hash]) ?: "";
$difficulty = dataGet([$domain, mining, difficulty]) ?: 1;
$new_hash = md5($last_hash . $domain . $nonce);
if (substr($new_hash, 0, $difficulty) == str_repeat("0", $difficulty)) {
    $reward = dataWalletBalance($domain, "mining") * 0.001;
    $reward = round($reward, 2);
    dataWalletSend($domain, "mining", $address, $reward);
    $timeDist = time() - dataInfo([$domain, mining, last_hash])[data_time];
    if ($timeDist < 3) {
        $new_difficulty = $difficulty + 1;
        if ($new_difficulty > 5)
            $new_difficulty = 5;
    } else if ($timeDist > 60) {
        $new_difficulty = $difficulty - 1;
    }
    if ($new_difficulty != null)
        dataSet([$domain, mining, difficulty], $new_difficulty);
    dataSet([$domain, mining, last_hash], $new_hash);
    dataSet([$domain, mining, last_reward], $reward);
} else {
    error("Invalid nonce");
}

$response[minted] = $reward;

commit($response);