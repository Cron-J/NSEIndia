var express = require('express')
	bodyParser = require('body-parser')
, moment = require('moment')
, format = require('string-format')
, fs = require('fs')
, request = require('request')
, Zip = require('adm-zip')
, pg = require('pg')
, copyFrom = require('pg-copy-streams').from
, app = express()
, _ = require("underscore");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
format.extend(String.prototype);
//eg.: DERIVATIVES/2015/OCT/fo07OCT2015bhav.csv.zip
var bhavFileBaseURL = 'http://www.nseindia.com/content/historical/DERIVATIVES/{0}/{1}/fo{2}{1}{0}bhav.csv.zip';
var bhavFileName = 'fo{2}{1}{0}bhav.csv';
var bhavFilesZipDir = "./tmp/bhavFilesZip/";
var bhavFilesCsvDir = "./tmp/bhavFilesCsv/";
var bhavFileRequestHeader = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11","Referer":"http://www.nseindia.com/products/content/all_daily_reports.htm","Accept-Encoding":"gzip,deflate,sdch","encoding":"null","Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Cookie":"cookie"};
// var conString = "postgres://username:password@localhost/database";
var conString = "postgres://postgres:cronj123@localhost/skt";

function copyToDB(fileName){
	pg.connect(conString, function(err, client, done) {
		var stream = client.query(copyFrom('COPY bhav FROM STDIN CSV HEADER'));
		var fileStream = fs.createReadStream(bhavFilesCsvDir + fileName);
		fileStream.pipe(stream).on('finish', function(){
			console.log("Data Imported to PG: ", fileName);
			done();
		});
	});
}
function extractFile(fileName, success){
	var zip = new Zip(bhavFilesZipDir + fileName + ".zip");
	zip.extractAllTo(bhavFilesCsvDir);
	console.log("CSV Extracted: ", fileName);
	success(fileName);
}
var ctr = 0;
function importBhavFile(year, month, day){
	ctr += 1000;
	setTimeout(function(){
		var fileName = bhavFileName.format(year, month, day);
		var fileURL = bhavFileBaseURL.format(year, month, day);

		var r = request({ url: fileURL, headers: bhavFileRequestHeader });
		r.on('response', function (resp) {
			if(resp.statusCode == 200){
				r.pipe(fs.createWriteStream(bhavFilesZipDir + fileName + ".zip"))
					.on('close', function(){
						console.log("ZIP Downloaded: ", fileName);
						extractFile(fileName, copyToDB);
					});
			}
		});
	},ctr);
}
function importBhavFilesBetween(startDate, endDate){
	for(var date = startDate; date.isBefore(endDate); date.add(1,'days'))
		importBhavFile(date.format('YYYY'),date.format('MMM').toUpperCase(),date.format('DD'));
}


app.get('/import', function (req, res) {
	// importBhavFilesBetween(moment('2015-09-30'), moment('2015-10-29'));
	importBhavFilesBetween(moment('2014-10-30'), moment('2015-10-29'));
  res.send('Importing NSE India Data...');
});
app.get('/getSymbols',function(req,res){
	//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		console.log('fetching symbols');
		client.query('SELECT DISTINCT symbol from bhav order by symbol',function(err, result) {
			//call `done()` to release the client back to the pool
			done();
			res.send(result.rows);
			if(err) {
				return console.error('error running query', err);
			}
			//output: 1
		});
	});
});
app.post('/getDataOfSymbol',function(req,res){
	//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		client.query("SELECT instrument, option_typ, strike_pr, close, timestamp, expiry_dt from bhav where symbol = $1 and timestamp between $2  and $3 order by timestamp", [req.body.symbol, req.body.from, req.body.to],function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			var resultdata = result.rows;

			// res.send(resultdata);

			// var t0 = performance.now();

            var datedData = _.groupBy(resultdata, 'timestamp');
            var straddleData = _.map(datedData, function(values, date) {
                //find the first future entry
                var futidxes = _.filter(values, function(value) {
                    return value.instrument == "FUTIDX" || value.instrument == "FUTSTK";
                });
                var futidx = _.reduce(futidxes, function(memo, value){
                	return (new Date(value.expiry_dt) < new Date(memo.expiry_dt) ? value : memo);
                })
                //close price
                var close = futidx.close;
                //find closest call entry
                //todo: initial memo is first element, error when no strike point found
                var call = _.reduce(values, function(memo, value) {
                    if (value.option_typ == "CE")
                        return (Math.abs(value.strike_pr - close) < Math.abs(memo.strike_pr - close) ? value : memo);
                    return memo;
                });
                //find closest put entry
                var put = _.reduce(values, function(memo, value) {
                    if (value.option_typ == "PE")
                        return (Math.abs(value.strike_pr - close) < Math.abs(memo.strike_pr - close) ? value : memo);
                    return memo;
                });
                return {
                    futidx: futidx,
                    call: call,
                    put: put,
                    date: date,
                    straddle: call.close + put.close
                };
            });
            // console.log(straddleData);

            //performance
            // var t1 = performance.now();
            // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
            res.send(straddleData);





			if(err) {
				return console.error('error running query', err);
			}
			//output: 1
		});
	});
});


app.use('/client', express.static(__dirname + '/client'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
