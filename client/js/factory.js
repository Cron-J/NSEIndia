app.factory('stockData', function($http) {
  var promise = null;

  return function() {
    if (promise) {
      // If we've already asked for this data once,
      // return the promise that already exists.
      return promise;
    } else {
      promise = $http.post('/getDataOfSymbol', {
                    symbol: symbolVal,
                    from: "2015-09-28",
                    to: "2015-10-29"
                })
                .success(function(data, status) {
                    $scope.salesData = data;
                    console.log($scope.salesData);
                })
                .error(function(data, status) {
                    // growl.addErrorMessage(data.message);
                });
      return salesData;
    }
  };
});