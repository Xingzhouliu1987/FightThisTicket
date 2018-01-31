const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const fs = require('fs')
const hummus = require('hummus');
// let Duplex = require('stream').Duplex;  
// function bufferToStream(buffer) {  
//   let stream = new Duplex();
//   stream.push(buffer);
//   stream.push(null);
//   return stream;
// }

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static',express.static('static'))

// parse application/json

app.get('/',function(req,res){
	res.redirect(301, '/submit-form');
})

app.get('/submit-form', function(req, res) {
	fs.readFile('ticket.html', 'utf-8', function(error, source){
		res.send(source)
	})
})
// default options
app.use(fileUpload());
 
app.post('/submit-form', function(req, res) {
// console.log(bufferToStream(req.files.evidence.data).read)

    if(req.files.evidence) {
		req.files.evidence.mv(__dirname + req.files.evidence.name,function(err) {
			writepdf(req,res)
		})
    } else {
    	writepdf(req,res)
    }

 //  if (!req.files)
 //    return res.status(400).send('No files were uploaded.');
 
 //  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
 //  let sampleFile = req.files.evidence;
 // console.log('got file!' + req.body.name)
 // console.log(req.files.evidence)
 //  // Use the mv() method to place the file somewhere on your server
 //  sampleFile.mv('test.jpg', function(err) {
 //    if (err)
 //      return res.status(500).send(err);
 //    writepdf(req,res)
 //    //res.send('File uploaded For :'  + req.body.name );
 //  });
});

function writepdf(req,res) {
	    res.writeHead(200, {'Content-Type': 'application/pdf'});
 
 		var sourceStream = new hummus.PDFRStreamForFile(__dirname + '/forms/initial-rev.pdf');
     
        var pdfWriter = hummus.createWriterToModify(sourceStream, new hummus.PDFStreamForResponse(res));

  //     var pdfWriter = hummus.createWriter();
  		var pageModifier = new hummus.PDFPageModifier(pdfWriter,0,true);
		pageModifier.startContext().getContext().writeText(
			req.body.name,
			10, 550,
						{ 
					   font:pdfWriter.getFontForFile(__dirname+'/fonts/Helvetica-Regular.ttf'),
                        size:50,
                        colorspace:'gray',
                        color:0x00
                      });



 		pageModifier.endContext().writePage();
     if(req.files.evidence) {
          var newpage = pdfWriter.createPage(0,0,595,842);
        // pdfWriter.startPageContentContext(newpage).writeText('Hello ' + req.body.name,
        //                                                   0,400,
        //                                                   {
								// 							font:pdfWriter.getFontForFile(__dirname+'/fonts/Helvetica-Regular.ttf'),
        //                                                     size:50,
        //                                                     colorspace:'gray',
        //                                                     color:0x00
        //                                                   });

        //var tmp_path = req.files.evidence.path;
       // console.log(tmp_path)
        console.log(req.files.evidence)
        var contentContext = pdfWriter.startPageContentContext(newpage)
        // pause  page content placement so i can now put image data into the file
        // pdfWriter.pausePageContentContext(contentContext);

	contentContext.drawImage(300,300,__dirname + req.files.evidence.name)

        // var imageXObject = pdfWriter.createImageXObjectFromJPG(bufferToStream(req.files.evidence.data));
        
        // contentContext.q()
        //                 .cm(500,0,0,400,0,0)
        //                 .doXObject(imageXObject)
        //                 .Q();

        pdfWriter.writePage(newpage);
     }
	pdfWriter.end();

        // pdfWriter.writePage(page);
        // pdfWriter.end();

        res.end();
        
        
}
app.listen(3000, () => console.log('Example app listening on port 3000!'))
