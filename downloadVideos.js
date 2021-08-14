var request = require("request");
var fs = require("fs");
const cheerio = require('cheerio');

downloadVideosFromUrlBulk("./output/videos.json", function () {
    console.log("All downloads finised");
});








function downloadVideosFromUrlBulk(file, callback) {
    fs.readFile(file, 'utf8', function (error, items) {
        items = JSON.parse(items);
        var item = 0;
        downloadVideo(items[item], processRequest);
        function processRequest(url) {
            item = item + 1;
            if (item in items) {
                downloadVideo(items[item], processRequest);
            } else {
                callback();
            }
        }
    });
}



function isValidUrl(s) {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
}


function downloadVideo(video, callback) {
    var fileName = "";
    var mp4VideoUrl = "";
    var iframeUrl = video.iframe_url;
    for(var u of video.urls){
        if(u.extension == "mp4"){
            mp4VideoUrl = u.video;
        }
    }
    if(isValidUrl(iframeUrl) && isValidUrl(iframeUrl)){
        var parsed = new URL(iframeUrl);
        fileName = parsed.searchParams.get("title") + ".mp4";
    }else{
        callback();
        return false;
    }

    if(mp4VideoUrl == "" || mp4VideoUrl === null){
        callback();
        return false;
    }

    // Variable to save downloading progress
    var received_bytes = 0;
    var total_bytes = 0;

    var outStream = fs.createWriteStream("downloads/" + fileName);

    request
        .get(mp4VideoUrl)
        .on('error', function (err) {
            console.log(err);
        })
        .on('response', function (data) {
            total_bytes = parseInt(data.headers['content-length']);
        })
        .on('data', function (chunk) {
            received_bytes += chunk.length;
            showDownloadingProgress(received_bytes, total_bytes);
        })
        .on('end', function () {
            console.log("Video Downloaded", "\n");
            callback();
        })
        .pipe(outStream);
};

function showDownloadingProgress(received, total) {
    var percentage = ((received * 100) / total).toFixed(2);
    process.stdout.write("\033[0G");
    process.stdout.write(percentage + "% | " + formatBytes(received) + "  downloaded out of " + formatBytes(total) + ".");
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
