/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/m/GenericTile'],function(q,l,C,G){"use strict";var S=C.extend("sap.m.SlideTile",{metadata:{library:"sap.m",properties:{"displayTime":{type:"int",group:"Appearance",defaultValue:5000},"transitionTime":{type:"int",group:"Appearance",defaultValue:500}},aggregations:{"tiles":{type:"sap.m.GenericTile",multiple:true,singularName:"tile"}}}});S.prototype.onBeforeRendering=function(){this._stopAnimation();this._sWidth=this._sHeight=undefined;this._iCurrentTile=this._iPreviousTile=undefined;};S.prototype.onAfterRendering=function(){var c=this.getTiles().length;this._bAnimationPause=false;this._iCurrAnimationTime=0;this._scrollToNextTile();if(c>1){this._startAnimation();}};S.prototype.exit=function(){this._stopAnimation();};S.prototype.ontouchstart=function(e){this.addStyleClass("sapMSTHvr");};S.prototype.ontouchend=function(e){this.removeStyleClass("sapMSTHvr");};G.prototype.ontouchcancel=function(e){this.removeStyleClass("sapMSTHvr");};S.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.ENTER){this.getTiles()[this._iCurrentTile].firePress();}};S.prototype.onmouseup=function(e){this.removeStyleClass("sapMSTHvr");if(sap.ui.Device.system.desktop){if(this._bPreventEndEvent){this._bPreventEndEvent=false;e.preventDefault();return;}this.getTiles()[this._iCurrentTile].firePress();}};S.prototype.onmousedown=function(e){this.addStyleClass("sapMSTHvr");};S.prototype._toggleAnimation=function(){if(this.getTiles().length>1){if(this._bAnimationPause){this._startAnimation();}else{this._stopAnimation();}}this._bAnimationPause=!this._bAnimationPause;};S.prototype._stopAnimation=function(){this._iCurrAnimationTime+=Date.now()-this._iStartTime;clearTimeout(this._sTimerId);if(this._iCurrentTile!=undefined){var w=q.sap.byId(this.getId()+"-wrapper-"+this._iCurrentTile);w.stop();}if(this._iPreviousTile!=undefined){var W=q.sap.byId(this.getId()+"-wrapper-"+this._iPreviousTile);W.stop();}};S.prototype._startAnimation=function(){var d=this.getDisplayTime()-this._iCurrAnimationTime;var t=this;clearTimeout(this._sTimerId);this._sTimerId=setTimeout(function(){t._scrollToNextTile();},d);this._iStartTime=Date.now();};S.prototype._scrollToNextTile=function(p){var t=this._iCurrAnimationTime-this.getDisplayTime();t=this.getTransitionTime()-(t>0?t:0);var f=t===this.getTransitionTime();if(f){var n=this._getNextTileIndex(this._iCurrentTile);this._iPreviousTile=this._iCurrentTile;this._iCurrentTile=n;}var w=q.sap.byId(this.getId()+"-wrapper-"+this._iCurrentTile);var d=this._iPreviousTile!==undefined;var D=sap.ui.getCore().getConfiguration().getRTL()?"right":"left";if(d){var W=q.sap.byId(this.getId()+"-wrapper-"+this._iPreviousTile);var s=W.css("width");var a=parseFloat(w.css("width"));var b=parseFloat(s);var c=b<a;if(c){this._changeSizeTo(this._iCurrentTile);}if(f){w.css(D,s);}var o={};o[D]="-"+s;var e=this;W.animate(o,{duration:t,done:function(){if(!c){e._changeSizeTo(e._iCurrentTile);}W.css(D,"");}});o[D]="0rem";w.animate(o,{duration:t,done:function(){e._iCurrAnimationTime=0;if(!p){e._startAnimation();}}});}else{this._changeSizeTo(this._iCurrentTile);w.css(D,"0rem");}if(this.getTiles()[this._iCurrentTile]){this._setAriaDescriptor();}};S.prototype._setAriaDescriptor=function(){this.$().attr("aria-label",this.getTiles()[this._iCurrentTile].getAltText().replace(/\s/g," "));};S.prototype._changeSizeTo=function(t){var T=this.getTiles()[t];if(!T){return;}if(this._sFrameType){this.$().removeClass(this._sFrameType);}if(this._sSize){this.$().removeClass(this._sSize);}this.$().addClass(T.getFrameType()).addClass(T.getSize());this._sFrameType=T.getFrameType();this._sSize=T.getSize();};S.prototype._getNextTileIndex=function(t){if(t+1<this.getTiles().length){return t+1;}else{return 0;}};S.prototype._getPrevTileIndex=function(t){if(t-1>=0){return t-1;}else{return this.getTiles().length-1;}};return S;},true);