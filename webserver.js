var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
const { parse } = require('querystring');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gmail id',
    pass: 'gmail pwd'
  }
});
var mySub='mySubject';
var mailOptions;

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
if(req.method==='POST'){
	parseRequestData(req, result => {
		mailOptions = {
		  from: 'sender's gmail id',
		  to: 'receipient1@email.com, receipient2@email.com',
		  subject: 'your subject',
		  text: 'Your Text\n'+'Phone Number: '+result.phone_number+ '\nEmail Id:'+result.emailId
		};
	   transporter.sendMail(mailOptions, function(error, info){
	     if (error) {
	       console.log(error);
	     } else {
	       console.log('Email sent: '+getDateTime()+' '+info.response);
	     }
	   });

        });
	res.writeHead(200, {'Content-Type': 'text/html'}); //display 404 on error
        return res.end("<h2>Thank You for Contacting us. We will get back to you soon.</h2>");
}
else
{
  fs.readFile('/home/pi/Public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 N o t Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

}
function parseRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}