const express = require('express')
const app = express()
//const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const fs = require('fs')
const multer  = require('multer')
const writepdf = require("./write-pdf")


const TEMPORARY_DIRECTORY = __dirname + '/temp'
const MAXFILEUPLOADS = 5


app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static',express.static('static'))



/* sets up temporary storage for files */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMPORARY_DIRECTORY)
  },
  filename: function (req, file, cb) {
  	var randomname = Math.floor(Math.random() * 1e7).toString()
    cb(null,randomname)
  }
})
var upload = multer({ storage: storage })


// app.get('/',function(req,res){
// 	res.redirect(301, '/submit-form');
// })

app.get('/', function(req, res) {
	fs.readFile('ticket.html', 'utf-8', function(error, source){
		res.send(source)
	})
})

//app.use(fileUpload());
 
app.post('/submit-form', upload.array('evidence',MAXFILEUPLOADS), writepdf(__dirname + '/forms/initial-rev.pdf', storage ));

app.listen(3000, () => console.log('Example app listening on port 3000!'))
