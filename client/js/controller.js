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

        $scope.dataval={
            todate: new Date(),
            fromdate: new Date((new Date()).setMonth((new Date()).getMonth() - 1)),
            symbol: ""
        };

        console.log($scope.dataval.fromdate);

        var getSymbol = function() {
            $http.get('/getSymbols')
                .success(function(data, status) {
                    $scope.items = data;
                    $scope.loading = false;
                });
        }

        getSymbol();    
        console.log($scope.dataval.fromdate);

        $scope.dateChange = function(){
            $scope.data = [];
            $scope.getSymbolData();
        }

        $scope.getSymbolData = function() {
            $scope.loading = true;
            $http.post('/getDataOfSymbol', {
                    symbol: $scope.dataval.symbol.symbol,
                    from: $scope.dataval.fromdate,
                    to: $scope.dataval.todate
                })
                .success(function(data, status) {
                    var oldData = $scope.data.slice();
                    oldData.push({
                        values: data,
                        key: $scope.dataval.symbol.symbol
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
