/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/model/json/JSONModel"],function(q,l,C,J){"use strict";var T=C.extend("sap.ui.vk.Toolbar",{metadata:{library:"sap.ui.vk",properties:{title:{type:"string",group:"Appearance",defaultValue:""}},events:{},associations:{viewer:{type:"sap.ui.vk.Viewer",cardinality:"0..1"}},aggregations:{_toolbar:{type:"sap.m.Toolbar",multiple:false,visibility:"visible"},_helpButton:{type:"sap.m.Button",multiple:false,visibility:"visible"},_stepNavigationButton:{type:"sap.m.ToggleButton",multiple:false,visibility:"visible"},_sceneTreeButton:{type:"sap.m.ToggleButton",multiple:false,visibility:"visible"},_enterFullScreenButton:{type:"sap.m.ToggleButton",multiple:false,visibility:"visible"},_exitFullScreenButton:{type:"sap.m.Button",multiple:false,visibility:"visible"},_toolbarTitle:{type:"sap.m.Title",multiple:false,visibility:"visible"}}},_onSceneTree:function(){this.oViewer=sap.ui.getCore().byId(this.getViewer());if(this.oViewer!=null){var n=this._sceneTreeButton.getPressed();this.oViewer.setShowSceneTree(n);}},_onStepNavigation:function(){this.oViewer=sap.ui.getCore().byId(this.getViewer());if(this.oViewer!=null){var n=this._stepNavigationButton.getPressed();this.oViewer.setShowStepNavigation(n);}},_onFullScreen:function(){this.oViewer=sap.ui.getCore().byId(this.getViewer());if(this.oViewer!=null){var n=this._enterFullScreenButton.getPressed();this.oViewer.setEnableFullScreen(n);}},_fullScreenHandler:function(e){var f=e.mParameters.isFullScreen;this._enterFullScreenButton.setPressed(f);if(f){this._enterFullScreenButton.setIcon("sap-icon://exit-full-screen");}else{this._enterFullScreenButton.setIcon("sap-icon://full-screen");}},init:function(){if(C.prototype.init){C.prototype.init.apply(this);}this.oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vk.i18n");var _=new sap.m.ToolbarSpacer();var a=new sap.m.Button({icon:"sap-icon://sys-help",type:sap.m.ButtonType.Transparent,tooltip:this.oResourceBundle.getText("VIEWER_HELPBUTTONTOOLTIP")});this.setAggregation("_helpButton",a);this._stepNavigationButton=new sap.m.ToggleButton({icon:"sap-icon://step",type:sap.m.ButtonType.Transparent,enabled:false,tooltip:this.oResourceBundle.getText("STEP_NAV_MENUBUTTONTOOLTIP"),press:this._onStepNavigation.bind(this)});this.setAggregation("_stepNavigationButton",this._stepNavigationButton);this._sceneTreeButton=new sap.m.ToggleButton({icon:"sap-icon://tree",type:sap.m.ButtonType.Transparent,tooltip:this.oResourceBundle.getText("SCENETREE_MENUBUTTONTOOLTIP"),press:this._onSceneTree.bind(this)});this.setAggregation("_sceneTreeButton",this._sceneTreeButton);this._enterFullScreenButton=new sap.m.ToggleButton({icon:"sap-icon://full-screen",type:sap.m.ButtonType.Transparent,tooltip:this.oResourceBundle.getText("VIEWER_FULLSCREENBUTTONTOOLTIP"),press:this._onFullScreen.bind(this)});this.setAggregation("_enterFullScreenButton",this._enterFullScreenButton);var b=new sap.m.Button({icon:"sap-icon://exit-full-screen",type:sap.m.ButtonType.Transparent,tooltip:this.oResourceBundle.getText("VIEWER_FULLSCREENBUTTONTOOLTIP")});this.setAggregation("_exitFullScreenButton",b);this._toolbarTitle=new sap.m.Title();this.setAggregation("_toolbarTitle",this._toolbarTitle);this._toolbar=new sap.m.Toolbar({design:sap.m.ToolbarDesign.Solid,content:[this._toolbarTitle,_,new sap.m.ToolbarSeparator(),this._sceneTreeButton,new sap.m.ToolbarSeparator(),this._stepNavigationButton,new sap.m.ToolbarSeparator(),this._enterFullScreenButton]});this.setAggregation("_toolbar",this._toolbar,true);},exit:function(){this.oViewer=sap.ui.getCore().byId(this.getViewer());if(this.oViewer){this.oViewer.detachFullScreen(this._fullScreenHandler.bind(this));}},onBeforeRendering:function(){this._toolbar.setVisible(true);this._toolbarTitle.setText(this.getTitle());},refresh:function(){this.oViewer=sap.ui.getCore().byId(this.getViewer());this._stepNavigationButton.setPressed(this.oViewer.getShowStepNavigation());this._stepNavigationButton.setEnabled(this.oViewer.getEnableStepNavigation());this._sceneTreeButton.setPressed(this.oViewer.getShowSceneTree());this._sceneTreeButton.setEnabled(this.oViewer.getEnableSceneTree());this.oViewer.attachFullScreen(this._fullScreenHandler.bind(this));return true;},onAfterRendering:function(){this.refresh();}});return T;},true);
