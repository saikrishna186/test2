jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.WheelProfileWO", {

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
			var oModel = new sap.ui.model.json.JSONModel({FlangeCheckbox : false , workOrder : "" ,carNum : "",setNum :"" ,date : new Date(),wheelsData:[]});
			this.getView().setModel(oModel);
		//	this.oRouter.getTarget("WheelProfileWO").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},
		
		handleRouteMatched: function(oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var workOrder = oArguments.contextPath;			
			this.getWorkOrderDetails(workOrder);

		},
		
		pressPostMeasurements  : function() {
			var controller = this ;
              var viewModel = this.getView().getModel();
			var viewData = viewModel .getData();
			if(viewData.radio == 0){
				if(viewData.FlangeMeasurement == ""){
					jQuery.sap.require("sap.m.MessageBox");
				     sap.m.MessageBox.show(
				      " Please provide Flang  reading before submitting", {
				         icon: sap.m.MessageBox.Icon.ERROR,
				         title: " Empty Readings",
				       actions: [sap.m.MessageBox.Action.OK],
				       onClose: function(oAction){
				       if(oAction === sap.m.MessageBox.Action.OK){
					
				       }}
				}
				)
					
					
				}
			}
			
			 var emptyCount = 0 ;
				for(var i = 0 ; i< viewData.wheelsData.length ; i++){
		if(viewData.wheelsData[i].PreTurnMeasurement == "" &&  (viewData.wheelsData[i].PostTurnMeasurement == "" && viewData.wheelsData[i].RadialMeasurement == "")){
			emptyCount++;
			/*viewData.wheelsData[i].UiPurpose2 = "Error";
			viewData.wheelsData[i].UiPurpose4 = "Error";
			viewData.wheelsData[i].UiPurpose3 = "Please provide valid value";
			viewData.wheelsData[i].UiPurpose5 = "Please provide valid value";*/
			
			
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
			  payload.FlangeCheckbox = viewData.FlangeCheckbox;
		       payload.WheelProfile = "X";
			  payload.WheelView = viewData.wheelsData[0].WheelView;
			var dummyArr = [];
			var dummyDefectArr = [];
			for (var i = 0 ; i < viewData.wheelsData.length ; i++){
					dummyArr.push({
						Equipment:viewData.wheelsData[i].Equipment, 
						EquipmentObject:viewData.wheelsData[i].EquipmentObject, 
						WheelNumber:viewData.wheelsData[i].WheelNumber , 
						WheelPosition : viewData.wheelsData[i].WheelPosition, 
						FlangeMeasurement: viewData.FlangeMeasurement, 
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
		
		
		
		
		pressWorkOrderList: function() {
			sap.ui.core.UIComponent.hideMaster("MasterWOList");
		},
			pressCancelButton: function(oEvent) {
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
			onNavBack: function() {
			history.go(-1);
		},

		
		
		settingViewModel :function (detailData){	
			var headerData = detailData.results[0];
			this.setViewHeaderData(headerData);
			this.setTableItems(detailData.results);
			
		},
		setViewHeaderData :function(headerData){
			var vModel = this.getView().getModel();
			var vData = this.getView().getModel().getData();
			vData.workOrder = headerData.WorkOrder;
			vData.carNum = headerData.CarId;
			vData.setNum = headerData.SetId;
			vData.Boggie = "Boggie series \n Boggie serial \n Wheel set serial";
			vData.radio = -1;
			vData.flangVisible = false ;
			vData.FlangeMeasurement = "";
			vData.FlangeCheckbox = "";
			
		//	vData.FlangeCheckbox = headerData.FlangeCheckbox;
			vModel.setData(vData);
		},
		setTableItems :function (allData){
			var vModel = this.getView().getModel();
			var vData = this.getView().getModel().getData();
			vData.wheelsData = allData;
			vData.wheelsData.sort(function(a, b) {
                return parseFloat(a.WheelNumber) - parseFloat(b.WheelNumber);
                                             });
			for (var i = 0; i < vData.wheelsData.length ; i++){
				vData.wheelsData[i].valueStatePre = "None";
				vData.wheelsData[i].valueStatePost = "None";
				vData.wheelsData[i].valueStateRad = "None"; 
				vData.wheelsData[i].valueStatePreText = "" ;
				vData.wheelsData[i].valueStatePostText = "" ;
				vData.wheelsData[i].valueStateRadText = "" ;
				
				//vData.wheelsData[i].push({valueStatePre : "None",valueStatePost : "None",valueStateRad : "None" ,valueStatePreText : "",valueStatePostText : "",valueStateRadText : ""});
			}
			vModel.setData(vData);
		},
		
		
		handleRadChange :function (evt){
      	   var radInp = Number(evt.getSource().getValue());
 			var obj = evt.getSource().getBindingContext().getObject();
          if((radInp >= Number(obj.RimMin)) && (radInp <= Number(obj.RimMax))){
				obj.valueStateRad = sap.ui.core.ValueState.None;
				obj.valueStateRadText = "";
          }	
			else{
				obj.valueStateRad = sap.ui.core.ValueState.Warning;
				obj.valueStateRadText = "Valid Value  Range is "+obj.RimMin+" - "+obj.RimMax;
			}
      	   
			},
			
			
			handlePreChange :function (evt){
          	   var preInp = Number(evt.getSource().getValue());
     			var obj = evt.getSource().getBindingContext().getObject();
              if((preInp >= Number(obj.DiameterMin)) && (preInp <= Number(obj.DiameterMax))){
					obj.valueStatePre = sap.ui.core.ValueState.None;
					obj.valueStatePreText = "";
              }	
				else{
					obj.valueStatePre = sap.ui.core.ValueState.Warning;
					obj.valueStatePreText = "Valid Value  Range is "+obj.DiameterMin+" - "+obj.DiameterMax;
				}
          	   
				},
				
				
				handleDateChange : function(evt){
					var inpDate = evt.getSource().getDateValue();
					var today = new Date();
				//	var obj = evt.getSource().getBindingContext().getObject();
					if(inpDate){
					if(inpDate>today){
						/*//obj.ValueStateDate = sap.ui.core.ValueState.Error;
						evt.getSource().setValueState("Error");
			      		 evt.getSource().setValueStateText("Future Dates not Allowed");*/
			      		sap.m.MessageBox.show("Future Dates not Allowed",sap.m.MessageBox.Icon.ERROR," Date Error Information", sap.m.MessageBox.Action.OK, null );
			      		 evt.getSource().setDateValue(today);
						//obj.ValueStateDateTxt = "Future Dates not Allowed";
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
				
				
				
				handlePostChange :function (evt){
	            	   var postInp = Number(evt.getSource().getValue());
	       			var obj = evt.getSource().getBindingContext().getObject();
	                if((postInp >= Number(obj.DiameterMin)) && (postInp <= Number(obj.DiameterMax))){
						obj.valueStatePost = sap.ui.core.ValueState.None;
						obj.valueStatePostText = "";
	                }	
					else{
						obj.valueStatePost = sap.ui.core.ValueState.Warning;
						obj.valueStatePostText = "Valid Value  Range is "+obj.DiameterMin+" - "+obj.DiameterMax;
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
									console.error(error);
								}
									});
						
					},
					
					onSelectinRadioButton :function (oEvent){
						var vModel = this.getView().getModel();
						var vData = this.getView().getModel().getData();
						
						var index = oEvent.getParameters().selectedIndex;
						vData.radio = index ;
						if(index == 0){
							vData.flangVisible = true ;
							vData.FlangeCheckbox = "X" ;
							
						}
						else{
							vData.flangVisible = false ;
							vData.FlangeCheckbox = " "; 
						}
						vModel.refresh();
						
					},
					
					
					
						
					
		
	});
}, /* bExport= */ true);