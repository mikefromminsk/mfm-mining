importScripts('/crypto-js/crypto-js.js');
addEventListener('message', function (e) {
    const domain = e.data.domain;
    const last_hash = e.data.last_hash;
    const difficulty = e.data.difficulty;
    for (let i = 0; i >= 0; i++) {
        let nonce = Math.floor(Math.random() * 100000000)
        //if (last_hash != currentLastHash || $scope.inProgress == false) return;
        if (CryptoJS.MD5(last_hash + domain + nonce).toString()
            .substring(0, difficulty) === "0".repeat(difficulty)) {
            postMessage({
                nonce: nonce,
                last_hash: last_hash,
                str: last_hash + domain + nonce,
                hash: CryptoJS.MD5(last_hash + domain + nonce).toString(),
            });
            break;
        }
    }
});