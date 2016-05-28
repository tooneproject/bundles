
(function(){
    var urls = [
        "../../libs/fusioncharts-suite-xt-3.9.0/fusioncharts.js",
        "../../V3_Chart.js",
        "../data/data.js"
    ];
    var url = document.location.href;
	//pagename is something as 'line1','line2'
    var pagename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
    urls.push('../data/'+pagename+'Config.js');

    var index=0;
    var head = document.getElementsByTagName('HEAD')[0];
    loadScript(urls[index],loadCallBack); 

    function loadCallBack(){
        index ++;
        if(index < urls.length)
            loadScript(urls[index],loadCallBack); 
        else{
            if(url.indexOf("#3D")!=-1){
                window.config.is3D = "true";
            }
        	window.startDraw();
        }
    }

    function loadScript(url, callback) {
        var node = document.createElement("script"); 
        node.type = "text/javascript";  
        node.src = url;
        head.insertBefore(node, head.firstChild);

        if (node.addEventListener) {
            node.addEventListener('load', callback, false);
            node.addEventListener('error', function(){
                alert("加载出错:" + url);
            }, false);
        }
        else { // for IE6-8
            node.attachEvent('onreadystatechange', function() {
                var rs = node.readyState;
                if (rs === 'loaded' || rs === 'complete') {
                    callback();
                }
            });
        }
    }

})();