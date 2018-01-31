# Demonstrates 
* Write text on PDF
* Place uploaded evidence images onto a new page

# To Do:
[check] Sizing evidence images
[check] Handling PNG and TIFF
* support multiple "evidence" image uploads (swap multer for express-fileupload)
* Layout (hard code x/y position of fields and font sizes)
* Line Breaking (solution: https://github.com/galkahana/HummusJS/issues/163)
* Email
* All IO in hummus (pdf library) is _blocking_, including intensive graphics ops. Fine for demo serving one or two clients at a time, but HTML should get served in different process.