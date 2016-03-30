/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.CSS_CLASS="sapMSlider";S.render=function(r,s){var e=s.getEnabled(),t=s.getTooltip_AsString(),C=S.CSS_CLASS;r.write("<div");r.addClass(C);if(!e){r.addClass(C+"Disabled");}r.addStyle("width",s.getWidth());r.writeClasses();r.writeStyles();r.writeControlData(s);if(t){r.writeAttributeEscaped("title",t);}r.write(">");r.write('<div');r.writeAttribute("id",s.getId()+"-inner");r.addClass(C+"Inner");if(!e){r.addClass(C+"InnerDisabled");}r.writeClasses();r.writeStyles();r.write(">");if(s.getProgress()){this.renderProgressIndicator(r,s);}this.renderHandle(r,s);r.write("</div>");if(s.getName()){this.renderInput(r,s);}r.write("</div>");};S.renderProgressIndicator=function(r,s){r.write("<div");r.writeAttribute("id",s.getId()+"-progress");r.addClass(S.CSS_CLASS+"Progress");r.addStyle("width",s._sProgressValue);r.writeClasses();r.writeStyles();r.write(' aria-hidden="true"></div>');};S.renderHandle=function(r,s){var e=s.getEnabled();r.write("<span");r.writeAttribute("id",s.getId()+"-handle");if(s.getShowHandleTooltip()){this.writeHandleTooltip(r,s);}r.addClass(S.CSS_CLASS+"Handle");r.addStyle(sap.ui.getCore().getConfiguration().getRTL()?"right":"left",s._sProgressValue);this.writeAccessibilityState(r,s);r.writeClasses();r.writeStyles();if(e){r.writeAttribute("tabindex","0");}r.write("></span>");};S.writeHandleTooltip=function(r,s){r.writeAttribute("title",s.getValue());};S.renderInput=function(r,s){r.write('<input type="text"');r.writeAttribute("id",s.getId()+"-input");r.addClass(S.CSS_CLASS+"Input");if(!s.getEnabled()){r.write("disabled");}r.writeClasses();r.writeAttributeEscaped("name",s.getName());r.writeAttribute("value",s.getValue());r.write("/>");};S.writeAccessibilityState=function(r,s){var v=s.getValue();r.writeAccessibilityState(s,{role:"slider",orientation:"horizontal",valuemin:s.getMin(),valuemax:s.getMax(),valuenow:v});};return S;},true);
