
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
<#if "${_ParentWidget.LayoutDirection!''}" = "horizontal">
<div class="${DisplayScaleScript}" id="${GlobalCode!""}" ${WidgetCode} style="${SpacingScript} ${controlVisible}">
	<div class="star_container">
		<div id="${GlobalCode!""}_label" class="jgmstar_label"></div>
		<div id="${GlobalCode!""}_stars" class="jgmstar_stars"><div id="${GlobalCode!""}_bar" class="jgmstar_bar"></div></div>
	</div>
</div>
<#else>
<div class="row">
	<div ${WidgetCode} class="${DisplayScaleScript}" id="${GlobalCode!""}"  style="${SpacingScript} ${controlVisible}">
		<div class="star_container">
			<div id="${GlobalCode!""}_label" class="jgmstar_label"></div>
			<div id="${GlobalCode!""}_stars" class="jgmstar_stars"><div id="${GlobalCode!""}_bar" class="jgmstar_bar"></div></div>
		</div>
	</div>
</div>
</#if>
