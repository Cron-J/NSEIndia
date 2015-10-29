var 
express = require('express')
, moment = require('moment')
, format = require('string-format')
, fs = require('fs')
, request = require('request')
, Zip = require('adm-zip')
, pg = require('pg')
, copyFrom = require('pg-copy-streams').from
, app = express();

app.get('/', function (req, res) {
  res.send('Importing NSE India Data...');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
format.extend(String.prototype);

//eg.: DERIVATIVES/2015/OCT/fo07OCT2015bhav.csv.zip
var bhavFileBaseURL = 'http://www.nseindia.com/content/historical/DERIVATIVES/{0}/{1}/fo{2}{1}{0}bhav.csv.zip';
var bhavFileName = 'fo{2}{1}{0}bhav.csv';
var bhavFilesZipDir = "./tmp/bhavFilesZip/";
var bhavFilesCsvDir = "./tmp/bhavFilesCsv/";
var bhavFileRequestHeader = { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}
// var conString = "postgres://username:password@localhost/database";
var conString = "postgres://postgres:cronj123@localhost/stk";

function copyToDB(fileName){
	pg.connect(conString, function(err, client, done) {
	  var stream = client.query(copyFrom('COPY bhav FROM STDIN CSV HEADER'));
	  var fileStream = fs.createReadStream(bhavFilesCsvDir + fileName);
	  fileStream.pipe(stream).on('finish', function(){
		console.log("Data Imported to PG: ", fileName);	
	  });
	});
}
function extractFile(fileName, success){
	var zip = new Zip(bhavFilesZipDir + fileName + ".zip");
	zip.extractAllTo(bhavFilesCsvDir); 
	console.log("CSV Extracted: ", fileName);
	// success(fileName);
}
function importBhavFile(year, month, day){
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
}
function importBhavFilesBetween(startDate, endDate){
	for(var date = startDate; date.isBefore(endDate); date.add(1,'days'))
		importBhavFile(date.format('YYYY'),date.format('MMM').toUpperCase(),date.format('DD'));
}
importBhavFilesBetween(moment('2015-09-30'), moment('2015-10-29'));
// importBhavFilesBetween(moment('2015-04-30'), moment('2015-10-29'));
