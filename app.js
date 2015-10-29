var 
express = require('express')
, moment = require('moment')
, format = require('string-format')
, fs = require('fs')
, request = require('request')
, Zip = require('adm-zip')
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
var bhavFileName = 'fo{2}{1}{0}bhav.csv.zip';
var bhavFilesZipDir = "./tmp/bhavFilesZip/";
var bhavFilesCsvDir = "./tmp/bhavFilesCsv/";
var bhavFileRequestHeader = { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}
function copyToDB(fileName){
	//file downloaded successfully
}
function extractFile(filePath, success){
	var zip = new Zip(filePath);
	zip.extractAllTo(bhavFilesCsvDir); 
	console.log("CSV Extracted: ", filePath);
	success();
}
var ctr = 0;
function importBhavFile(year, month, day){
	// ctr += 5000;
	// setTimeout(function(){
		
	// }, ctr);
	var fileName = bhavFileName.format(year, month, day);
	var fileURL = bhavFileBaseURL.format(year, month, day);
	
    var r = request({ url: fileURL, headers: bhavFileRequestHeader });
	r.on('response', function (resp) {
	   // resp.headers 
	   if(resp.statusCode == 200){
		   r.pipe(fs.createWriteStream(bhavFilesZipDir + fileName))
			.on('close', function(){
				console.log("ZIP Downloaded: ", fileName);	
				extractFile(bhavFilesZipDir + fileName, copyToDB);
			});
		}
	});
}
function importBhavFilesBetween(startDate, endDate){
	for(var date = startDate; date.isBefore(endDate); date.add(1,'days'))
		importBhavFile(date.format('YYYY'),date.format('MMM').toUpperCase(),date.format('DD'));
}
importBhavFilesBetween(moment('2015-10-02'), moment('2015-10-22'));
