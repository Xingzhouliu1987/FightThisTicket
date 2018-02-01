"use strict"

const fs = require('fs')
const PDFRBufferStream = require("./buffer-stream")
/*
<<<<<<< HEAD
<<<<<<< HEAD
    reads a file all at once into a buffer.
=======
=======
>>>>>>> 669e9dd7b78b10b8c5cb224a77a1b22dba8e99da
	dummy "stream" object that wraps a buffer. Since form doesnt change 
	fork of https://github.com/galkahana/HummusJS/blob/master/PDFRStreamForFile.js#L14
>>>>>>> 669e9dd7b78b10b8c5cb224a77a1b22dba8e99da
*/

class FormStream extends PDFRBufferStream
{
    constructor(inPath) {
        //this.path = inPath
        super(fs.readFileSync(inPath))
    }
} 

module.exports = FormStream