/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./ResponsivePopover","./Button","./Toolbar","./ToolbarSpacer","./Bar","./List","./StandardListItem","./library","sap/ui/core/Control","./PlacementType","sap/ui/core/IconPool","sap/ui/core/HTML","./Text","sap/ui/core/Icon","./SegmentedButton","./Page","./NavContainer","./semantic/SemanticPage","./Popover","jquery.sap.dom"],function(q,R,B,T,a,b,L,S,l,C,P,I,H,c,d,e,f,N,g,h){"use strict";var M=C.extend("sap.m.MessagePopover",{metadata:{library:"sap.m",properties:{asyncDescriptionHandler:{type:"any",group:"Behavior",defaultValue:null},asyncURLHandler:{type:"any",group:"Behavior",defaultValue:null},placement:{type:"sap.m.VerticalPlacementType",group:"Behavior",defaultValue:"Vertical"},initiallyExpanded:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.MessagePopoverItem",multiple:true,singularName:"item"}},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},itemSelect:{parameters:{item:{type:"sap.m.MessagePopoverItem"},messageTypeFilter:{type:"sap.ui.core.MessageType"}}},listSelect:{parameters:{messageTypeFilter:{type:"sap.ui.core.MessageType"}}}}}});var j="sapMMsgPopover",k={back:I.getIconURI("nav-back"),close:I.getIconURI("decline"),information:I.getIconURI("message-information"),warning:I.getIconURI("message-warning"),error:I.getIconURI("message-error"),success:I.getIconURI("message-success")},m=["all","error","warning","success","information"],A=["asyncDescriptionHandler","asyncURLHandler"],D={};M.setDefaultHandlers=function(i){A.forEach(function(F){if(i.hasOwnProperty(F)){D[F]=i[F];}});};M.prototype.init=function(){var t=this;var p;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oPopover=new R(this.getId()+"-messagePopover",{showHeader:false,contentWidth:"440px",placement:this.getPlacement(),showCloseButton:false,modal:false,afterOpen:function(E){t.fireAfterOpen({openBy:E.getParameter("openBy")});},afterClose:function(E){t._navContainer.backToTop();t.fireAfterClose({openBy:E.getParameter("openBy")});},beforeOpen:function(E){t.fireBeforeOpen({openBy:E.getParameter("openBy")});},beforeClose:function(E){t.fireBeforeClose({openBy:E.getParameter("openBy")});}}).addStyleClass(j);this._createNavigationPages();this._createLists();p=this._oPopover.getAggregation("_popup");p.oPopup.setAutoClose(false);p.addEventDelegate({onBeforeRendering:this.onBeforeRenderingPopover,onkeypress:this._onkeypress},this);if(sap.ui.Device.system.phone){this._oPopover.setBeginButton(new B({text:this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE"),press:this.close.bind(this)}));}A.forEach(function(F){if(D.hasOwnProperty(F)){t.setProperty(F,D[F]);}});};M.prototype.exit=function(){this._oResourceBundle=null;this._oListHeader=null;this._oDetailsHeader=null;this._oSegmentedButton=null;this._oBackButton=null;this._navContainer=null;this._listPage=null;this._detailsPage=null;this._sCurrentList=null;if(this._oLists){this._destroyLists();}if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}};M.prototype.onBeforeRenderingPopover=function(){if(this._bItemsChanged){this._clearLists();this._fillLists(this.getItems());this._clearSegmentedButton();this._fillSegmentedButton();this._bItemsChanged=false;}this._setInitialFocus();};M.prototype._onkeypress=function(E){if(E.shiftKey&&E.keyCode==q.sap.KeyCodes.ENTER){this._fnHandleBackPress();}};M.prototype._getListHeader=function(){return this._oListHeader||this._createListHeader();};M.prototype._getDetailsHeader=function(){return this._oDetailsHeader||this._createDetailsHeader();};M.prototype._createListHeader=function(){var s=this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");var i=this.getId()+"-CloseBtnDescr";var o=new H(i,{content:"<span id=\""+i+"\" style=\"display: none;\">"+s+"</span>"});var n=this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_HEADING");var p=this.getId()+"-HeadingDescr";var r=new H(p,{content:"<span id=\""+p+"\" style=\"display: none;\" role=\"heading\">"+n+"</span>"});this._oPopover.addAssociation("ariaDescribedBy",p,true);var t=new B({icon:k["close"],visible:!sap.ui.Device.system.phone,ariaLabelledBy:o,tooltip:s,press:this.close.bind(this)}).addStyleClass(j+"CloseBtn");this._oSegmentedButton=new e(this.getId()+"-segmented",{});this._oListHeader=new T({content:[this._oSegmentedButton,new a(),t,o,r]});return this._oListHeader;};M.prototype._createDetailsHeader=function(){var s=this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");var i=this.getId()+"-CloseBtnDetDescr";var o=new H(i,{content:"<span id=\""+i+"\" style=\"display: none;\">"+s+"</span>"});var n=this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_BACK_BUTTON");var p=this.getId()+"-BackBtnDetDescr";var r=new H(p,{content:"<span id=\""+p+"\" style=\"display: none;\">"+n+"</span>"});var t=new B({icon:k["close"],visible:!sap.ui.Device.system.phone,ariaLabelledBy:o,tooltip:s,press:this.close.bind(this)}).addStyleClass(j+"CloseBtn");this._oBackButton=new B({icon:k["back"],press:this._fnHandleBackPress.bind(this),ariaLabelledBy:r,tooltip:n});this._oDetailsHeader=new T({content:[this._oBackButton,new a(),t,o,r]});return this._oDetailsHeader;};M.prototype._createNavigationPages=function(){this._listPage=new f(this.getId()+"listPage",{customHeader:this._getListHeader()});this._detailsPage=new f(this.getId()+"-detailsPage",{customHeader:this._getDetailsHeader()});this._detailsPage.addEventDelegate({onclick:function(E){var t=E.target;if(t.nodeName.toUpperCase()==='A'&&(t.className.indexOf('sapMMsgPopoverItemDisabledLink')!==-1||t.className.indexOf('sapMMsgPopoverItemPendingLink')!==-1)){E.preventDefault();}}});this._navContainer=new N(this.getId()+"-navContainer",{initialPage:this.getId()+"listPage",pages:[this._listPage,this._detailsPage],navigate:this._navigate.bind(this),afterNavigate:this._afterNavigate.bind(this)});this._oPopover.addContent(this._navContainer);return this;};M.prototype._createLists=function(){this._oLists={};m.forEach(function(s){this._oLists[s]=new L({itemPress:this._fnHandleItemPress.bind(this),visible:false});this._listPage.addAggregation("content",this._oLists[s],true);},this);return this;};M.prototype._clearLists=function(){m.forEach(function(s){if(this._oLists[s]){this._oLists[s].destroyAggregation("items",true);}},this);return this;};M.prototype._destroyLists=function(){m.forEach(function(s){this._oLists[s]=null;},this);this._oLists=null;};M.prototype._fillLists=function(i){i.forEach(function(o){var n=this._mapItemToListItem(o),p=this._mapItemToListItem(o);this._oLists["all"].addAggregation("items",n,true);this._oLists[o.getType().toLowerCase()].addAggregation("items",p,true);},this);};M.prototype._mapItemToListItem=function(o){if(!o){return null;}var t=o.getType(),i=new S({title:o.getTitle(),icon:this._mapIcon(t),type:sap.m.ListType.Navigation}).addStyleClass(j+"Item").addStyleClass(j+"Item"+t);i._oMessagePopoverItem=o;return i;};M.prototype._mapIcon=function(i){if(!i){return null;}return k[i.toLowerCase()];};M.prototype._clearSegmentedButton=function(){if(this._oSegmentedButton){this._oSegmentedButton.destroyAggregation("buttons",true);}return this;};M.prototype._fillSegmentedButton=function(){var t=this;var p=function(s){return function(){t._fnFilterList(s);};};m.forEach(function(s){var o=this._oLists[s],i=o.getItems().length,n;if(i>0){n=new B(this.getId()+"-"+s,{text:s=="all"?this._oResourceBundle.getText("MESSAGEPOPOVER_ALL"):i,icon:k[s],press:p(s)}).addStyleClass(j+"Btn"+s.charAt(0).toUpperCase()+s.slice(1));this._oSegmentedButton.addButton(n,true);}},this);return this;};M.prototype._setIcon=function(o,i){this._previousIconTypeClass=j+"DescIcon"+o.getType();this._oMessageIcon=new d({src:i.getIcon()}).addStyleClass(j+"DescIcon").addStyleClass(this._previousIconTypeClass);this._detailsPage.addContent(this._oMessageIcon);};M.prototype._setTitle=function(o){this._oMessageTitleText=new c(this.getId()+'MessageTitleText',{text:o.getTitle()}).addStyleClass('sapMMsgPopoverTitleText');this._detailsPage.addAggregation("content",this._oMessageTitleText);};M.prototype._setDescription=function(o){if(o.getMarkupDescription()){this._oMessageDescriptionText=new H(this.getId()+'MarkupDescription',{content:"<div class='markupDescription'>"+o.getDescription()+"</div>"});}else{this._oMessageDescriptionText=new c(this.getId()+'MessageDescriptionText',{text:o.getDescription()}).addStyleClass('sapMMsgPopoverDescriptionText');}this._detailsPage.addContent(this._oMessageDescriptionText);};M.prototype._iNextValidationTaskId=0;M.prototype._validateURL=function(u){if(q.sap.validateUrl(u)){return u;}q.sap.log.warning("You have entered invalid URL");return'';};M.prototype._queueValidation=function(i){var n=this.getAsyncURLHandler();var v=++this._iNextValidationTaskId;var p={};var o=new window.Promise(function(r,s){p.resolve=r;p.reject=s;var t={url:i,id:v,promise:p};n(t);});o.id=v;return o;};M.prototype._getTagPolicy=function(){var t=this,i;var n=html.makeTagPolicy(this._validateURL());return function customTagPolicy(o,p){var r,v=false;if(o.toUpperCase()==="A"){for(i=0;i<p.length;){if(p[i]==="href"){v=true;r=p[i+1];p.splice(0,2);continue;}i+=2;}}p=n(o,p);if(v&&typeof t.getAsyncURLHandler()==="function"){p=p||[];var s=false;for(i=0;i<p.length;i+=2){if(p[i]==="class"){p[i+1]+="sapMMsgPopoverItemDisabledLink sapMMsgPopoverItemPendingLink";s=true;break;}}var u=p.indexOf("id");if(u>-1){p.splice(u+1,1);p.splice(u,1);}if(!s){p.unshift("sapMMsgPopoverItemDisabledLink sapMMsgPopoverItemPendingLink");p.unshift("class");}var V=t._queueValidation(r);p.push("href");p.push(r);p.push("target");p.push("_blank");p.push("id");p.push("sap-ui-"+t.getId()+"-link-under-validation-"+V.id);V.then(function(w){var $=q.sap.byId("sap-ui-"+t.getId()+"-link-under-validation-"+w.id);if(w.allowed){q.sap.log.info("Allow link "+r);}else{q.sap.log.info("Disallow link "+r);}$.removeClass('sapMMsgPopoverItemPendingLink');$.toggleClass('sapMMsgPopoverItemDisabledLink',!w.allowed);}).catch(function(){q.sap.log.warning("Async URL validation could not be performed.");});}return p;};};M.prototype._sanitizeDescription=function(o){q.sap.require("jquery.sap.encoder");q.sap.require("sap.ui.thirdparty.caja-html-sanitizer");var t=this._getTagPolicy();var s=html.sanitizeWithPolicy(o.getDescription(),t);o.setDescription(s);this._setDescription(o);};M.prototype._fnHandleItemPress=function(E){var o=E.getParameter("listItem"),i=o._oMessagePopoverItem;var n=this.getAsyncDescriptionHandler();var p=function(u){this._setTitle(i);this._sanitizeDescription(i);this._setIcon(i,o);if(!u){this._navContainer.to(this._detailsPage);}}.bind(this);this._previousIconTypeClass=this._previousIconTypeClass||'';this.fireItemSelect({item:i,messageTypeFilter:this._getCurrentMessageTypeFilter()});this._detailsPage.destroyContent();if(typeof n==="function"&&!!i.getLongtextUrl()){i.setMarkupDescription(true);var r={};var s=new window.Promise(function(u,v){r.resolve=u;r.reject=v;});var t=function(){this._detailsPage.setBusy(false);p(true);}.bind(this);s.then(function(){t();}).catch(function(){q.sap.log.warning("Async description loading could not be performed.");t();});this._navContainer.to(this._detailsPage);this._detailsPage.setBusy(true);n({promise:r,item:i});}else{p();}this._listPage.$().attr("aria-hidden","true");};M.prototype._fnHandleBackPress=function(){this._listPage.$().removeAttr("aria-hidden");this._navContainer.back();};M.prototype._fnFilterList=function(s){m.forEach(function(i){if(i!=s&&this._oLists[i].getVisible()){this._oLists[i].setVisible(false);}},this);this._sCurrentList=s;this._oLists[s].setVisible(true);this._expandMsgPopover();this.fireListSelect({messageTypeFilter:this._getCurrentMessageTypeFilter()});};M.prototype._getCurrentMessageTypeFilter=function(){return this._sCurrentList=="all"?"":this._sCurrentList;};M.prototype._navigate=function(){if(this._isListPage()){this._oRestoreFocus=q(document.activeElement);}};M.prototype._afterNavigate=function(){q.sap.delayedCall(0,this,this._restoreFocus);};M.prototype._isListPage=function(){return(this._navContainer.getCurrentPage()==this._listPage);};M.prototype._setInitialFocus=function(){if(this._isListPage()){this._oPopover.setInitialFocus(this._oLists[this._sCurrentList]);}};M.prototype._restoreFocus=function(){if(this._isListPage()){var r=this._oRestoreFocus&&this._oRestoreFocus.control(0);if(r){r.focus();}}else{this._oBackButton.focus();}};M.prototype._restoreExpansionDefaults=function(){if(sap.ui.Device.system.phone){this._fnFilterList("all");}else if(this.getInitiallyExpanded()){this._expandMsgPopover();this._fnFilterList("all");}else{this._collapseMsgPopover();m.forEach(function(s){this._oLists[s].setVisible(false);},this);}};M.prototype._expandMsgPopover=function(){this._oPopover.setContentHeight(this._oPopover.getContentWidth()).removeStyleClass(j+"-init");};M.prototype._collapseMsgPopover=function(){this._oPopover.addStyleClass(j+"-init").setContentHeight("auto");this._oSegmentedButton.setSelectedButton("none");};M.prototype.openBy=function(o){var r=this._oPopover.getAggregation("_popup"),p=o.getParent();if(r instanceof h){if((p instanceof T||p instanceof b||p instanceof g)){r.setShowArrow(false);}else{r.setShowArrow(true);}}if(this._oPopover){this._restoreExpansionDefaults();this._oPopover.openBy(o);}return this;};M.prototype.close=function(){if(this._oPopover){this._oPopover.close();}return this;};M.prototype.isOpen=function(){return this._oPopover.isOpen();};M.prototype.toggle=function(o){if(this.isOpen()){this.close();}else{this.openBy(o);}return this;};M.prototype.setPlacement=function(p){this.setProperty("placement",p,true);this._oPopover.setPlacement(p);return this;};M.prototype.getDomRef=function(s){return this._oPopover&&this._oPopover.getAggregation("_popup").getDomRef(s);};["addStyleClass","removeStyleClass","toggleStyleClass","hasStyleClass"].forEach(function(n){M.prototype[n]=function(){if(this._oPopover&&this._oPopover[n]){var r=this._oPopover[n].apply(this._oPopover,arguments);return r===this._oPopover?this:r;}};});["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(F){M.prototype["_"+F+"Old"]=M.prototype[F];M.prototype[F]=function(){var r=M.prototype["_"+F+"Old"].apply(this,arguments);this._bItemsChanged=true;if(this._oPopover){this._oPopover.invalidate();}if(["removeAggregation","removeAllAggregation"].indexOf(F)!==-1){return r;}return this;};});return M;},true);
