<#assign  controlVisible="">
<#if "${Visible!'true'}"="true">
	<#assign  controlVisible="">
<#else>
	<#assign  controlVisible="display:none;">
</#if>

<#assign SpacingScript = "${Spacing!''}">

<#assign DisplayScaleScript = "col-xs-12">
<#if "${DisplayScale!'12'}" != "">
	<#assign DisplayScaleScript = "col-xs-${DisplayScale!'12'}">
</#if>

<#assign WidgetCode = " widgetCode=\"${Code!''}\" ">

<#if "${_ParentWidget.LayoutDirection!''}" = "horizontal">
<div class="${DisplayScaleScript}" id="${GlobalCode!""}_parent" ${WidgetCode} style="${SpacingScript} ${controlVisible}">
	<div id="${GlobalCode!""}" class="jgmmap"></div>
	<div id="${GlobalCode!""}_input" class="jgmmap-input" style="display: none;">
	    <div class="jgmmap-input-action iconfont icon-close" style="font-size:10px"></div>
	    <div class="jgmmap-input-bar" >起点：<input class="jgmmap-input-text" type="text" value="" placeholder="" id="${GlobalCode!""}_input_text" style="width:100px;height:23px;border:1px solid rgba(0,0,0,0.1);padding:0px;">
	        <input class="jgmmap-input-btn" type="button" value="公交" data-rttype="transit">
	        <input class="jgmmap-input-btn" type="button" value="驾车" data-rttype="driving">
	        <input class="jgmmap-input-btn" type="button" value="步行" data-rttype="walking">
	    </div>
	</div>
	<div id="${GlobalCode!""}_address" class="jgmmap-address" style="display: none;"></div>
</div>
<#else>
<div class="row">
	<div ${WidgetCode} class="${DisplayScaleScript}" id="${GlobalCode!""}_parent"  style="${SpacingScript} ${controlVisible}">
		<div id="${GlobalCode!""}" class="jgmmap"></div>
		<div id="${GlobalCode!""}_input" class="jgmmap-input" style="display: none;">
			<div class="jgmmap-input-action iconfont icon-close" style="font-size:10px"></div>
			<div class="jgmmap-input-bar" >起点：<input class="jgmmap-input-text" type="text" value="" placeholder="" id="${GlobalCode!""}_input_text" style="width:100px;height:23px;border:1px solid rgba(0,0,0,0.1);padding:0px;">
				<input class="jgmmap-input-btn" type="button" value="公交" data-rttype="transit">
				<input class="jgmmap-input-btn" type="button" value="驾车" data-rttype="driving">
				<input class="jgmmap-input-btn" type="button" value="步行" data-rttype="walking">
			</div>
		</div>
		<div id="${GlobalCode!""}_address" class="jgmmap-address" style="display: none;"></div>
	</div>
</div>
</#if>

