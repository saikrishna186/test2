jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.GeneralInspectWO", {

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
			var oModel = new sap.ui.model.json.JSONModel({workOrder : "" ,carNum : "",setNum :"" ,date : new Date(),wheelsData:[],defectTable:[]});
			this.getView().setModel(oModel);
			this.firstSelection = true;
			this.previousSelection ;
			
		},
		handleRouteMatched: function(oEvent) {
			
			var oArguments = oEvent.getParameter("arguments");
			var workOrder = oArguments.contextPath;
			this.getWorkOrderDetails(workOrder);
		},
		
		settingViewModel :function (detailData){			
			
			var headerData = detailData.results[0];
			this.setViewHeaderData(headerData);
			this.setIconTabItems(detailData.results);
		},
		setViewHeaderData :function(headerData){
			var vModel = this.getView().getModel();
			var vData = this.getView().getModel().getData();
			vData.workOrder = headerData.WorkOrder;
			vData.carNum = headerData.CarId;
			vData.setNum = headerData.SetId;
			vData.selectedTab = "-1";
			vData.tabExpanded = false ;
			vData.prevSelectedTab = "";
			vData.postBtnVisible = false;
			vData.selectedTabs = [];
			vData.selectedCount = 0 ;
			vModel.setData(vData);
			vModel.refresh();
			this.firstSelection = true;
			this.previousSelection = "";
		},
		setIconTabItems :function (allData){
			var vModel = this.getView().getModel();
			var vData = this.getView().getModel().getData();
			vData.wheelsData = allData;
			vData.wheelsData.sort(function(a, b) {
                return parseFloat(a.WheelNumber) - parseFloat(b.WheelNumber);
                                             });
			
			for(var i = 0 ; i< vData.wheelsData.length ; i++){	
				vData.wheelsData[i].UiPurpose2 = "None";
				vData.wheelsData[i].UiPurpose3 = "";
				vData.wheelsData[i].UiPurpose4 = "None";
				vData.wheelsData[i].UiPurpose5 = "";
				vData.wheelsData[i].icon = "X";
				vData.wheelsData[i].iconClr = "D";
				vData.wheelsData[i].rimEditable = false;
				vData.wheelsData[i].flangEditable = false;
			this.setDefectModel(vData.wheelsData[i]);
			}
			vModel.setData(vData);
		},
		setDefectModel:function(singleWheelData){
			singleWheelData.DefectperWheel = [];
		},
		
		pressWorkOrderList: function (oEvent) {
			//this.oRouter.getTarget("MasterWOList").hideMaster(jQuery.proxy(this.handleRouteMatched, this));
			this.oRouter.getTarget("MasterWOList").display();
		},
				onNavBack: function() {
			history.go(-1);
		},

		
		pressPostMeasDefToast: function() {
			var controller = this;
			var viewModel = this.getView().getModel();
			var viewData = viewModel .getData();
			var selectedTab = viewData.selectedTab;
			/*var currentFlangReading = viewData.wheelsData[selectedTab-1].FlangeMeasurement;
			var currentRimReading = viewData.wheelsData[selectedTab-1].RimMeasurement;*/
			var emptyCount = 0 ;
				for(var i = 0 ; i< viewData.wheelsData.length ; i++){
		if(viewData.wheelsData[i].FlangeMeasurement =="" &&  viewData.wheelsData[i].RimMeasurement ==""){
			emptyCount++;
			viewData.wheelsData[i].UiPurpose2 = "Error";
			viewData.wheelsData[i].UiPurpose4 = "Error";
			viewData.wheelsData[i].UiPurpose3 = "Please provide valid value";
			viewData.wheelsData[i].UiPurpose5 = "Please provide valid value";
			
			
		}
				}
		
				if(emptyCount>0){
				jQuery.sap.require("sap.m.MessageBox");
			     sap.m.MessageBox.show(
			      " Please provide all readings before submitting", {
			         icon: sap.m.MessageBox.Icon.ERROR,
			         title: emptyCount +" Empty Readings",
			       actions: [sap.m.MessageBox.Action.OK],
			       onClose: function(oAction){
			       if(oAction === sap.m.MessageBox.Action.OK){
				
			       }}
			}
			)
				}
				else{
					controller.preparePayload(viewData);
				}
		
			
		},
			
			preparePayload :function (viewData){
			 var payload = {};
			  payload.NAV_WHEEL_TO_WHEELS = [];
			  payload.FuncLocation = viewData.wheelsData[0].FuncLocation;
			  payload.FlangeCheckbox = viewData.wheelsData[0].FlangeCheckbox;
		       payload.WheelProfile = "";
			  payload.WheelView = viewData.wheelsData[0].WheelView;
			var dummyArr = [];
			var dummyDefectArr = [];
			for (var i = 0 ; i < viewData.wheelsData.length ; i++){
				if(viewData.wheelsData[i].DefectperWheel.length>0){
					//for loop for defects				
					for (var j = 0 ; j < viewData.wheelsData[i].DefectperWheel.length ; j++){
					dummyArr.push({
						Equipment:viewData.wheelsData[i].Equipment, 
						EquipmentObject:viewData.wheelsData[i].EquipmentObject, 
						WheelNumber:viewData.wheelsData[i].WheelNumber , 
						WheelPosition : viewData.wheelsData[i].WheelPosition, 
						FlangeMeasurement: viewData.wheelsData[i].FlangeMeasurement, 
						RimMeasurement : viewData.wheelsData[i].RimMeasurement,
						SetId  : viewData.wheelsData[i].SetId,
						CarId  : viewData.wheelsData[i].CarId,
						PreTurnMeasurement  : viewData.wheelsData[i].PreTurnMeasurement,
						PostTurnMeasurement  : viewData.wheelsData[i].PostTurnMeasurement,
						RadialMeasurement  : viewData.wheelsData[i].RadialMeasurement,
						DefectIndicator  : "X",
						Notification : viewData.wheelsData[i].Notification,
						DefectType : viewData.wheelsData[i].DefectperWheel[j].defectTypeKey,
						DefectClass : viewData.wheelsData[i].DefectperWheel[j].defectClass,
						});
				}
				}
				else{
					dummyArr.push({
						Equipment:viewData.wheelsData[i].Equipment, 
						EquipmentObject:viewData.wheelsData[i].EquipmentObject, 
						WheelNumber:viewData.wheelsData[i].WheelNumber , 
						WheelPosition : viewData.wheelsData[i].WheelPosition, 
						FlangeMeasurement: viewData.wheelsData[i].FlangeMeasurement, 
						RimMeasurement : viewData.wheelsData[i].RimMeasurement,
						SetId  : viewData.wheelsData[i].SetId,
						CarId  : viewData.wheelsData[i].CarId,
						PreTurnMeasurement  : viewData.wheelsData[i].PreTurnMeasurement,
						PostTurnMeasurement  : viewData.wheelsData[i].PostTurnMeasurement,
						RadialMeasurement  : viewData.wheelsData[i].RadialMeasurement,
						DefectIndicator  : "",
						Notification : viewData.wheelsData[i].Notification,
						DefectType : "",
						DefectClass : "",
						});
				}
			}
			payload.NAV_WHEEL_TO_WHEELS = dummyArr ;
			this.wheelMeasurementPost(payload);
			},
		
		
		wheelMeasurementPost :function (postData){
			
			var controller = this;
			jQuery.sap.require("model.Config");
			var sUrl = model.Config.getServiceUrl();
			if(!this.busyIndicator){
				
				this.busyIndicator = new sap.m.BusyDialog()
			}

		 var modal = this;
	     var oModel =  new sap.ui.model.odata.ODataModel(sUrl, true) ;
	         modal.busyIndicator.open();
	     var formattedData = {"d":postData};
	    
	     oModel.refreshSecurityToken(
	 function(a, b) {
	     oModel.oHeaders = {
	                      "x-csrf-token" : b.headers["x-csrf-token"],
	                       "Content-Type" : "application/json; charset=utf-8",
	                       "accept" : "application/json",
	                       "dataType" : "json",
	                            
	        };
	     oModel.create(model.Config.postWheelMeasurement(),formattedData,{
	               success : function(data, response){
	            	   modal.busyIndicator.close();
	            	   controller.handleMesurePostResponse(data);
	            	//   controller.wheelDefectsPost(postDataDefects);
	            	   },
	               error : function(error){
	            	   modal.busyIndicator.close();
	                      sap.m.MessageBox.show("Measurement Creation Failed",sap.m.MessageBox.Icon.ERROR,"Measurement Information", sap.m.MessageBox.Action.OK, null );
	               }
	        });
	     
	        }, function(a) {
	               successFaultCallBack.apply(context,[a, true]);
	}, true);
			
		},
		
		wheelDefectsPost :function (postDataDefects){
			
			var controller = this;
			jQuery.sap.require("model.Config");
			var sUrl = model.Config.getServiceUrl();
			if(!this.busyIndicator){
				this.busyIndicator = new sap.m.BusyDialog()
			}

		 var modal = this;
	     var oModel =  new sap.ui.model.odata.ODataModel(sUrl, true) ;
	         modal.busyIndicator.open();
	     var formattedDefectData = {"d":postDataDefects};
	     oModel.refreshSecurityToken(
	 function(a, b) {
	     oModel.oHeaders = {
	                      "x-csrf-token" : b.headers["x-csrf-token"],
	                       "Content-Type" : "application/json; charset=utf-8",
	                       "accept" : "application/json",
	                       "dataType" : "json",
	                            
	        };
	     oModel.create(model.Config.postDefects(),formattedDefectData,{
	               success : function(odata, response){
	            	   modal.busyIndicator.close();
	            	   controller.handleDefectPostResponse(odata);
	            	    },
	               error : function(error){
	            	   modal.busyIndicator.close();
	                      sap.m.MessageBox.show("Defects Creation Failed",sap.m.MessageBox.Icon.ERROR,"Measurement Information", sap.m.MessageBox.Action.OK, null );
	               }
	        });
	     
	        }, function(a) {
	               successFaultCallBack.apply(context,[a, true]);
	}, true);
			
		},
		
		
		handleMesurePostResponse:function(wheelResponseData){
			
           var dModel = new sap.ui.model.json.JSONModel();
           dModel.setData({results:wheelResponseData.NAV_WHEEL_TO_WHEELS.results});
      var dialogName = "MeasureResults";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName,
					viewData : model,
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(dModel);
			
		},
		
		handleDefectPostResponse :function(defectResponseData){
			
	           var dModel = new sap.ui.model.json.JSONModel();
	           dModel.setData({results:defectResponseData.NAV_DEFECT_TO_DEFECTS.results});
	      var dialogName = "DefectsResults";
				this.dialogs = this.dialogs || {};
				var dialog = this.dialogs[dialogName];
				var view;
				if (!dialog) {
					view = sap.ui.xmlview({
						viewName: "tfnswequip.tfnswwcm.view." + dialogName,
						viewData : model,
					});
					view._sOwnerId = this.getView()._sOwnerId;
					dialog = view.getContent()[0];
					this.dialogs[dialogName] = dialog;
				}
				dialog.open();
				if (view) {
					dialog.attachAfterOpen(function() {
						dialog.rerender();
					});
				} else {
					view = dialog.getParent();
				}
				view.setModel(dModel);
				
			},
		
		onPressAddDefGenInspec: function(oEvent) {
			var model = this.getView().getModel();
     	   var oData = model.getData();
     	   var selectedKey = oData.selectedTab;
     	   var obj ;
     	  var source = oEvent.getSource();
     	   if(selectedKey != "9"){
     	   obj = oData.wheelsData[selectedKey-1];
     	   }
     	   else{
     		  var bindingContext = source.getBindingContext();
     			obj = bindingContext.getObject();
     	   }
			var cModel = this.getOwnerComponent().getModel("componentModel");
		var cData = cModel.getData();
			///making model for dialog
		
			var dModel = new sap.ui.model.json.JSONModel({WheelNo : "", DefectTypeKey : "", DefectClassKey :" ", DefectClassText : " " ,DefectTypeText : " ",DefectTypeData:[],DefectClassData:[]})
			
			
			var dialogName = "AddDefectGenInspect";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			
	//		
			var diData = dModel.getData(); 
			diData.WheelNo = obj.WheelNumber;
			diData.DefectTypeData = cData.defectType;
			diData.DefectClassData = cData.defectClass;
			dModel.setData(diData);
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName,
					viewData : model,
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(dModel);
		},

		onPressDelDef: function(oEvent) {
			
			var viewModel = this.getView().getModel();
			var viewData = viewModel.getData();
			var selectedKey = viewData.selectedTab;
	     	   var obj ;
	     	  var source = oEvent.getSource();
	     	   if(selectedKey != "9"){
	     	   obj = viewData.wheelsData[selectedKey-1];
	     	   }
	     	   else{
	     		  var bindingContext = oEvent.getParameters().listItem.getBindingContext();
	     		  var WheelNo = bindingContext.getObject().WheelNo;
	     			obj = viewData.wheelsData[WheelNo-1];;
	     	   }
			var wheelDataArr = viewData.wheelsData;
			
			var count = oEvent.getParameters().listItem.getBindingContext().getObject().count;
			
			jQuery.sap.require("sap.m.MessageBox");
		     sap.m.MessageBox.show(
		      " Are you Sure,You Want to Delete This Defect?", {
		         icon: sap.m.MessageBox.Icon.WARNING,
		         title: "Delete Defect",
		       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		       onClose: function(oAction){
		       if(oAction === sap.m.MessageBox.Action.YES){
		    	   for(var j =0; j < obj.DefectperWheel.length ; j++){
						if(obj.DefectperWheel[j].count == count){
							var newTotal = Number(obj.UiPurpose1) - 1;
							obj.UiPurpose1 = newTotal.toString();
							obj.DefectperWheel.splice(j);
						
							break;
						}
					}
		    	  
		    	   for(var k = 0 ; k< viewData.defectTable.length ; k++){
						if((viewData.defectTable[k].WheelNo == obj.WheelNumber) && (viewData.defectTable[k].count == count)) {
							viewData.defectTable.splice(k);
							break;
						}
		    	   }
		    	   
		    	   /// sorting array based on wheel number after delete function
						 wheelDataArr.sort(function(a, b) {
		                       return parseFloat(a.WheelNumber) - parseFloat(b.WheelNumber);
		                                                    });
			         viewModel.refresh();
		    	   
		       }
		       }});
			
		     
		},
		
		dynamicSort : function(property){
			 var sortOrder = 1;
			    if(property[0] === "-") {
			        sortOrder = -1;
			        property = property.substr(1);
			    }
			    return function (a,b) {
			        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			        return result * sortOrder;
			    }	    	 
	     },
		
			onPressCancel: function(oEvent) {
			var dialogName = "CancelDialog";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});
		},
		editDefectDialog: function(oEvent) {
			
			var oModel = this.getOwnerComponent().getModel("componentModel");
			///making model for dialog
			var oData = oModel.getData();
			var dModel = new sap.ui.model.json.JSONModel();
			
			var dialogName = "EditDefectDialogAll";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			
			var obj = bindingContext.getObject();
			var diData = dModel.getData(); 
			diData.WheelNo = obj.WheelNo;
			diData.DefectTypeData = oData.defectType;
			diData.DefectClassData = oData.defectClass;
			diData.count = obj.count;
			diData.defectType = obj.defectType;
			diData.defectClass = obj.defectClass;
			diData.defectTypeKey  =  obj.defectTypeKey  ;
			diData.defectClassText = obj.defectClassText;
			dModel.setData(diData);
			
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName,
					viewData : model,
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(dModel);
		},
		onPressEditDefAll: function(oEvent) {
			
			var oModel = this.getOwnerComponent().getModel("componentModel");
			///making model for dialog
			var oData = oModel.getData();
			var dModel = new sap.ui.model.json.JSONModel();
			var dialogName = "EditDefectDialog";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			var obj = bindingContext.getObject();
			var diData = dModel.getData(); 
			diData.WheelNo = obj.WheelNo;
			diData.DefectTypeData = oData.defectType;
			diData.DefectClassData = oData.defectClass;
			diData.count = obj.count;
			diData.defectType = obj.defectType;
			diData.defectClass = obj.defectClass;
			diData.defectTypeKey  =  obj.defectTypeKey  ;
			diData.defectClassText = obj.defectClassText;
			dModel.setData(diData);
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName,
					viewData : model,
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(dModel);
				},
				
               handleRimChange :function (oEvent){
            	   var rimInp = Number(oEvent.getSource().getValue());
            	   var model = this.getView().getModel();
            	   var oData = model.getData();
            	   var selectedKey = oData.selectedTab;
            	   var obj ;
              	  var source = oEvent.getSource();
              	   if(selectedKey != "9"){
              	   obj = oData.wheelsData[selectedKey-1];
              	   }
              	   else{
              		  var bindingContext = source.getBindingContext();
              			obj = bindingContext.getObject();
              			if(obj.RimMeasurement!="" && obj.FlangeMeasurement!=""){
              				obj.icon = "A";
              				obj.iconClr = "P";
              			//	alert("both");
              			}
              	   }
                if((rimInp >= Number(obj.RimMin)) && (rimInp <= Number(obj.RimMax))){
					obj.UiPurpose2 = sap.ui.core.ValueState.None;
					obj.UiPurpose3 = "";
                }	
				else{
					obj.UiPurpose2 = sap.ui.core.ValueState.Warning;
					obj.UiPurpose3 = "Valid Value  Range is "+obj.RimMin+" - "+obj.RimMax;
				}
                model.refresh();
                
				},
				handleFlangeChange:function (oEvent){
					
					var flaInp = Number(oEvent.getSource().getValue());
	            	    var model = this.getView().getModel();
	            	   var oData = model.getData();
	            	   var selectedKey = oData.selectedTab;var obj ;
	               	  var source = oEvent.getSource();
	              	   if(selectedKey != "9"){
	              	   obj = oData.wheelsData[selectedKey-1];
	              	   }
	              	   else{
	              		  var bindingContext = source.getBindingContext();
	              			obj = bindingContext.getObject();
	              			if(obj.RimMeasurement!="" && obj.FlangeMeasurement!=""){
	              				obj.icon = "A";
	              				obj.iconClr = "P";
	              			}
	              	   }
	                if((flaInp >= Number(obj.FlangeMin)) && (flaInp <= Number(obj.FlangeMax))){
						obj.UiPurpose4 = sap.ui.core.ValueState.None;
						obj.UiPurpose5 = "";
	                }	
					else{
						obj.UiPurpose4 = sap.ui.core.ValueState.Warning;
						obj.UiPurpose5 = "Valid Value  Range is "+obj.FlangeMin+" - "+obj.FlangeMax;
					}
				},
				
				handleDateChange : function(evt){
					var inpDate = evt.getSource().getDateValue();
					var today = new Date();
				
					if(inpDate){
					if(inpDate>today){
			      		sap.m.MessageBox.show("Future Dates not Allowed",sap.m.MessageBox.Icon.ERROR," Date Error Information", sap.m.MessageBox.Action.OK, null );
			      		 evt.getSource().setDateValue(today);
						
					}
					else{
						//obj.ValueStateDate = sap.ui.core.ValueState.None;
						//obj.ValueStateDateTxt = "";
						evt.getSource().setValueState("None");
						evt.getSource().setValueStateText("");
					}
					}
					else{
						
						if(!inpDate || inpDate == " "){
						//	obj.ValueStateDate = sap.ui.core.ValueState.Error;
						//	obj.ValueStateDateTxt = "Not Valid Date";
						evt.getSource().setValueState("Error");
			      		 evt.getSource().setValueStateText("Not Valid Date");
						}
						
					}
					
				},
				
				
				getWorkOrderDetails : function (workOrder){
					var controller = this;
					// Create an OData model for the service
					sap.ui.core.BusyIndicator.show();
					jQuery.sap.require("model.Config");
					var sUrl = model.Config.getServiceUrl();
					// var workOrder = window.location.hash.substr(1);
					 var oServiceModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					 oServiceModel.read(model.Config.getWODetailPath(workOrder),{			
							success: function(odata,response){
								sap.ui.core.BusyIndicator.hide();
								if(odata.results.length == 0){
									jQuery.sap.require("sap.m.MessageBox");
							     sap.m.MessageBox.show(
							      " No Data Found For Selected Work Order,Please Select Another Work Order", {
							         icon: sap.m.MessageBox.Icon.ERROR,
							         title: "Data Error",
							       actions: [sap.m.MessageBox.Action.OK],
							       onClose: function(oAction){
							       if(oAction === sap.m.MessageBox.Action.OK){
									
							       }}});
								}
								else{
								controller.settingViewModel(odata);
								}
							
							},
							error: function(error){
								sap.ui.core.BusyIndicator.hide();
								
							}
								});
					
				},
				
				onAfterRendering: function () {
					// this.byId("customRow").attachBrowserEvent("click", handleCarTableSelectionChange);
				
				},
				
			
				onPressEditTable : function(oEvent){
					
					var mainModel = this.getView().getModel();
					var vData = mainModel.getData();
					
					for(var i = 0 ; i< vData.wheelsData.length ; i++){	
						if(oEvent.getSource().getPressed()){
						vData.wheelsData[i].rimEditable = true;
						vData.wheelsData[i].flangEditable = true;
						}
						else{
							vData.wheelsData[i].rimEditable = false;
							vData.wheelsData[i].flangEditable = false;
						}
					}
					mainModel.refresh();
					
					
				},
				
				handleTabSelect : function (oEvent){
					
					var model = oEvent.getSource().getModel();
					var oData = oEvent.getSource().getModel().getData();
					var selectedTab = oEvent.getParameters().selectedKey;
					var controller = this;
					var source = oEvent.getSource();
				 var arrPostion ;
					if(this.firstSelection ){
					oData.prevSelectedTab = selectedTab;
					this.firstSelection = false;
					if (selectedTab!=9){
					oData.selectedTabs.push(selectedTab);
					oData.selectedCount ++;
					}
					else{
						oData.postBtnVisible = true;
					}
										}
					else {
						if (oData.selectedCount == 7 || selectedTab ==9 ){
							oData.postBtnVisible =true;
							
						}
						
						if(oData.prevSelectedTab != "9"){
							if(selectedTab ==9){
						
							}
				
						var view;
						var dialogName = "SaveDialog";
						this.dialogs = this.dialogs || {};
						var dialog = this.dialogs[dialogName];
						if (!dialog) {
							view = sap.ui.xmlview({
								viewName: "tfnswequip.tfnswwcm.view." + dialogName,
								viewData : model,
							});
							view._sOwnerId = this.getView()._sOwnerId;
							view.data("source",source);
							dialog = view.getContent()[0];
							this.dialogs[dialogName] = dialog;
						}
						dialog.open();
						if (view) {
							dialog.attachAfterOpen(function() {
								dialog.rerender();
							});
						} else {
							view = dialog.getParent();
						}
						
					}
					}
				},
				
	});
}, /* bExport= */ true);