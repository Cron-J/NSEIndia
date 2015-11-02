var 
express = require('express')
	bodyParser = require('body-parser')
, moment = require('moment')
, format = require('string-format')
, fs = require('fs')
, request = require('request')
, Zip = require('adm-zip')
, pg = require('pg')
, copyFrom = require('pg-copy-streams').from
, app = express();
app.use(bodyParser.urlencoded({ extended: true }));
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
	importBhavFilesBetween(moment('2015-04-29'), moment('2015-10-29'));
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
		client.query('SELECT DISTINCT symbol from bhav',function(err, result) {
			//call `done()` to release the client back to the pool
			done();
			res.send(result);
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
		client.query('SELECT * from bhav where symbol = $1',[req.body.symbol],function(err, result) {
			//call `done()` to release the client back to the pool
			done();
			res.send(result);
			if(err) {
				return console.error('error running query', err);
			}
			//output: 1
		});
	});
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
