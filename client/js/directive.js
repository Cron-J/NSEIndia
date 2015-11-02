app.directive('linearChart', function($window) {
    return {
        restrict: 'EA',
        template: "<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs) {
            var salesDataToPlot = scope[attrs.chartData];
            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg = elem.find('svg');
            var svg = d3.select(rawSvg[0]);

            // var mindate = new Date(2012,0,1),
            //             maxdate = new Date(2012,0,31);

            //               xScale = d3.time.scale()
            //                    .domain([mindate, maxdate])
            //                    .range([padding + 5, rawSvg.attr("width") - padding]);




            function setChartParameters() {

                var mindate = new Date(2015, 09, 28),
                    maxdate = new Date(2015, 10, 29);

                // var xScale = d3.time.scale()
                //     .domain([mindate, maxdate]) // values between for month of january
                //     .range([padding, rawSvg.attr("width") - padding]);

                 xScale = d3.time.scale()
                   .domain([new Date(salesDataToPlot[0].timestamp), new Date(salesDataToPlot[salesDataToPlot.length-1].timestamp)])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

                // xScale = d3.time.scale()
                //     .domain([(new Date(2015, 09, 28)), (new Date(2015, 10, 29))]).nice(d3.time.day)
                //     .range([padding + 5, rawSvg.attr("width") - padding]);


                yScale = d3.scale.linear()
                    .domain([0, d3.max(salesDataToPlot, function(d) {
                        return d.close;
                    })])
                    .range([rawSvg.attr("height") - padding, 0]);

                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .ticks(d3.time.days, 1)
                    .tickFormat(d3.time.format(' %d'))
                    .tickSize(1)
                    .tickPadding(10);

            //         svg.append("g")
            // .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
            // .attr("transform", "translate(0," + (rawSvg.attr("height") - padding) + ")")
            // .call(xAxisGen);





                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(1)
                    .ticks(5);

                lineFun = d3.svg.line()
                    .x(function(d) {
                        return xScale(new Date(d.timestamp));
                        // return xScale(new Date(2015, 10, 20));
                    })
                    .y(function(d) {
                        return yScale(parseInt(d.close));
                    })
                    .interpolate("basis");
            }

            function drawLineChart() {

                setChartParameters();

                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0,180)")
                    .call(xAxisGen);

                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(20,0)")
                    .call(yAxisGen);

                svg.append("svg:path")
                    .attr({
                        d: lineFun(salesDataToPlot),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    });
            }

            drawLineChart();
        }
    };
});
