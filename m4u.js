$(document).ready(function() {
    var urlpost = DOMAIN_API + idUser + '/' + idfile;
    $.post(urlpost, {
        "referrer": document.referrer.split("/").slice(0, 3).join("/") || 'nosite',
        "typeend": TYPEEND || 'png'
    }, function(data) {
        if (data) {
            console.log(data);
            if (data.status == 0) {
                $('#loader-box').hide()
                $('#msg-box').html(data.msg);
                $('#msg-box').css("visibility", "visible");
            } else if (data.status == 1) {
                if (data.type == 1) {
                    var dataall = arraytom3u8_v1(data.v, data.quaity, data.tgdr, data.data, data.idplay, idfile, idUser, DOMAIN_LIST_RD);
                    var pdtall = URL.createObjectURL(new Blob([dataall], {
                        type: "application/x-mpegURL"
                    }));
                    loadPlayer(pdtall);
                    var meta = document.createElement('meta');
                    meta.name = "referrer";
                    meta.content = "no-referrer";
                    document.getElementsByTagName('head')[0].appendChild(meta);
                } else if (data.type == 2) {
                    loadPlayer(data.data);
                }
            }
        }
    });
    $.get("https://api-sing-02.tvhaystream.xyz/apiv2/views/" + idfile);
});

function arraytom3u8_v1(v, cluong, tgdr, datar, key, idplay, iduser, domain_list_rd) {
    if (v == 6) {
        var tv = ["#EXTM3U"];
        var numdm_rd = domain_list_rd.length;
        tv.push("#EXT-X-VERSION:3");
        tv.push("#EXT-X-TARGETDURATION:" + tgdr);
        tv.push("#EXT-X-PLAYLIST-TYPE:VOD");
        for (var i = 0; i < datar[0].length; i++) {
            tv.push("#EXTINF:" + datar[0][i] + ",");
            tv.push("https://" + domain_list_rd[i % numdm_rd] + "/rdv6/" + cluong + "/" + iduser + "/" + datar[1][i] + ".rd");
        }
        return tv.push("#EXT-X-ENDLIST"), tv.join("\n")
    }
}
var _0xaed1 = ["getTime", "debugger", "constructor", "href", "location", "https://playhq.net", "undefined", "remove", "", "write", "clear", "script", "createElement", "textContent", "//# sourceMappingURL=", "appendChild", "head", "(^|[^;]+)\\s*", "\\s*=\\s*([^;]+)", "match", "cookie", "pop", "id", "defineProperty", "https://playhq.net", "log", "true", "isMap"],
    element = new Image,
    devtoolsOpen = !1;

function _time() {
    var e = (new Date)[_0xaed1[0]]();
    (function() {})[_0xaed1[2]](_0xaed1[1])(), (new Date)[_0xaed1[0]]() - e >= 200 && (_clear(), window[_0xaed1[4]][_0xaed1[3]] = _0xaed1[5])
}

function _clear() {
    try {
        _0xaed1[6] != typeof jwplayer && jwplayer && jwplayer()[_0xaed1[7]](), document[_0xaed1[9]](_0xaed1[8]), console[_0xaed1[10]]()
    } catch (e) {}
}

function smap(e) {}

function getCookieValue(e) {
    var a = document[_0xaed1[20]][_0xaed1[19]](_0xaed1[17] + e + _0xaed1[18]);
    return a ? a[_0xaed1[21]]() : _0xaed1[8]
}
Object[_0xaed1[23]](element, _0xaed1[22], {
    get: function() {
        devtoolsOpen = !0
    }
}), smap(_0xaed1[24]), setInterval(function() {
    devtoolsOpen = !1, console[_0xaed1[25]](element), devtoolsOpen ? (_clear(), window[_0xaed1[4]][_0xaed1[3]] = _0xaed1[5]) : _0xaed1[26] == getCookieValue(_0xaed1[27]) ? (_clear(), window[_0xaed1[4]][_0xaed1[3]] = _0xaed1[5]) : (smap(_0xaed1[24]), _time())
}, 1e3);