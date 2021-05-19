var request = require("request");
var fs = require("fs");

getInstallerFile("https://www.w3schools.com/html/mov_bbb.mp4");



function getInstallerFile (installerfileURL) {

    // Variable to save downloading progress
    var received_bytes = 0;
    var total_bytes = 0;

    var outStream = fs.createWriteStream("videos/video.mp4");

    request
        .get(installerfileURL)
            .on('error', function(err) {
                console.log(err);
            })
            .on('response', function(data) {
                total_bytes = parseInt(data.headers['content-length']);
            })
            .on('data', function(chunk) {
                received_bytes += chunk.length;
                showDownloadingProgress(received_bytes, total_bytes);
            }).on('end',function(){
                console.log("download finished");
            })
            .pipe(outStream);
};

function showDownloadingProgress(received, total) {
    var percentage = ((received * 100) / total).toFixed(2);
    process.stdout.write("\033[0G");
    process.stdout.write(percentage + "% | " + received + " bytes downloaded out of " + total + " bytes.");
}