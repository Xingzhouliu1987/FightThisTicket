const fs = require('fs')
const hummus = require('hummus');
const custom_streams = require('./buffer-stream')
const wrap = require('word-wrap');



function writepdf(file) {


	

	/***********
		
		Reads the form into memory as a constant
		
	**********/

	const sourceBuffer = fs.readFileSync(file)

	
	
	return function (req,res) {
		 	// set header

	    	res.writeHead(200, {'Content-Type': 'application/pdf'});

		    
		    /*
				sets response as the output file stream
				
		    */
		  //  res.setHeader('Content-Type','application/pdf')
		  	var sourceStream = new custom_streams.BufferStream (sourceBuffer);

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
				80, 576,{ font:font,
	                        size:12, /* in points */
	                        colorspace:'gray',
	                        color:0x00 });


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
	 		req.files.map(function(fileDef) {
	 			//fs.stat(fileDef.path , function() {
					var newpage = pdfWriter.createPage(0,0,612,792);

					var contentContext = pdfWriter.startPageContentContext(newpage)

						contentContext.drawImage(50,50,fileDef.path,
						    	{transformation:{width:512,height:692, proportional:true}})

						console.log(pdfWriter.getImageDimensions(fileDef.path))
						console.log(fs.statSync(fileDef.path))

						pdfWriter.writePage(newpage)
						
						console.log(fs.statSync(fileDef.path))
						
				//})
			});

			res.on('finish',function() {
				req.files.map(function remove_temp_file(fileDef) {
					fs.unlink(fileDef.path)
				})
			})

			pdfWriter.end();

			res.end();
	        
	}
}
const FILESEP = "\n"
const FIELDS = {
	name : {
		lines : 1,
		width : 70 ,
		left : 80 , 
		top : 576 
	}
}

/* layout dev */


function break_lines(field_name,text) {
	return wrap(req.body.reason, {width: FIELDS.name.width }).split(FILESEP)
}
function write_field(pageContext,field_name, values) {

}
module.exports = writepdf