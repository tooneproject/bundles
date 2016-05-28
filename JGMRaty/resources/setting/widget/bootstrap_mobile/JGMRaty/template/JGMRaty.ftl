
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

<#-- panel 容器下的 Label 并且是水平组合 -->
<#if "${_ParentWidget.type!''}" = "JGMPanel" && "${_ParentWidget.LayoutDirection!''}" = "vertical">
<div class="row star_container" style="${controlVisible} ${SpacingScript}">
	<div class="${DisplayScaleScript}">
		<div id="${GlobalCode!""}_label" class="jgmstar_label"></div>
		<div id="${GlobalCode!""}_stars" class="jgmstar_stars"><div id="${GlobalCode!""}_bar" class="jgmstar_bar"></div></div>
	</div>
</div>
<#else>
<div class="${DisplayScaleScript}" style="${SpacingScript} ">
	<div class="star_container" style="${controlVisible} ">
		<div id="${GlobalCode!""}_label" class="jgmstar_label"></div>
		<div id="${GlobalCode!""}_stars" class="jgmstar_stars"><div id="${GlobalCode!""}_bar" class="jgmstar_bar"></div></div>
	</div>
</div>
</#if>
