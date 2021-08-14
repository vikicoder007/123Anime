var request = require("request");
var fs = require("fs");
var anime_id = "one-piece-dub";
const cheerio = require('cheerio');


// getEpisodeList(anime_id, function (html) {

//     fs.writeFile('episodes.html',html, function (err) {
//         if (err) return console.log(err);
//         console.log('Hello World > helloworld.txt');
//       });

// });

// extractLinks();

// getVideoIframeUrl("one-piece-dub/045");

// getVideoUrlFromIframeUrl("https://gogo-play.net/load.php?id=ODg0Mjk=");

// fetchIframeUrlsBulk('episodes.json',function(urls){
//     console.log("job finised");
//     console.log("total Urls : "+urls.length);
// });



// fetchVideoUrlsFromIframeUrlsBulk('iframes.json',function(urls){
//     console.log("job finised");
//     console.log("total Urls : "+urls.length);
// });


// downloadVideosFromUrlBulk("videos.json", function () {
//     console.log("All downloads finised");
// });

// getStreamServerList("OTAwODM","One%20Piece%20(Dub)%20Episode%20368",function(items){
//     console.log(items);
// });


getVideoURlsFromStreamani("https://streamani.net/embedplus?id=OTAwODM=&token=6haxdGb2Bzv4FT7nXtZcbA&expires=1628973527",function(video_urls){
    console.log(video_urls);
});


function getEpisodeList(id, callback) {
    request.get("https://123animes.mobi/ajax/film/servers?id=" + id, function (error, response, body) {
        body = JSON.parse(body);
        callback(body.html);
    });
}

function extractLinks() {
    fs.readFile('episodes.html', 'utf8', (err, data) => {
        const $ = cheerio.load(data);
        var items = [];
        $("li").each(function () {
            items.push($(this).find("a").attr("data-id"));
        });

        items = [...new Set(items)];


        fs.writeFile('episodes.json', JSON.stringify(items), function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });
    });
}

function getVideoIframeUrl(episode_id, callback) {
    request.get("https://123animes.mobi/ajax/episode/info?id=" + episode_id, function (error, response, body) {
        body = JSON.parse(body);
        var u = body.target;
        var parsed = new URL("https:" + u);
        var title = parsed.searchParams.get("title");
        var id = parsed.searchParams.get("id");
        // callback("https://gogo-play.net/load.php?id=" + id + "&title=" + title);
        // callback("https://streamani.net/embedplus?id="+ id + "&title=" + title);
        getStreamServerList(id,title,function(urls){
            var video_stream_url = "";
            for(var u of urls){
                if(u.provider == "Multiquality Server"){
                    video_stream_url = u.video;
                }
            }
            
        });
    });
}


function getStreamServerList(id,title,callback){
    request.get("https://streamani.net/load.php?id="+id+"=&title="+title,function(error,response,body){
        const $ = cheerio.load(body);
        var items = [];
        $("li.linkserver").each(function () {
            if($(this).attr("data-video") !== ""){
                items.push({
                    provider : $(this).html(),
                    video : $(this).attr("data-video")
                });
            }
            
        });
        callback(items);
    });
}

function getVideoUrlFromIframeUrl(iframe_url, callback) {
    request.get(iframe_url, function (error, response, body) {
        var video_url = body.substring(body.indexOf("file:"), body.indexOf(".mp4")) + ".mp4'";
        video_url = video_url.substring(video_url.indexOf("'") + 1, video_url.lastIndexOf("'"));
        callback(video_url);
    });
}


function fetchIframeUrlsBulk(file, callback) {
    fs.readFile(file, 'utf8', function (error, items) {
        items = JSON.parse(items);
        var item = 0;
        var urls = [];

        getVideoIframeUrl(items[item], processRequest);

        function processRequest(url) {
            urls.push(url);
            fs.writeFile('iframes.json', JSON.stringify(urls), function (err) {
                if (err) return console.log(err);
                console.log("Item stored : " + item);
            });
            item = item + 1;
            if (item in items) {
                getVideoIframeUrl(items[item], processRequest);
            } else {
                callback(urls);
            }
        }
    });
}

function fetchVideoUrlsFromIframeUrlsBulk(file, callback) {
    fs.readFile(file, 'utf8', function (error, items) {
        items = JSON.parse(items);
        var item = 0;
        var urls = [];

        getVideoUrlFromIframeUrl(items[item], processRequest);

        function processRequest(url) {
            urls.push({
                video_url: url,
                iframe_url: items[item]
            });
            fs.writeFile('videos.json', JSON.stringify(urls), function (err) {
                if (err) return console.log(err);
                console.log("Item stored : " + item);
            });
            item = item + 1;
            if (item in items) {
                getVideoUrlFromIframeUrl(items[item], processRequest);
            } else {
                callback(urls);
            }
        }
    });
}


function downloadVideosFromUrlBulk(file, callback) {
    fs.readFile(file, 'utf8', function (error, items) {
        items = JSON.parse(items);
        var item = 0;
        downloadVideo(items[item].video_url, items[item].iframe_url, processRequest);
        function processRequest(url) {
            item = item + 1;
            if (item in items) {
                downloadVideo(items[item].video_url, items[item].iframe_url, processRequest);
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


function downloadVideo(fileUrl, fileNameUrl, callback) {
    fileName = "";
    if(isValidUrl(fileUrl) && isValidUrl(fileNameUrl)){
        var parsed = new URL(fileNameUrl);
        fileName = parsed.searchParams.get("title") + ".mp4";
    }else{
        callback();
        return false;
    }

    // Variable to save downloading progress
    var received_bytes = 0;
    var total_bytes = 0;

    var outStream = fs.createWriteStream("videos/" + fileName);

    request
        .get(fileUrl)
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
    process.stdout.write(percentage + "% | " + received + " bytes downloaded out of " + total + " bytes.");
}

// STREAM SERVER APIS


function getVideoURlsFromStreamani(url,callback){
    request.get(url,function(error,response,body){
        var items = [];
        var code = body.substring(body.indexOf(`<div id="myVideo"></div>`),body.indexOf(`</html>`));
        code = code.substring(code.indexOf(`<script type="text/JavaScript">`),code.indexOf(`</script>`));
        code = code.split("{file:");
        for(var c of code){
            var url = {};
            url.video = c.substring(c.indexOf(`'`)+1,c.indexOf(`',`));
            url.extension = url.video.substring(url.video.lastIndexOf('.')+1,url.video.length);
            if(url.video !== ""){
                items.push(url);
            }
            
        }
       callback(items);
    });
}