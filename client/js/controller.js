var app = angular.module('nseApp', ['nvd3']);
app.controller('nseCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
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
                x: function(d){ return new Date(d.timestamp); },
                y: function(d){ return d.close; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Bhav Copy Date (2015)',
                    tickFormat: function(d) {
                        return d3.time.format('%d-%m-%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: 'Close Price (INR)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    // axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Close Price Bhav Copy'
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
                });
        }

        getSymbol();

        $scope.getSymbolData = function(symbolObj) {

            var symbolVal = symbolObj.symbol;
            console.log(symbolVal);
            $http.post('/getDataOfSymbol', {
                    symbol: symbolVal,
                    from: "2015-09-28",
                    to: "2015-10-29"
                })
                .success(function(data, status) {
                    var oldData = $scope.data.slice();
                    oldData.push({
                            values: data,
                            key: symbolVal
                        });
                    $scope.data = oldData;
                })
                .error(function(data, status) {
                    // growl.addErrorMessage(data.message);
                });

        }
        // $scope.salesData = [{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17185.8","timestamp":"2015-09-27T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17385.2","timestamp":"2015-09-27T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17286.75","timestamp":"2015-09-27T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17564","timestamp":"2015-09-28T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17481.55","timestamp":"2015-09-28T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17387.85","timestamp":"2015-09-28T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17319.35","timestamp":"2015-09-29T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17510.25","timestamp":"2015-09-29T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17417.6","timestamp":"2015-09-29T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17421.1","timestamp":"2015-09-30T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17238.15","timestamp":"2015-09-30T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17335.15","timestamp":"2015-09-30T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17722.2","timestamp":"2015-10-04T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17815.25","timestamp":"2015-10-04T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17910.1","timestamp":"2015-10-04T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17672.75","timestamp":"2015-10-05T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17773.9","timestamp":"2015-10-05T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17869.1","timestamp":"2015-10-05T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17880.35","timestamp":"2015-10-06T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17689.05","timestamp":"2015-10-06T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17779.75","timestamp":"2015-10-06T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17550.6","timestamp":"2015-10-07T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17648.3","timestamp":"2015-10-07T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17741.3","timestamp":"2015-10-07T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17644.9","timestamp":"2015-10-08T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17738.2","timestamp":"2015-10-08T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17829.6","timestamp":"2015-10-08T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17721.9","timestamp":"2015-10-11T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17622.85","timestamp":"2015-10-11T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17819.6","timestamp":"2015-10-11T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17703.2","timestamp":"2015-10-12T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17601.65","timestamp":"2015-10-12T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17797.05","timestamp":"2015-10-12T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17788.2","timestamp":"2015-10-13T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17679.45","timestamp":"2015-10-13T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17583.05","timestamp":"2015-10-13T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17832.65","timestamp":"2015-10-14T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17731.6","timestamp":"2015-10-14T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17930.4","timestamp":"2015-10-14T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18176.95","timestamp":"2015-10-15T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18076.2","timestamp":"2015-10-15T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17983.35","timestamp":"2015-10-15T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17881.4","timestamp":"2015-10-18T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17977.5","timestamp":"2015-10-18T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18078.2","timestamp":"2015-10-18T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17833.6","timestamp":"2015-10-19T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17934.6","timestamp":"2015-10-19T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18034.55","timestamp":"2015-10-19T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17719.6","timestamp":"2015-10-20T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17818.75","timestamp":"2015-10-20T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17913.05","timestamp":"2015-10-20T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18127.75","timestamp":"2015-10-22T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17935.5","timestamp":"2015-10-22T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18023.65","timestamp":"2015-10-22T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17909.05","timestamp":"2015-10-25T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17818.75","timestamp":"2015-10-25T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18009.6","timestamp":"2015-10-25T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"18029.55","timestamp":"2015-10-26T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17928.15","timestamp":"2015-10-26T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17839.95","timestamp":"2015-10-26T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17415","timestamp":"2015-10-27T18:30:00.000Z","expiry_dt":"2015-10-28T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17605.55","timestamp":"2015-10-27T18:30:00.000Z","expiry_dt":"2015-12-30T18:30:00.000Z"},{"instrument":"FUTIDX","option_typ":"XX","strike_pr":"0","close":"17500.6","timestamp":"2015-10-27T18:30:00.000Z","expiry_dt":"2015-11-25T18:30:00.000Z"}];
    }
]);
