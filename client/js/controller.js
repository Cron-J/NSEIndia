var app = angular.module('nseApp', []);
app.controller('nseCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {

        var getSymbol = function() {
            $http.get('/getSymbols')
                .success(function(data, status) {
                    $scope.items = data;
                });
        }

        getSymbol();

        $scope.getSymbolData = function(symbolObj) {

            var symbolVal = symbolObj.symbol;
            console.log(symbolVal);
            $http.post('/getDataOfSymbol', { symbol: symbolVal, from: "2015-09-28", to: "2015-10-29" })
                .success(function(data, status) {
                    console.log(data);
                })
                .error(function(data, status) {
                    // growl.addErrorMessage(data.message);
                });

        }

    }
]);
