importScripts('/crypto-js/crypto-js.js');
addEventListener('message', function (e) {
    const domain = e.data.domain;
    const last_hash = e.data.last_hash;
    const difficulty = e.data.difficulty;
    let startTime = new Date().getTime();
    for (let i = 0; i >= 0; i++) {
        let nonce = Math.floor(Math.random() * 100000000)
        //if (last_hash != currentLastHash || $scope.inProgress == false) return;
        let hash = CryptoJS.MD5(last_hash + domain + nonce).toString()
        let hashNumber = new Number("0x" + hash);
        if (hashNumber % difficulty == 0) {
            postMessage({
                nonce: nonce,
                last_hash: last_hash,
                str: last_hash + domain + nonce,
                hash: CryptoJS.MD5(last_hash + domain + nonce).toString(),
                speed: i / (new Date().getTime() - startTime),
            });
            break;
        }
    }
});