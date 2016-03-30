/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/core/Control'],function(q,M,C){"use strict";var T=M.extend("sap.ui.core.tmpl.Template",{constructor:function(i,s){M.apply(this,arguments);},metadata:{stereotype:"template","abstract":true,library:"sap.ui.core",properties:{"content":{type:"string",group:"Data",defaultValue:null}},publicMethods:["declareControl","createControl","placeAt","createMetadata","createRenderer"]}});var t={};T.prototype.register=function(){var i=this.getId(),o=t[i],m;if(o&&this!==o){m="adding template with duplicate id '"+i+"'";q.sap.log.error(m);throw new Error("Error: "+m);}t[i]=this;};T.prototype.deregister=function(){delete t[this.getId()];};T.byId=function(i){return t[i];};T.prototype.getInterface=function(){return this;};T._mSupportedTypes={};T.registerType=function(s,c){T._mSupportedTypes[s]=c;};T.unregisterType=function(s){delete T._mSupportedTypes[s];};T.parsePath=function(p){var m,s=p.indexOf(">");if(s>0){m=p.substr(0,s);p=p.substr(s+1);}return{path:p,model:m};};T.prototype.init=function(s,S){if(this.getMetadata().getName()==="sap.ui.core.tmpl.Template"){throw new Error("The class 'sap.ui.core.tmpl.Template' is abstract and must not be instantiated!");}if(M.bindingParser===sap.ui.base.BindingParser.complexParser){T.prototype.extractBindingInfo=function(v,i,S){M.bindingParser=sap.ui.base.BindingParser.simpleParser;var r=C.prototype.extractBindingInfo.apply(this,arguments);M.bindingParser=sap.ui.base.BindingParser.complexParser;return r;};}};T.prototype.declareControl=function(c){if(c){var m=this.createMetadata(),r=this.createRenderer(),a=this;q.sap.require("sap.ui.core.tmpl.TemplateControl");sap.ui.core.tmpl.TemplateControl.extend(c,{metadata:m,init:function(){sap.ui.core.tmpl.TemplateControl.prototype.init.apply(this,arguments);this.setTemplate(a);},renderer:{renderTemplate:r,hasControlData:m._hasControlData}});return q.sap.getObject(c);}};T.prototype.createControl=function(i,c,v){q.sap.require("sap.ui.core.tmpl.TemplateControl");var o=new sap.ui.core.tmpl.TemplateControl({id:i,template:this,context:c});o.setTemplateRenderer(this.createRenderer(v));return o;};T.prototype.placeAt=function(r,c,p,i){if(typeof c==="string"||typeof c==="number"){p=c;c=undefined;}var I;if(!(r instanceof C)&&i){var $=typeof r==="string"?q.sap.byId(r):q(r);if($.length>0){I=$.attr("id");r=$.get(0);var s=$.attr("data-context");c=c||s&&q.parseJSON(s);sap.ui.core.RenderManager.markInlineTemplate($);}}var o=this.createControl(I,c);o.placeAt(r,p);return o;};T.prototype.createMetadata=function(){q.sap.log.error("The function createMetadata is an abstract function which needs to be implemented by subclasses.");};T.prototype.createRenderer=function(){q.sap.log.error("The function createRenderer is an abstract function which needs to be implemented by subclasses.");};sap.ui.template=function(o){if(!o){var a=[];q.each(T._mSupportedTypes,function(s,j){q("script[type='"+s+"'], [data-type='"+s+"']").each(function(n,E){a.push(sap.ui.template({id:E.id,domref:E,type:s,_class:j}));});});return a;}else{if(typeof o==="string"){return sap.ui.template({id:o});}else if(o&&o.tagName&&o.nodeName&&o.ownerDocument&&o.nodeType===1){return sap.ui.template({id:o.id,domref:o});}o=q.extend({type:T.DEFAULT_TEMPLATE},o);var i,s,c,b,d=false,l=typeof o.src==="string",I=false;if(l){var r=q.sap.sjax({url:o.src,dataType:"text"});if(r.success){i=o.id;s=o.type;c=o.control;b=r.data;var e=/^<!--\sUI5:Template\stype=([a-z\/\-]*)\s(?:controller=([A-Za-z.]*)\s)?-->/,f=b.match(e);if(f){s=f[1];if(f.length==3){d=f[2];}b=b.substr(f[0].length);}}else{throw new Error("The template could not be loaded from "+o.src+"!");}}else{var E=o.domref||q.sap.domById(o.id),$=q(E);I=false;i=o.id||E&&E.id;s=$.attr("type")||o.type;c=$.attr("data-control")||o.control;if(i){var g=sap.ui.getCore().getTemplate(i);if(!g instanceof T){throw new Error("Object for id \""+i+"\" is no sap.ui.core.tmpl.Template!");}else{if(g){return g;}}}if($.length===0){throw new Error("DOM element for the Template with the id \""+i+"\" not found!");}b=$.html();var h=E.tagName.toLowerCase();if(h!=="script"){I=$.parents("body").length===1;}}var j=o._class;if(!j){j=T._mSupportedTypes[s];if(!j){throw new Error("The type \""+s+"\" is not supported.");}}q.sap.require(j);var k=q.sap.getObject(j);var m=new k({id:i,content:b});if(c){m.declareControl(c);}if(d){m._sControllerName=d;}if(I){m.placeAt(i,o.context,undefined,true);}return m;}};T.DEFAULT_TEMPLATE="text/x-handlebars-template";T.registerType(T.DEFAULT_TEMPLATE,"sap.ui.core.tmpl.HandlebarsTemplate");return T;});