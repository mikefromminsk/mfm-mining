function main($scope) {

    var domain = $scope.getUriParam("domain")
    $scope.domain = domain

    function init() {
        loadProfile()
        loadTrans()
    }

    function loadProfile() {
        postContract("wallet", "api/profile.php", {
            domain: domain,
            address: wallet.address(),
        }, function (response) {
            $scope.coin = response
            $scope.$apply()
        })
    }

    var currentLastHash = "start"

    function loadTrans() {
        post("/wallet/api/trans_user.php", {
            address: wallet.address(),
            domain: domain,
        }, function (response) {
            $scope.trans = $scope.groupByTimePeriod(response.trans)
            $scope.$apply()
            loadInfo()
        })
    }

    function loadInfo() {
        postContract(domain,  "api/mining/info.php", {}, function (response) {
            $scope.balance = response.balance
            $scope.difficulty = response.difficulty
            $scope.last_reward = response.last_reward
            $scope.$apply()
            if (currentLastHash != response.last_hash && $scope.inProgress) {
                currentLastHash = response.last_hash
                mint(domain, response.last_hash || "", response.difficulty)
            }
        })
    }

    async function mint(domain, last_hash, difficulty) {
        for (let i = 0; i < 10000000000; i++) {
            if (last_hash != currentLastHash || $scope.inProgress == false) return;
            if (md5(last_hash + domain + i).substring(0, difficulty) === "0".repeat(difficulty)) {
                postContractWithGas(domain, "api/mining/mint.php", {
                    address: wallet.address(),
                    nonce: i,
                }, function (data) {
                    init()
                }, function () {

                })
                break;
            }
        }
    }

    $scope.startMining = function () {
        openPin($scope.domain, function (pin) {
            window.tempPin = pin
            $scope.inProgress = true
            init()
        })
    }

    $scope.stopMining = function () {
        $scope.inProgress = false
    }

    $scope.openSettings = function () {
        $scope.inProgress = false
        openSettings(domain, init)
    }

    $scope.openTran = function (tran) {
        openTran(tran.next_hash)
    }

    init()
}