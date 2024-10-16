function openSettings(domain, success) {
    showDialog('/mining/console/settings/index.html', success, function ($scope) {
        addFormats($scope)
        window.$mdToast = $mdToast
        window.$mdBottomSheet = $mdBottomSheet
        window.$mdDialog = $mdDialog

        $scope.domain = domain
        $scope.balances = {}

        function getBalance(domain, address) {
            dataGet(domain + "/wallet/" + address + "/amount", function (amount) {
                $scope.balances[address] = {
                    amount: amount,
                    address: address,
                    domain: domain,
                }
                $scope.$apply()
            })
        }

        $scope.initilize = function () {
            postContractWithGas(domain, "api/mining/init.php", {}, function () {
                showSuccess("Initilized", init)
            })
        }

        $scope.reset = function () {
            postContractWithGas($scope.domain, "api/mining/reset.php", {}, function (response) {
                showSuccessDialog("Success " + response.success)
            })
        }

        function init() {
            getBalance(domain, "mining")
        }

        $scope.send = function (domain, address, amount) {
            openSendDialog(domain, address, amount, init)
        }

        init()
    })
}