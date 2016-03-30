/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var Q={createQuickView:function(s,c,t,f){var m=new sap.ui.model.odata.ODataModel(s,false);var o=new sap.ui.ux3.QuickView({firstTitle:"{title}",firstTitleHref:"{titleLinkURL}",type:"{Thing/text}",icon:"{imageURL}"});o.setModel(m);o.bindObject("/QuickviewConfigs(name='"+c+"',thingKey='"+t+"')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});var M=new sap.ui.suite.hcm.QvContent();M.bindAggregation("items",{path:"QVAttributes",factory:function(i,C){var a=new sap.ui.suite.hcm.QvItem(i,{label:"{Attribute/label}",link:"{valueLinkURL}",order:"{order}"});a.bindProperty("value","value",f&&f[C.getProperty("Attribute/name")]);return a;}});o.addContent(M);return o;},createQuickViewData:function(o,s,c,t,f){var m=new sap.ui.model.odata.ODataModel(s,false);o.removeAllContent();o.setModel(m);o.bindProperty("firstTitle","title");o.bindProperty("firstTitleHref","titleLinkURL");o.bindProperty("type","Thing/text");o.bindProperty("icon","imageURL");o.bindObject("/QuickviewConfigs(name='"+c+"',thingKey='"+t+"')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});var M=new sap.ui.suite.hcm.QvContent();M.bindAggregation("items",{path:"QVAttributes",factory:function(i,C){var a=new sap.ui.suite.hcm.QvItem(i,{label:"{Attribute/label}",link:"{valueLinkURL}",order:"{order}"});a.bindProperty("value","value",f&&f[C.getProperty("Attribute/name")]);return a;}});o.addContent(M);},createDataSetQuickView:function(s,c,t,p,S){var m=new sap.ui.model.odata.ODataModel(s,false);if(S){m.setSizeLimit(S);}var o=new sap.ui.ux3.QuickView({type:t,showActionBar:false});o.setModel(m);o.addContent(this._createDSContent(o,c,p));return o;},createDataSetQuickViewData:function(o,s,c,t,p,S){var m=new sap.ui.model.odata.ODataModel(s,false);if(S){m.setSizeLimit(S);}o.removeAllContent();o.setType(t);o.setShowActionBar(false);o.setModel(m);o.addContent(this._createDSContent(o,c,p));},_createDSContent:function(o,c,p){var C=new sap.ui.commons.layout.MatrixLayout();var r=new sap.ui.commons.layout.MatrixLayoutRow();q.each(p,function(i,P){var a;if(P.href){a=new sap.ui.commons.Link({text:P.value,href:P.href});}else{a=new sap.ui.commons.TextView({text:P.value});}var b=new sap.ui.commons.layout.MatrixLayoutCell({content:[a]});b.addStyleClass("quickViewDS");r.addCell(b);});C.bindAggregation("rows",c,r);return C;}};sap.ui.core.Element.extend("sap.ui.suite.hcm.QvItem",{metadata:{properties:{label:"string",value:"string",link:"string",order:"string",type:"string"}}});sap.ui.core.Control.extend("sap.ui.suite.hcm.QvContent",{metadata:{aggregations:{"items":{type:"sap.ui.suite.hcm.QvItem",multiple:true}}},init:function(){this._sorted=false;},exit:function(){if(this._oML){this._oML.destroy();}},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.write(">");r.renderControl(c._createQVContent(c));r.write("</div>");},_createQVContent:function(c){var m=new sap.ui.commons.layout.MatrixLayout({widths:["75px"]}),I=c.getItems(),M,o,l,t,L;if(this._oML){this._oML.destroy();}c._sortItems(c);for(var i=0;i<I.length;i++){M=new sap.ui.commons.layout.MatrixLayoutRow();o=new sap.ui.commons.layout.MatrixLayoutCell({vAlign:'Top'});l=new sap.ui.commons.Label({text:I[i].getLabel()+':'});o.addContent(l);M.addCell(o);o=new sap.ui.commons.layout.MatrixLayoutCell();if(I[i].getLink()){L=new sap.ui.commons.Link({text:I[i].getValue(),href:I[i].getLink()});o.addContent(L);}else{t=new sap.ui.commons.TextView({text:I[i].getValue()});o.addContent(t);}M.addCell(o);m.addRow(M);}this._oML=m;return m;},_sortItems:function(c){if(!c._sorted){var I=c.removeAllAggregation("items",true);I.sort(function(a,b){return(parseInt(a.getOrder(),10)-parseInt(b.getOrder(),10));});q.each(I,function(i,o){c.addAggregation("items",o,false);});c._sorted=true;}}});return Q;},true);