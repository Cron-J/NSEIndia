var app = angular.module('nseApp', ['nvd3']);
app.controller('nseCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
        $scope.loading = true;
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 350,
                width: 500,
                // margin : {
                //     top: 20,
                //     right: 20,
                //     bottom: 40,
                //     left: 55
                // },
                x: function(d) {
                    return new Date(d.date);
                },
                y: function(d) {
                    return d.straddle;
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e) {
                        console.log("stateChange");
                    },
                    changeState: function(e) {
                        console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Date (2015)',
                    tickFormat: function(d) {
                        return d3.time.format('%b %d')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: 'ATM Straddle (INR)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    // axisLabelDistance: 30
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'ATM Straddle'
            },
            subtitle: {
                enable: true,
                text: '',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> ATM Straddle',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = [];

        var getSymbol = function() {
            $http.get('/getSymbols')
                .success(function(data, status) {
                    $scope.items = data;
                    $scope.loading = false;
                });
        }

        getSymbol();

        $scope.todate = new Date();
        
        $scope.fromdate = new Date(new Date($scope.todate.setMonth($scope.todate.getMonth() - 1)).setDate($scope.todate.getDate() - 1));
        
        console.log($scope.todate);
        console.log($scope.fromdate);

        $scope.getSymbolData = function(symbolVal,fromDate,toDate) {
            $scope.loading = true;
            $http.post('/getDataOfSymbol', {
                    symbol: symbolVal,
                    from: fromDate,
                    to: toDate
                })
                .success(function(data, status) {
                    var oldData = $scope.data.slice();
                    oldData.push({
                        values: data,
                        key: symbolVal
                    });
                    $scope.data = oldData;
                    $scope.loading = false;
                })
                .error(function(data, status) {
                    $scope.loading = false;
                    // growl.addErrorMessage(data.message);
                });

        }
    }
]);
