function openMining(domain, success) {
    trackCall(arguments)
    let worker;
    let restartTimer;
    if (domain == null) return;
    showDialog('/mfm-mining/console/index.html', function () {
            if (worker)
                worker.terminate()
            if (restartTimer)
                clearTimeout(restartTimer)
            if (success)
                success()
        }, function ($scope) {
            $scope.domain = domain
            $scope.speed = 0

            if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
                showError(str.web_socket_not_connected)
            }

            function loadMiningInfo(startMiningAfterRequest) {
                postContract("mfm-mining", "info.php", {
                    domain: domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.difficulty = response.difficulty
                    $scope.last_reward = response.last_reward
                    $scope.last_hash = response.last_hash
                    $scope.bank = response.bank
                    $scope.$apply()
                    if ($scope.in_progress && startMiningAfterRequest)
                        startMiningProcess(response.last_hash, response.difficulty)
                })
                loadTrans()
                loadAccounts()
            }

            $scope.startMining = function () {
                getPin(function (pin) {
                    storage.setString(storageKeys.mining_auto_start, "1")
                    restartTimer = setTimeout(function () {
                        window.location.reload()
                    }, 1000 * 60 * 10)
                    window.pinForSesstion = pin
                    $scope.in_progress = true
                    wallet.calcPass(domain, pin, function (pass) {
                        postContract("mfm-token", "account.php", {
                            domain: wallet.gas_domain,
                            address: wallet.address(),
                        }, function (response) {
                            if (response.balance > 0) {
                                loadMiningInfo(true)
                            } else {
                                openAskCredit(wallet.gas_domain, init)
                            }
                        })
                    })
                })
            }

            function startMiningProcess(last_hash, difficulty) {
                if (worker != null)
                    worker.terminate()
                worker = new Worker('/mfm-mining/console/worker.js');
                worker.addEventListener('message', function (e) {
                    $scope.speed = e.data.speed
                    if ($scope.last_hash == e.data.last_hash) {
                        postContractWithGas("mfm-mining", "mint.php", {
                            domain: domain,
                            nonce: e.data.nonce,
                            str: e.data.str,
                            hash: e.data.hash,
                            last_hash: e.data.last_hash,
                        }, function () {
                            loadMiningInfo(true)
                        }, function (message) {
                            if (message.indexOf("Invalid nonce") !== -1) {
                                loadMiningInfo(true)
                            } else {
                                showError(message)
                                $scope.stopMining()
                            }
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
                $scope.in_progress = false
                storage.setString(storageKeys.mining_auto_start, "")
                if (restartTimer)
                    clearTimeout(restartTimer)
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
                getProfile(domain, function (response) {
                    $scope.coin = response
                    $scope.$apply()
                })
            }

            function loadAccounts() {
                postContract("mfm-token", "accounts.php", {
                    address: wallet.address(),
                }, function (response) {
                    let accounts = []
                    for (const account of response.accounts)
                        if (account.domain == domain || account.domain == wallet.gas_domain)
                            accounts.push(account)
                    $scope.accounts = accounts
                    $scope.$apply()
                })
            }

            function loadTrans() {
                post("/mfm-token/trans.php", {
                    from_address: "mining",
                    to_address: wallet.address(),
                    domain: domain,
                }, function (response) {
                    $scope.trans = $scope.groupByTimePeriod(response.trans)
                    $scope.$apply()
                })
            }

            function init() {
                loadProfile()
                loadMiningInfo()
                get("/mfm-mining/readme.md", function (text) {
                    setMarkdown("mfm-mining-readme", text)
                })
            }

            init()

            if (storage.getString(storageKeys.mining_auto_start) != "") {
                $scope.startMining()
            }
        }
    )

}