const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const fs = require('fs')
const hummus = require('hummus');
const custom_stream = require('./form-stream')

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static',express.static('static'))


// app.get('/',function(req,res){
// 	res.redirect(301, '/submit-form');
// })

app.get('/', function(req, res) {
	fs.readFile('ticket.html', 'utf-8', function(error, source){
		res.send(source)
	})
})


app.use(fileUpload());
 
app.post('/submit-form', writepdf(__dirname + '/forms/initial-rev.pdf'));

function writepdf(file) {

	/***********
		
		Reads the form into memory as a constant

	**********/

	const sourceStream = new custom_stream (file);
	
	return function (req,res) {
		 	// set header

	 	

		    
		    /*
				sets response as the output file stream
				
		    */

	        var pdfWriter = hummus.createWriterToModify(
	        						sourceStream, 
	        						new hummus.PDFStreamForResponse(res)
	        						);

	        var font = pdfWriter.getFontForFile(__dirname+'/fonts/Helvetica-Regular.ttf');
	        /*
				do block for every page
				sets page context to a specific page, 0 indexed.
				so modifier for 2nd page from source doc would be :
					var pageModifier = new hummus.PDFPageModifier(pdfWriter,1,true);
	        */
	  		var pageModifier = new hummus.PDFPageModifier(pdfWriter,0,true);

	  		/*

				writes req.body.name at coordinates 10pt from left, 550pt from bottom
				NOTE: you must specify a ttf font file for context.writeText

	  		*/

			var pageContext = pageModifier.startContext()
						.getContext();

			/* do this for every field/line of text */

				pageContext
						.writeText(
				req.body.name,
				10, 550,
							{ 
								/*
									BLOCKING IO
								*/
						   font:font,
	                        size:50, /* in points */
	                        colorspace:'gray',
	                        color:0x00
	                      });


			/*
				finished field/line
			*/



	 		pageModifier.endContext().writePage();
			/*
				finished page
			*/


	 		/*

				process "evidence" upload if exists. 
				requires express-fileupload as multipart parser
		
	 		*/

			if(req.files.evidence) {

				append_image_jpg(pdfWriter, req.files.evidence, function(err, fname){
					if(err)
						throw err

					pdfWriter.end();


					/*
					 	pdf document finished
					*/

					res.end();

					/*
					 	delete uploaded image
					*/
					fs.unlink(fname)
				})
			} else {
		        
		        pdfWriter.end();
				/*
					pdf document finished
				*/


		        res.end();
	        }
	        
	        
	}
}
function append_image_jpg(pdfWriter,file,cb) {
	/*
		places uploaded image into a temporary directory
		file.mv is asynchronous, so callback pattern
	*/
	file.mv(__dirname + "/temp/" + file.name,function(err) {

		if(err)
			throw err;

        /*
			creates a new letter sized page.
        */
        try {
	        var newpage = pdfWriter.createPage(0,0,612,792);

	        var contentContext = pdfWriter.startPageContentContext(newpage)

	        // pdfWriter.pausePageContentContext(contentContext);

	        /*
				places image with bottom left hand corner 50,50
				**** MORE BLOCKING I-O ****
	        */
		    contentContext.drawImage(50,50,__dirname+"/temp/"+file.name,
		    	{transformation:{width:512,height:692, proportional:true}})
		    
	        pdfWriter.writePage(newpage);
	        cb(null,__dirname+"/temp/"+file.name)

	    } catch(err) {
	        cb(err)
	    }

	});
}
app.listen(3000, () => console.log('Example app listening on port 3000!'))
