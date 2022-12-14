const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/videoplayer', (req, res) =>{
    const range = req.headers.range;   //the range value we get from the header
    const videoPath = 'IMG_1451.mp4';
    const videoSize = fs.statSync(videoPath).size;
    const chunkSize = 1* 1e6;

    //create a const start and end to calculate the start and end positions of the video
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);

    //calculate the content length and set it to a variable
    const contentLength = end - start + 1;

    //set the header for playing video
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length": contentLength,
        "Content-Type" : "video/mp4"
    }
    res.writeHead(206, headers);

    //create video stream and pipe it with the response
    const stream = fs.createReadStream(videoPath, {start, end});
    stream.pipe(res);
})

app.listen(4000);