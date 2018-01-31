const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const fs = require('fs')
const hummus = require('hummus');

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static',express.static('static'))


app.get('/',function(req,res){
	res.redirect(301, '/submit-form');
})

app.get('/submit-form', function(req, res) {
	fs.readFile('ticket.html', 'utf-8', function(error, source){
		res.send(source)
	})
})


app.use(fileUpload());
 
app.post('/submit-form', function(req, res) {

    	writepdf(req,res)

});

function writepdf(req,res) {
	 	// set header

	    res.writeHead(200, {'Content-Type': 'application/pdf'});
 	
 		/*
			Reads the form into memory for processing.

			note: io operations in hummus are **synchronous**
			
		*/
 		var sourceStream = new hummus.PDFRStreamForFile(__dirname + '/forms/initial-rev.pdf');
	    
	    /*
			sets response as the output file stream

	    */
        var pdfWriter = hummus.createWriterToModify(sourceStream, 
        	new hummus.PDFStreamForResponse(res));

        /*
			sets up context for page. Contexts are page level objects.
			
        */
  		var pageModifier = new hummus.PDFPageModifier(pdfWriter,0,true);

  		/*

			writes req.body.name at coordinates 10pt from left, 550pt from bottom

			NOTE: you must specify a ttf font file for context.writeText

  		*/

		pageModifier.startContext().getContext().writeText(
			req.body.name,
			10, 550,
						{ 
					   font:pdfWriter.getFontForFile(__dirname+'/fonts/Helvetica-Regular.ttf'),
                        size:50,
                        colorspace:'gray',
                        color:0x00
                      });


		/*
			finish page
		*/
 		pageModifier.endContext().writePage();

 		/*

			process "evidence" upload if exists. 
			requires express-fileupload as multipart parser
	
 		*/
		
		if(req.files.evidence) {

			append_image_jpg(pdfWriter, req.files.evidence, function(){
				pdfWriter.end();
				res.end()
			})
		} else {
	        
	        pdfWriter.end();
	        res.end();
        }
        
        
}
function append_image_jpg(pdfWriter, file,cb) {
	/*
		places uploaded image into a temporary directory
		file.mv by default is asynchronous, so callback pattern is needed
	*/
	file.mv(__dirname + "/temp/" + file.name,function(err) {


        /*
			creates a new letter sized page.
        */
        var newpage = pdfWriter.createPage(0,0,612,792);

        var contentContext = pdfWriter.startPageContentContext(newpage)

        /*
			places image at 300pt left, 300pt above bottom
        */

	contentContext.drawImage(300,300,__dirname+"/temp/"+file.name)

        pdfWriter.writePage(newpage);

        cb()

	});
}
app.listen(3000, () => console.log('Example app listening on port 3000!'))
