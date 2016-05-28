<#assign WidgetCode = " widgetCode=\"${Code!''}\" ">

<#assign DockingScript = "pull-${Docking!'left'}">

<#assign  controlVisible="">
<#if "${Visible!'true'}"="true">
	<#assign  controlVisible="">
<#else>
	<#assign  controlVisible="display:none;">
</#if>
<#--end-->
<#assign DisplayScaleScript = "col-xs-12">
<#if "${DisplayScale!'12'}" != "">
	<#assign DisplayScaleScript = "col-xs-${DisplayScale!'12'}">
</#if>

<#assign SpacingScript = "padding:0px;">
<#if "${_ParentWidget.type!''}" = "JGMPanel">
	<#assign SpacingScript = "${Spacing!''}">
</#if>

<#if "${_ParentWidget.type!''}" = "JGMPanel" && "${_ParentWidget.LayoutDirection!''}" = "vertical">
	<div class="row">
		<div class="${DisplayScaleScript}" style="${SpacingScript} ${controlVisible}" data-show="${ShowType!""}">
			<div id="${GlobalCode!""}" ${WidgetCode} ></div>
		</div>
	</div>
<#elseif "${_ParentWidget.type!''}" = "JGMPanel" && "${_ParentWidget.LayoutDirection!''}" = "horizontal" >
		<div class="${DisplayScaleScript}" style="${SpacingScript} ${controlVisible}" data-show="${ShowType!""}">
			<div id="${GlobalCode!""}" ${WidgetCode} ></div>
		</div>
<#else>	
	<div style="${controlVisible}" class="container-fluid" data-show="${ShowType!""}">
	    <div class="row-fluid">
			<div id="${GlobalCode!""}" ${WidgetCode} ></div>
	    </div>
	</div>
</#if>
