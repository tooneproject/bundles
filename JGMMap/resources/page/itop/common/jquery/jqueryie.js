jQuery.acceptData = function (elem) {
    //确定一个对象是否允许设置Data 
    var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()],
	nodeType = +elem.nodeType || 1;
    //进行过滤
    return nodeType !== 1 && nodeType !== 9 ?
	false :
    //如果是jQuery.noData里面限定的节点的话，则返回false
    //如果节点是object，则判定是否是IE flash的classid
!noData || noData !== true && elem.getAttribute("classid") === noData;
};