var request = require("request");
var fs = require("fs");
const cheerio = require('cheerio');




fetchVideoUrlsFromIframeUrlsBulk('./input/iframes.json',function(urls){
    console.log("job finised");
    console.log("total Urls : "+urls.length);
});





function getStreamServerList(stream_url,callback){
    var parsed = new URL("https:" + stream_url);
    var title = parsed.searchParams.get("title");
        var id = parsed.searchParams.get("id");
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
    getStreamServerList(iframe_url,function(urls){
        var video_stream_url = "";
        for(var u of urls){
            if(u.provider == "Multiquality Server"){
                video_stream_url = u.video;
            }
        }
        if(video_stream_url !== ""){
            getVideoURlsFromStreamani(video_stream_url,callback);
        }else{
            callback([]);
        }
    });
}



function fetchVideoUrlsFromIframeUrlsBulk(file, callback) {
    fs.readFile(file, 'utf8', function (error, items) {
        items = JSON.parse(items);
        var item = 0;
        var urls = [];

        getVideoUrlFromIframeUrl(items[item], processRequest);

        function processRequest(videoUrls) {
            urls.push({
                urls: videoUrls,
                iframe_url: items[item]
            });
            fs.writeFile('./output/videos.json', JSON.stringify(urls), function (err) {
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






function isValidUrl(s) {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
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