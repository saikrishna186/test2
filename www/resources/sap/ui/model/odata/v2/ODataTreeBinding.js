/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/TreeBinding','sap/ui/model/odata/CountMode','sap/ui/model/ChangeReason','sap/ui/model/Sorter','sap/ui/model/odata/ODataUtils','sap/ui/model/TreeBindingUtils','sap/ui/model/odata/OperationMode','sap/ui/model/SorterProcessor','sap/ui/model/FilterProcessor','sap/ui/model/FilterType'],function(q,T,C,a,S,O,b,c,d,F,e){"use strict";var f=T.extend("sap.ui.model.odata.v2.ODataTreeBinding",{constructor:function(m,p,o,A,P,s){T.apply(this,arguments);this.mParameters=this.mParameters||P||{};this.sGroupId;this.sRefreshGroupId;this.oFinalLengths={};this.oLengths={};this.oKeys={};this.bNeedsUpdate=false;this._bRootMissing=false;this.aSorters=s||[];this.sFilterParams="";if(A instanceof sap.ui.model.Filter){A=[A];}this.aApplicationFilters=A;this.mRequestHandles={};this.oRootContext=null;this.iNumberOfExpandedLevels=(P&&P.numberOfExpandedLevels)||0;this.iRootLevel=(P&&P.rootLevel)||0;this.sCountMode=(P&&P.countMode)||this.oModel.sDefaultCountMode;if(this.sCountMode==C.None){q.log.fatal("To use an ODataTreeBinding at least one CountMode must be supported by the service!");}if(P){this.sBatchGroupId=P.groupId||P.batchGroupId;}this.bInitial=true;this._mLoadedSections={};this._iPageSize=0;this.sOperationMode=(P&&P.operationMode)||this.oModel.sDefaultOperationMode;this.bClientOperation=false;switch(this.sOperationMode){case c.Server:this.bClientOperation=false;break;case c.Client:this.bClientOperation=true;break;case c.Auto:this.bClientOperation=false;break;}this.iThreshold=(P&&P.threshold)||0;this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bUseServersideApplicationFilters=(P&&P.useServersideApplicationFilters)||false;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null;}});f.DRILLSTATES={Collapsed:"collapsed",Expanded:"expanded",Leaf:"leaf"};f.prototype._getNodeFilterParams=function(p){var P=p.isRoot?this.oTreeProperties["hierarchy-node-for"]:this.oTreeProperties["hierarchy-parent-node-for"];var E=this._getEntityType();return O._createFilterParams([new sap.ui.model.Filter(P,"EQ",p.id)],this.oModel.oMetadata,E);};f.prototype._getLevelFilterParams=function(o,l){var E=this._getEntityType();return O._createFilterParams([new sap.ui.model.Filter(this.oTreeProperties["hierarchy-level-for"],o,l)],this.oModel.oMetadata,E);};f.prototype._loadSingleRootNodeByNavigationProperties=function(n,r){var t=this,g;if(this.mRequestHandles[r]){this.mRequestHandles[r].abort();}g=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[r]=this.oModel.read(n,{groupId:g,success:function(D){var N=t._getNavPath(t.getPath());if(D){var E=D;var k=t.oModel._getKey(E);var o=t.oModel.getContext('/'+k);t.oRootContext=o;t._processODataObject(o.getObject(),n,N);}else{t._bRootMissing=true;}t.bNeedsUpdate=true;delete t.mRequestHandles[r];t.fireDataReceived({data:D});},error:function(E){if(E&&E.statusCode!=0&&E.statusText!="abort"){t.bNeedsUpdate=true;t._bRootMissing=true;delete t.mRequestHandles[r];t.fireDataReceived();}}});};f.prototype.getRootContexts=function(s,l,t){var n=null,r={numberOfExpandedLevels:this.iNumberOfExpandedLevels},R=[];if(this.isInitial()){return R;}s=s||0;l=l||this.oModel.sizeLimit;t=t||0;var g=""+n+"-"+s+"-"+this._iPageSize+"-"+t;if(this.bHasTreeAnnotations){this.bDisplayRootNode=true;R=this._getContextsForNodeId(null,s,l,t);}else{n=this.oModel.resolve(this.getPath(),this.getContext());var i=this.oModel.isList(this.sPath,this.getContext());if(i){this.bDisplayRootNode=true;}if(this.bDisplayRootNode&&!i){if(this.oRootContext){return[this.oRootContext];}else if(this._bRootMissing){return[];}else{this._loadSingleRootNodeByNavigationProperties(n,g);}}else{r.navPath=this._getNavPath(this.getPath());if(!this.bDisplayRootNode){n+="/"+r.navPath;}R=this._getContextsForNodeId(n,s,l,t,r);}}return R;};f.prototype.getNodeContexts=function(o,s,l,t){var n,r={};if(this.isInitial()){return[];}if(this.bHasTreeAnnotations){n=this.oModel.getKey(o);r.level=parseInt(o.getProperty(this.oTreeProperties["hierarchy-level-for"]),10)+1;}else{var N=this._getNavPath(o.getPath());if(!N){return[];}n=this.oModel.resolve(N,o);r.navPath=this.oNavigationPaths[N];}return this._getContextsForNodeId(n,s,l,t,r);};f.prototype.hasChildren=function(o){if(this.bHasTreeAnnotations){if(!o){return false;}var D=o.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);var n=this.oModel.getKey(o);var l=this.oLengths[n];if(l===0&&this.oFinalLengths[n]){return false;}if(D==="expanded"||D==="collapsed"){return true;}else if(D==="leaf"){return false;}else{q.sap.log.warning("The entity '"+o.getPath()+"' has not specified Drilldown State property value.");if(D===undefined||D===""){return true;}return false;}}else{if(!o){return this.oLengths[this.getPath()]>0;}var l=this.oLengths[o.getPath()+"/"+this._getNavPath(o.getPath())];return l!==0;}};f.prototype.getChildCount=function(o){if(this.bHasTreeAnnotations){var h;if(!o){h=null;}else{h=this.oModel.getKey(o);}return this.oLengths[h];}else{if(!o){if(!this.bDisplayRootNode){return this.oLengths[this.getPath()+"/"+this._getNavPath(this.getPath())];}else{return this.oLengths[this.getPath()];}}return this.oLengths[o.getPath()+"/"+this._getNavPath(o.getPath())];}};f.prototype._getContextsForNodeId=function(n,s,l,t,r){var g=[],k;if(this.sOperationMode==c.Auto){if(this.iTotalCollectionCount==null){if(!this.bCollectionCountRequested){this._getCountForCollection();this.bCollectionCountRequested=true;}return[];}}s=s||0;l=l||this.oModel.iSizeLimit;t=t||0;if(this.sOperationMode==c.Auto){if(this.iThreshold>=0){t=Math.max(this.iThreshold,t);}}if(!this._mLoadedSections[n]){this._mLoadedSections[n]=[];}if(this.oFinalLengths[n]&&this.oLengths[n]<s+l){l=Math.max(this.oLengths[n]-s,0);}var h=this;var j=function(s){for(var i=0;i<h._mLoadedSections[n].length;i++){var A=h._mLoadedSections[n][i];if(s>=A.startIndex&&s<A.startIndex+A.length){return true;}}};var m=[];var i=Math.max((s-t-this._iPageSize),0);if(this.oKeys[n]){var M=s+l+(t);if(this.oLengths[n]){M=Math.min(M,this.oLengths[n]);}for(i;i<M;i++){k=this.oKeys[n][i];if(!k){if(!this.bClientOperation&&!j(i)){m=b.mergeSections(m,{startIndex:i,length:1});}}if(i>=s&&i<s+l){if(k){g.push(this.oModel.getContext('/'+k));}else{g.push(undefined);}}}var B=Math.max((s-t-this._iPageSize),0);var E=s+l+(t);var o=m[0]&&m[0].startIndex===B&&m[0].startIndex+m[0].length===E;if(m.length>0&&!o){i=Math.max((m[0].startIndex-t-this._iPageSize),0);var p=m[0].startIndex;for(i;i<p;i++){var k=this.oKeys[n][i];if(!k){if(!j(i)){m=b.mergeSections(m,{startIndex:i,length:1});}}}i=m[m.length-1].startIndex+m[m.length-1].length;var u=i+t+this._iPageSize;if(this.oLengths[n]){u=Math.min(u,this.oLengths[n]);}for(i;i<u;i++){var k=this.oKeys[n][i];if(!k){if(!j(i)){m=b.mergeSections(m,{startIndex:i,length:1});}}}}}else{if(!j(s)){var L=s-i;m=b.mergeSections(m,{startIndex:i,length:l+L+t});}}if(this.oModel.getServiceMetadata()){if(m.length>0){var P=[];var v="";if(this.bHasTreeAnnotations){if(this.sOperationMode=="Server"||this.bUseServersideApplicationFilters){v=this.getFilterParams();}if(n){v=v?"%20and%20"+v:"";var N=this.oModel.getContext("/"+n);var w=N.getProperty(this.oTreeProperties["hierarchy-node-for"]);var x=this._getNodeFilterParams({id:w});P.push("$filter="+x+v);}else if(n==null){var y="";if(!this.bClientOperation||this.iRootLevel>0){var z=this.bClientOperation?"GE":"EQ";y=this._getLevelFilterParams(z,this.iRootLevel);}if(y||v){if(v&&y){v="%20and%20"+v;}P.push("$filter="+y+v);}}}else{v=this.getFilterParams();if(v){P.push("$filter="+v);}}if(this.sCustomParams){P.push(this.sCustomParams);}if(!this.bClientOperation){for(i=0;i<m.length;i++){var R=m[i];this._mLoadedSections[n]=b.mergeSections(this._mLoadedSections[n],{startIndex:R.startIndex,length:R.length});this._loadSubNodes(n,R.startIndex,R.length,0,P,r,R);}}else{if(!this.oAllKeys&&!this.mRequestHandles[f.REQUEST_KEY_CLIENT]){this._loadCompleteTreeWithAnnotations(P);}}}}return g;};f.prototype._getCountForCollection=function(){if(!this.bHasTreeAnnotations||this.sOperationMode!=c.Auto){q.sap.log.error("The Count for the collection can only be retrieved with Hierarchy Annotations and in OperationMode.Auto.");return;}var p=[];function _(D){var i=D.__count?parseInt(D.__count,10):parseInt(D,10);this.iTotalCollectionCount=i;if(this.sOperationMode==c.Auto){if(this.iTotalCollectionCount<=this.iThreshold){this.bClientOperation=true;this.bThresholdRejected=false;}else{this.bClientOperation=false;this.bThresholdRejected=true;}this._fireChange({reason:a.Change});}}function g(E){if(E&&E.statusCode===0&&E.statusText==="abort"){return;}var i="Request for $count failed: "+E.message;if(E.response){i+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}q.sap.log.warning(i);}var P=this.oModel.resolve(this.getPath(),this.getContext());var l="";if(this.iRootLevel>0){l=this._getLevelFilterParams("GE",this.getRootLevel());}var s="";if(this.bUseServersideApplicationFilters){var s=this.getFilterParams();}if(l||s){if(s&&l){s="%20and%20"+s;}p.push("$filter="+l+s);}var h="";if(this.sCountMode==C.Request||this.sCountMode==C.Both){h="/$count";}else if(this.sCountMode==C.Inline){p.push("$top=0");p.push("$inlinecount=allpages");}if(P){this.oModel.read(P+h,{urlParameters:p,success:_.bind(this),error:g.bind(this),groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId});}};f.prototype._getCountForNodeId=function(n,s,l,t,p){var g=this,G;var P=[];function _(D){g.oFinalLengths[n]=true;g.oLengths[n]=parseInt(D,10);}function h(E){if(E&&E.statusCode===0&&E.statusText==="abort"){return;}var k="Request for $count failed: "+E.message;if(E.response){k+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}q.sap.log.warning(k);}var i;var j=this.getFilterParams()||"";var N="";if(this.bHasTreeAnnotations){var o=this.oModel.getContext("/"+n);var H=o.getProperty(this.oTreeProperties["hierarchy-node-for"]);i=this.oModel.resolve(this.getPath(),this.getContext());if(n!=null){N=this._getNodeFilterParams({id:H});}else{N=this._getLevelFilterParams("EQ",this.getRootLevel());}}else{i=n;}if(N||j){var A="";if(N&&j){A="%20and%20";}j="$filter="+j+A+N;P.push(j);}if(i){G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.oModel.read(i+"/$count",{urlParameters:P,success:_,error:h,sorters:this.aSorters,groupId:G});}};f.prototype._loadSubNodes=function(n,s,l,t,p,P,r){var g=this,G,I=false;if((s||l)&&!this.bClientOperation){p.push("$skip="+s+"&$top="+(l+t));}if(!this.oFinalLengths[n]){if(this.sCountMode==C.Inline||this.sCountMode==C.Both){p.push("$inlinecount=allpages");I=true;}else if(this.sCountMode==C.Request){g._getCountForNodeId(n);}}var R=""+n+"-"+s+"-"+this._iPageSize+"-"+t;function h(D){if(D){g.oKeys[n]=g.oKeys[n]||[];if(I&&D.__count>=0){g.oLengths[n]=parseInt(D.__count,10);g.oFinalLengths[n]=true;}}if(q.isArray(D.results)&&D.results.length>0){if(g.bHasTreeAnnotations){var L={};for(var i=0;i<D.results.length;i++){var o=D.results[i];if(i==0){L[n]=s;}else if(L[n]==undefined){L[n]=0;}g.oKeys[n][L[n]]=g.oModel._getKey(o);L[n]++;}}else{for(var i=0;i<D.results.length;i++){var o=D.results[i];var k=g.oModel._getKey(o);g._processODataObject(o,"/"+k,P.navPath);g.oKeys[n][i+s]=k;}}}else if(D&&!q.isArray(D.results)){g.oKeys[null]=g.oModel._getKey(D);if(!g.bHasTreeAnnotations){g._processODataObject(D,n,P.navPath);}}g.oRequestHandle=null;delete g.mRequestHandles[R];g.bNeedsUpdate=true;g.fireDataReceived({data:D});}function E(o){if(o&&o.statusCode===0&&o.statusText==="abort"){return;}g.oRequestHandle=null;delete g.mRequestHandles[R];g.fireDataReceived();if(r){var L=[];for(var i=0;i<g._mLoadedSections[n].length;i++){var j=g._mLoadedSections[n][i];if(r.startIndex>=j.startIndex&&r.startIndex+r.length<=j.startIndex+j.length){if(r.startIndex!==j.startIndex&&r.length!==j.length){L=b.mergeSections(L,{startIndex:j.startIndex,length:r.startIndex-j.startIndex});L=b.mergeSections(L,{startIndex:r.startIndex+r.length,length:(j.startIndex+j.length)-(r.startIndex+r.length)});}}else{L.push(j);}}g._mLoadedSections[n]=L;}}if(n!==undefined){this.fireDataRequested();var A;if(this.bHasTreeAnnotations){A=this.oModel.resolve(this.getPath(),this.getContext());}else{A=n;}if(this.mRequestHandles[R]){this.mRequestHandles[R].abort();}G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[R]=this.oModel.read(A,{urlParameters:p,success:h,error:E,sorters:this.aSorters,groupId:G});}};f.REQUEST_KEY_CLIENT="_OPERATIONMODE_CLIENT_TREE_LOADING";f.prototype._loadCompleteTreeWithAnnotations=function(u){var t=this;var r=f.REQUEST_KEY_CLIENT;var s=function(D){if(D.results&&D.results.length>0){var p={};var o;for(var k=0;k<D.results.length;k++){o=D.results[k];var g=o[t.oTreeProperties["hierarchy-node-for"]];if(p[g]){q.sap.log.warning("ODataTreeBinding - Duplicate data entry for key: "+g+"!");}p[g]=t.oModel._getKey(o);}for(var i=0;i<D.results.length;i++){o=D.results[i];var P=o[t.oTreeProperties["hierarchy-parent-node-for"]];var h=p[P];if(parseInt(o[t.oTreeProperties["hierarchy-level-for"]],10)===t.iRootLevel){h="null";}t.oKeys[h]=t.oKeys[h]||[];var K=t.oModel._getKey(o);t.oKeys[h].push(K);t.oLengths[h]=t.oLengths[h]||0;t.oLengths[h]++;t.oFinalLengths[h]=true;t._mLoadedSections[h]=t._mLoadedSections[h]||[];t._mLoadedSections[h][0]=t._mLoadedSections[h][0]||{startIndex:0,length:0};t._mLoadedSections[h][0].length++;}}else{t.oKeys["null"]=[];t.oLengths["null"]=0;t.oFinalLengths["null"]=true;}t.oAllKeys=q.extend(true,{},t.oKeys);t.oAllLengths=q.extend(true,{},t.oLengths);t.oAllFinalLengths=q.extend(true,{},t.oFinalLengths);delete t.mRequestHandles[r];t.bNeedsUpdate=true;if((t.aApplicationFilters&&t.aApplicationFilters.length>0)||(t.aFilters&&t.aFilters.length>0)){t._applyFilter();}if(t.aSorters&&t.aSorters.length>0){t._applySort();}t.fireDataReceived({data:D});};var E=function(o){delete t.mRequestHandles[r];var A=o.statusCode==0;if(!A){t.oKeys={};t.oLengths={};t.oFinalLengths={};t.oAllKeys={};t.oAllLengths={};t.oAllFinalLengths={};t._fireChange({reason:a.Change});}t.fireDataReceived();};this.fireDataRequested();if(this.mRequestHandles[r]){this.mRequestHandles[r].abort();}this.mRequestHandles[r]=this.oModel.read(this.getPath(),{urlParameters:u,success:s,error:E,sorters:this.aSorters});};f.prototype.resetData=function(o){if(o){var p=o.getPath();delete this.oKeys[p];delete this.oLengths[p];delete this.oFinalLengths[p];delete this._mLoadedSections[p];}else{this.oKeys={};this.bClientOperation=false;switch(this.sOperationMode){case c.Server:this.bClientOperation=false;break;case c.Client:this.bClientOperation=true;break;case c.Auto:this.bClientOperation=false;break;}this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bCollectionCountRequested=false;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null;this.oLengths={};this.oFinalLengths={};this.oRootContext=null;this._bRootMissing=false;q.each(this.mRequestHandles,function(r,R){if(R){R.abort();}});this.mRequestHandles={};this._mLoadedSections={};this._iPageSize=0;this.sFilterParams="";}};f.prototype.refresh=function(g,G){if(typeof g==="string"){G=g;}this.sRefreshGroup=G;this._refresh(g);this.sRefreshGroup=undefined;};f.prototype._refresh=function(g,m,E){var h=false;if(!g){if(E){var r=this.oModel.resolve(this.sPath,this.oContext);if(r.indexOf("?")!==-1){r=r.split("?")[0];}var o=this.oModel.oMetadata._getEntityTypeByPath(r);if(o&&(o.entityType in E)){h=true;}}if(m&&!h){q.each(this.oKeys,function(i,n){q.each(n,function(i,k){if(k in m){h=true;return false;}});if(h){return false;}});}if(!m&&!E){h=true;}}if(g||h){this.resetData();this.bNeedsUpdate=false;this.bRefresh=true;this._fireRefresh({reason:a.Refresh});}};f.prototype.filter=function(g,s,r){var h=false;s=s||e.Control;if(s==e.Control&&(!this.bClientOperation||this.sOperationMode==c.Server)){q.sap.log.warning("Filtering with ControlFilters is ONLY possible if the ODataTreeBinding is running in OperationMode.Client or "+"OperationMode.Auto, in case the given threshold is lower than the total number of tree nodes.");return;}if(!g){g=[];}if(g instanceof sap.ui.model.Filter){g=[g];}if(s===e.Control){this.aFilters=g;}else{this.aApplicationFilters=g;}if(!this.bInitial){if(this.bClientOperation&&(s===e.Control||(s===e.Application&&!this.bUseServersideApplicationFilters))){if(this.oAllKeys){this.oKeys=q.extend(true,{},this.oAllKeys);this.oLengths=q.extend(true,{},this.oAllLengths);this.oFinalLengths=q.extend(true,{},this.oAllFinalLengths);this._applyFilter();this._applySort();this._fireChange({reason:a.Filter});}else{this.sChangeReason=a.Filter;}}else{this.resetData();this.sChangeReason=a.Filter;this._fireRefresh({reason:this.sChangeReason});}h=true;}if(r){return h;}else{return this;}};f.prototype._applyFilter=function(){var t=this;var A=this.aApplicationFilters||[];var g=this.aFilters||[];if(!this.bUseServersideApplicationFilters){g=g.concat(A);}var h=function(k){var i=F.apply([k],g,function(r,p){var j=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,j);});return i.length>0;};var o={};this._filterRecursive({id:"null"},o,h);this.oKeys=o;if(!this.oKeys["null"]){q.sap.log.warning("Clientside filter did not match on any node!");}else{this.oLengths["null"]=this.oKeys["null"].length;this.oFinalLengths["null"]=true;}};f.prototype._filterRecursive=function(n,k,g){var h=this.oKeys[n.id];if(h){n.children=n.children||[];for(var i=0;i<h.length;i++){var o=this._filterRecursive({id:h[i]},k,g);if(o.isFiltered){k[n.id]=k[n.id]||[];k[n.id].push(o.id);n.children.push(o);}}if(n.children.length>0){n.isFiltered=true;}else{n.isFiltered=g(n.id);}if(n.isFiltered){this.oLengths[n.id]=n.children.length;this.oFinalLengths[n.id]=true;}return n;}else{n.isFiltered=g(n.id);return n;}};f.prototype.sort=function(s,r){var g=false;if(s instanceof S){s=[s];}this.aSorters=s||[];if(!this.bInitial){q.each(this.mRequestHandles,function(R,o){if(o){o.abort();}});if(this.bClientOperation){if(this.oAllKeys){this._applySort();this._fireChange({reason:a.Sort});}else{this.sChangeReason=a.Sort;}}else{this.resetData(undefined,{reason:a.Sort});this.sChangeReason=a.Sort;this._fireRefresh({reason:this.sChangeReason});}g=true;}if(r){return g;}else{return this;}};f.prototype._applySort=function(){var t=this,o;var g=function(k,p){o=t.oModel.getContext('/'+k);return t.oModel.getProperty(p,o);};for(var n in this.oKeys){d.apply(this.oKeys[n],this.aSorters,g);}};f.prototype.checkUpdate=function(g,m){var s=this.sChangeReason?this.sChangeReason:a.Change;var h=false;if(!g){if(this.bNeedsUpdate||!m){h=true;}else{q.each(this.oKeys,function(i,n){q.each(n,function(i,k){if(k in m){h=true;return false;}});if(h){return false;}});}}if(g||h){this.bNeedsUpdate=false;this._fireChange({reason:s});}this.sChangeReason=undefined;};f.prototype._getNavPath=function(p){var A=this.oModel.resolve(p,this.getContext());if(!A){return;}var P=A.split("/"),E=P[P.length-1],n;var s=E.split("(")[0];if(s&&this.oNavigationPaths[s]){n=this.oNavigationPaths[s];}return n;};f.prototype._processODataObject=function(o,p,n){var N=[],t=this;if(n&&n.indexOf("/")>-1){N=n.split("/");n=N[0];N.splice(0,1);}var r=this.oModel._getObject(p);if(q.isArray(r)){this.oKeys[p]=r;this.oLengths[p]=r.length;this.oFinalLengths[p]=true;}else if(r){this.oLengths[p]=1;this.oFinalLengths[p]=true;}if(n&&o[n]){if(q.isArray(r)){q.each(r,function(i,R){var o=t.getModel().getData("/"+R);t._processODataObject(o,"/"+R+"/"+n,N.join("/"));});}else if(typeof r==="object"){t._processODataObject(o,p+"/"+n,N.join("/"));}}};f.prototype._hasTreeAnnotations=function(){var m=this.oModel,M=m.oMetadata,A=m.resolve(this.getPath(),this.getContext()),E,t=M.mNamespaces["sap"],g=this;this.oTreeProperties={"hierarchy-level-for":false,"hierarchy-parent-node-for":false,"hierarchy-node-for":false,"hierarchy-drill-state-for":false};var s=function(){var i=0;var h=0;q.each(g.oTreeProperties,function(p,P){h++;if(P){i+=1;}});if(i===h){return true;}else if(i>0&&i<h){q.sap.log.warning("Incomplete hierarchy tree annotations. Please check your service metadata definition!");}return false;};if(this.mParameters&&this.mParameters.treeAnnotationProperties){this.oTreeProperties["hierarchy-level-for"]=this.mParameters.treeAnnotationProperties.hierarchyLevelFor;this.oTreeProperties["hierarchy-parent-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyParentNodeFor;this.oTreeProperties["hierarchy-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyNodeFor;this.oTreeProperties["hierarchy-drill-state-for"]=this.mParameters.treeAnnotationProperties.hierarchyDrillStateFor;return s();}if(A.indexOf("?")!==-1){A=A.split("?")[0];}E=M._getEntityTypeByPath(A);if(!E){q.sap.log.fatal("EntityType for path "+A+" could not be found.");return false;}q.each(E.property,function(i,p){if(!p.extensions){return true;}q.each(p.extensions,function(i,o){var n=o.name;if(o.namespace===t&&n in g.oTreeProperties&&!g.oTreeProperties[n]){g.oTreeProperties[n]=p.name;}});});return s();};f.prototype.initialize=function(){if(this.oModel.oMetadata&&this.oModel.oMetadata.isLoaded()&&this.bInitial){this.bInitial=false;this.bHasTreeAnnotations=this._hasTreeAnnotations();this._processSelectParameters();this.oEntityType=this._getEntityType();this._fireRefresh({reason:a.Refresh});}return this;};f.prototype._processSelectParameters=function(){if(this.mParameters){this.oNavigationPaths=this.mParameters.navigation;if(this.mParameters.select){var s=this.mParameters.select.split(",");var n=[];if(this.oNavigationPaths){q.each(this.oNavigationPaths,function(p,P){if(q.inArray(P,n)==-1){n.push(P);}});}q.each(n,function(p,P){if(q.inArray(P,s)==-1){s.push(P);}});if(this.bHasTreeAnnotations){q.each(this.oTreeProperties,function(A,t){if(t){if(q.inArray(t,s)==-1){s.push(t);}}});}this.mParameters.select=s.join(",");}this.sCustomParams=this.oModel.createCustomParams(this.mParameters);}if(!this.bHasTreeAnnotations&&!this.oNavigationPaths){q.sap.log.error("Neither navigation paths parameters, nor (complete/valid) tree hierarchy annotations where provided to the TreeBinding.");this.oNavigationPaths={};}};f.prototype.getDownloadUrl=function(s){var p=[],P;if(s){p.push("$format="+encodeURIComponent(s));}if(this.aSorters&&this.aSorters.length>0){p.push(O.createSortParams(this.aSorters));}if(this.getFilterParams()){p.push("$filter="+this.getFilterParams());}if(this.sCustomParams){p.push(this.sCustomParams);}P=this.oModel.resolve(this.sPath,this.oContext);if(P){return this.oModel._createRequestUrl(P,null,p);}};f.prototype.setNumberOfExpandedLevels=function(l){l=l||0;if(l<0){q.sap.log.warning("ODataTreeBinding: numberOfExpandedLevels was set to 0. Negative values are prohibited.");l=0;}this.iNumberOfExpandedLevels=l;this._fireChange();};f.prototype.getNumberOfExpandedLevels=function(){return this.iNumberOfExpandedLevels;};f.prototype.setRootLevel=function(r){r=parseInt(r||0,10);if(r<0){q.sap.log.warning("ODataTreeBinding: rootLevels was set to 0. Negative values are prohibited.");r=0;}this.iRootLevel=r;this.refresh();};f.prototype.getRootLevel=function(){return parseInt(this.iRootLevel,10);};f.prototype._getEntityType=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var E=this.oModel.oMetadata._getEntityTypeByPath(r);return E;}return undefined;};f.prototype.getFilterParams=function(){if(this.aApplicationFilters){this.aApplicationFilters=q.isArray(this.aApplicationFilters)?this.aApplicationFilters:[this.aApplicationFilters];if(this.aApplicationFilters.length>0&&!this.sFilterParams){this.sFilterParams=O._createFilterParams(this.aApplicationFilters,this.oModel.oMetadata,this.oEntityType);this.sFilterParams=this.sFilterParams?this.sFilterParams:"";}}else{this.sFilterParams="";}return this.sFilterParams;};return f;});
