
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.use(express.urlencoded())
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views"); 

//by default, you are redirected to a index.html file
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

//processes data and then calls function to get server response times
app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   getServerTime(req.body.urlOfWebsite,req.body.limit,req.body.maxRate)
   response = {
      urlOfWebsite:req.body.urlOfWebsite,
      limit:req.body.limit,
      maxRate:req.body.maxRate
   };
   console.log(response);
   // console.log("Go to localhost:####/histogram to view results");
   res.end(JSON.stringify("Go to localhost:####/histogram to view results"));
   // res.end(JSON.stringify(response));
})


var request = require('request');

//insertion sort
const insertionSort = (array) => {
    const length = array.length;
  
    for (let i = 1; i < length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
        }
        array[j+1] = key;
    }
    return array;
};


//This function takes as input the url of a website and returns server response time array  
var timeArr = [];
function getServerTime(url, limit, maxRate) {
	//default values
	if(maxRate == 0){
		maxRate = 4;
	}
	//default values
	if(limit == 0){
		limit = 50;
	}

	for (i = 0; i < parseInt(limit); i++) { 
		setTimeout(function delayFunc() {
		request.get({ url: "https://" + url, time: true }, function (err, response) {
		    console.log('The actual time elapsed:', response.elapsedTime);
		    timeArr.push(response.elapsedTime);
		    if(timeArr.length == limit){
		    	console.log("Unsorted Array: " + timeArr);
		    }
		}); }, (Math.floor(1000/maxRate)))
	}

	setTimeout(function delayFunc() {
		timeArr = insertionSort(timeArr);
		console.log("Sorted Array: " + timeArr);
	}, ((Math.floor(limit/maxRate)*1000)+1000))
}

app.post('/submit_form', (req, res) => {
   res.send(timeArr);
});

app.get('/histogram', function (req, res) {
    res.sendFile( __dirname + "/" + "hist.htm");
});

//main server
var server = app.listen(1098, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
