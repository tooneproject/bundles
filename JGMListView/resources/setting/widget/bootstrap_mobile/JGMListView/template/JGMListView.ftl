<#assign WidgetCode = " widgetCode=\"${Code!''}\" ">
<div id="${GlobalCode!""}" ${WidgetCode} class="iscroll_wrapper">
	<div class="iscroll_scroller">
		<ul id="ul_${GlobalCode!""}"></ul>
	</div>
	${_ChildrenWidget!""}
</div>
<script type="text/javascript">
document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);
</script>