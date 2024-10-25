function openMining(domain, success) {
    var worker;
    if (domain == null) return;
    showDialog('/mfm-mining/console/index.html', function () {
            if (worker)
                worker.terminate()
            if (success)
                success()
        }, function ($scope) {
            $scope.domain = domain

            if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
                showInfoDialog("Your Websocket is not connected. "
                    + "\nYou have less probabilities to mint.", function () {
                })
            }

            function loadMiningInfo(startMiningAfterRequest) {
                postContract("mfm-mining", "info.php", {
                    domain: domain,
                }, function (response) {
                    $scope.balance = response.balance
                    $scope.difficulty = response.difficulty
                    $scope.last_reward = response.last_reward
                    $scope.last_hash = response.last_hash
                    $scope.$apply()
                    if (startMiningAfterRequest)
                        startMiningProcess(response.last_hash, response.difficulty)
                })
            }

            $scope.startMining = function () {
                hasBalance(wallet.gas_domain, function () {
                    getPin(function (pin) {
                        window.tempPin = pin
                        $scope.inProgress = true
                        loadMiningInfo(true)
                    })
                });
            }

            function startMiningProcess(last_hash, difficulty) {
                if (worker != null)
                    worker.terminate()
                worker = new Worker('/mfm-mining/console/worker.js');
                worker.addEventListener('message', function (e) {
                    if ($scope.last_hash == e.data.last_hash){
                        postContractWithGas("mfm-mining", "mint.php", {
                            domain: domain,
                            nonce: e.data.nonce,
                            str: e.data.str,
                            hash: e.data.hash,
                            last_hash: e.data.last_hash,
                        }, function () {
                            loadMiningInfo(true)
                        }, function () {
                            loadMiningInfo(true)
                        })
                    } else {
                        loadMiningInfo(true)
                    }
                });
                worker.postMessage({
                    domain: domain,
                    last_hash: last_hash,
                    difficulty: difficulty,
                });
            }

            $scope.stopMining = function () {
                if (worker != null)
                    worker.terminate()
                $scope.inProgress = false
            }

            $scope.subscribe("mining", function (data) {
                if (data.domain == domain) {
                    $scope.balance = data.balance
                    $scope.difficulty = data.difficulty
                    $scope.last_reward = data.reward
                    $scope.$apply()
                    startMiningProcess(data.last_hash, data.difficulty)
                }
            })

            function loadProfile() {
                postContract("mfm-token", "profile.php", {
                    domain: domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.coin = response
                    $scope.$apply()
                })
            }

            function loadTrans() {
                post("/mfm-token/trans.php", {
                    address: wallet.address(),
                    domain: domain,
                }, function (response) {
                    $scope.trans = $scope.groupByTimePeriod(response.trans)
                    $scope.$apply()
                })
            }

            $scope.openTran = function (tran) {
                openTran(tran.next_hash)
            }

            function init() {
                loadProfile()
                loadTrans()
                loadMiningInfo()
                get("/mfm-mining/readme.md", function (text) {
                    setMarkdown("mfm-mining-readme", text)
                })
            }

            init()
        }
    )

}