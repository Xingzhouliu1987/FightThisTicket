"use strict"

/*
    implements hummus stream for any buffer indexed and sized buffer
*/
const fs = require('fs')

class PDFRBufferStream {

    constructor (inBuffer) {
        //this.path = inPath;
        this.rposition = 0;
        //this.fileSize = fs.statSync(inPath)["size"];
        this.fileSize = inBuffer.length;
        this.contents = inBuffer;
        //this.contents = fs.readFileSync(inPath);
        console.log(this.fileSize + ":" + this.contents.length)        
    }

    read (inAmount)
    {
        var arr = [];
        var bytesRead = (this.fileSize - this.rposition) < inAmount ? (this.fileSize - this.rposition) : inAmount;

        for(var i=this.rposition;i<(this.rposition+bytesRead);++i)
            arr.push(this.contents[i]);
        this.rposition+=bytesRead;
        return arr;

    }
    setPosition(inPosition)
    {
        this.rposition = inPosition; 
    }

    setPositionFromEnd(inPosition)
    {
        this.rposition = this.fileSize-inPosition;
    }

    skip(inAmount)
    {
        this.rposition += inAmount;
    }

    getCurrentPosition()
    {
        return this.rposition;
    }

    close(inCallback)
    {

    	inCallback()
        //fs.close(this.rs,inCallback)
    }
}



module.exports = {
    BufferStream : PDFRBufferStream
}
