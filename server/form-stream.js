var fs = require('fs');
/*
	forms only read into memory once. implements PDFRStreamForFile
	fork of https://github.com/galkahana/HummusJS/blob/master/PDFRStreamForFile.js#L14
*/

function PDFRStreamRepeatableForFile(inPath)
{

    this.path = inPath;
    this.rposition = 0;
    this.fileSize = fs.statSync(inPath)["size"];

    this.contents = fs.readFileSync(inPath);


} 

PDFRStreamRepeatableForFile.prototype.read = function(inAmount)
{

    var arr = [];
    var bytesRead = (this.fileSize - this.rposition) < inAmount ? (this.fileSize - this.rposition) : inAmount;

    for(var i=this.rposition;i<(this.rposition+bytesRead);++i)
        arr.push(this.contents[i]);
    this.rposition+=bytesRead;
    return arr;

}


PDFRStreamRepeatableForFile.prototype.setPosition = function(inPosition)
{
    this.rposition = inPosition;
}

PDFRStreamRepeatableForFile.prototype.setPositionFromEnd = function(inPosition)
{
    this.rposition = this.fileSize-inPosition;
}

PDFRStreamRepeatableForFile.prototype.skip = function(inAmount)
{
    this.rposition += inAmount;
}

PDFRStreamRepeatableForFile.prototype.getCurrentPosition = function()
{
    return this.rposition;
}

PDFRStreamRepeatableForFile.prototype.close = function(inCallback)
{
	inCallback()
    //fs.close(this.rs,inCallback)
};

module.exports = PDFRStreamRepeatableForFile
