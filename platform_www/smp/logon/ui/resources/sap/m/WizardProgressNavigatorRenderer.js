/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var C=sap.m.WizardProgressNavigator.CLASSES,A=sap.m.WizardProgressNavigator.ATTRIBUTES,W={};W.render=function(r,c){this.startNavigator(r,c);this.renderList(r,c);this.endNavigator(r);};W.startNavigator=function(r,c){r.write("<nav");r.writeControlData(c);r.writeAttribute("class",C.NAVIGATION);r.writeAttribute(A.STEP_COUNT,c.getStepCount());r.write(">");};W.renderList=function(r,c){this.startList(r);this.renderSteps(r,c);if(c.getVaryingStepCount()){this.renderSeparator(r);}this.endList(r);};W.startList=function(r){r.write("<ul");r.writeAttribute("class",C.LIST);r.write(">");};W.renderSteps=function(r,c){var s=c.getStepCount(),S=c.getStepTitles(),a=c.getStepIcons();for(var i=1;i<=s;i++){this.startStep(r,i);this.renderAnchor(r,i,S[i-1],a[i-1]);this.endStep(r);if(i<s){this.renderSeparator(r);}}};W.startStep=function(r,s){r.write("<li");r.writeAttribute("class",C.STEP);r.writeAttribute(A.STEP,s);r.write(">");};W.renderAnchor=function(r,s,S,i){r.write("<a tabindex='-1' aria-disabled='true'");r.writeAttribute("class",C.ANCHOR);r.writeAttributeEscaped("title",S);r.write(">");if(i){r.writeIcon(i,[C.ICON],{title:null});}else{r.write(s);}r.write("</a>");};W.endStep=function(r){r.write("</li>");};W.renderSeparator=function(r){r.write("<li");r.writeAttribute("class",C.SEPARATOR);r.write("></li>");};W.endList=function(r){r.write("</ul>");};W.endNavigator=function(r){r.write("</nav>");};return W;},true);
