sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Update", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Ztfnswmfs.view.Update
		 */
		onInit: function() {
			this.firstTime = true;
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			var faultId = "";
			var setId = "";
			this.mFSMsg = this.getOwnerComponent().getModel("mFSMsg");
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");

			this.initData = {
					"setId":"",
					"carId": "",
					"set_car_sap":false
			};
			models.getPopOverModel(this,'ETS_TEMPERATURE',"temperatureModel");	
			models.getPopOverModel(this,'ETS_WEATHER',"weatherModel");		
		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Update") {
				return;
			}
			this.initData.setId = "";
			this.initData.carId = "";
			this.initData.set_car_sap = false;
			this.faultId	= evt.getParameter("arguments").faultId
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			this.getFaultRecord(this,this.faultId);
			this.busyIndicatorCount.close();
			this.setShowMoreOff();
		},
		getPopoverData: function(vController){
			this.setId 	= vController.getView().getModel("faultModel").oData.Setid;
			var filters = [];
			var sFilter;
			var qryFilter = "";

			if(this.setId !== ""){
				qryFilter += "?$filter=(SetId eq '"+this.setId+"')&$format=json";	
			}

			models.getPopOverModel(vController,'ETS_TEMPERATURE',qryFilter,filters,"temperatureModel");	
			models.getPopOverModel(vController,'ETS_WEATHER',qryFilter,filters,"weatherModel");			
		},
		onAfterRendering: function() {
			var controller = this;
			if (this.firstTime) {
				this.getView().byId("temp").ontouchstart = function(){controller.showTemperature(this)}; 
				this.getView().byId("weather").ontouchstart = function(){controller.showWeather(this)};
				this.firstTime = false;
			}
		},
		onPressNavToCreate: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.router.navTo("Create",true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onPressNavToInfo: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.router.navTo("Info",true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onNavBack: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.router.navTo("Search",true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		setShowMoreOff:function(){
			var statusRow = this.getView().byId("statusRow");
			var dateRow = this.getView().byId("dateRow");
			var commentsRow = this.getView().byId("commentsRow");
			var priorityRow = this.getView().byId("priorityRow");
			var cutOutRow = this.getView().byId("cutOutRow");
			var rectifiedRow = this.getView().byId("rectifiedRow");
			var showMore = this.getView().byId("showMore");
			showMore.setState(false);
			statusRow.setVisible(false);
			dateRow.setVisible(false);
			commentsRow.setVisible(false);
			priorityRow.setVisible(false);
			cutOutRow.setVisible(false);
			rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBorder";
		},
		onShowMore: function(oEvent) {
			var statusRow = this.getView().byId("statusRow");
			var dateRow = this.getView().byId("dateRow");
			var commentsRow = this.getView().byId("commentsRow");
			var priorityRow = this.getView().byId("priorityRow");
			var cutOutRow = this.getView().byId("cutOutRow");
			var rectifiedRow = this.getView().byId("rectifiedRow"); 
			if (oEvent.getParameters().state) {
				statusRow.setVisible(true);
				dateRow.setVisible(true);
				commentsRow.setVisible(true);
				priorityRow.setVisible(true);
				cutOutRow.setVisible(true);
				rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBottom";
			} else {
				statusRow.setVisible(false);
				dateRow.setVisible(false);
				commentsRow.setVisible(false);
				priorityRow.setVisible(false);
				cutOutRow.setVisible(false);
				rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBorder";
			}

		},
		getFaultRecord:function(vController,faultId){
			var mainDataModel = vController.getOwnerComponent().getModel("mainDataModel");
			var faultModel = new sap.ui.model.json.JSONModel();
			var mFSMsg = vController.getOwnerComponent().getModel("mFSMsg");

			mainDataModel.read("ETS_FAULT(Qmnum='"+faultId+"',Carid='',Setid='')?$format=json",{
				success: function(data, response) {
					faultModel.setData(data);
					vController.getView().setModel(faultModel,"faultModel");					
					vController.getView().byId("system").data("system",faultModel.oData.SubSystem);
					vController.getView().byId("fltPosition").data("fltPosition",faultModel.oData.Position);
					vController.getView().byId("fltSymptom").data("fltSymptom",faultModel.oData.Qmgrp+"-"+faultModel.oData.Qmcod);
					vController.getView().byId("faultStatus").data("faultStatus",faultModel.oData.FaultSysStat);
					vController.getView().byId("faultSource").data("faultSource",faultModel.oData.FaultSource);
					vController.getView().byId("fltLocation").data("fltLocation",faultModel.oData.FaultLocation);
					vController.getView().byId("reportPhase").data("reportPhase",faultModel.oData.ReportPhase);
					vController.getView().byId("fltPriority").data("fltPriority",faultModel.oData.Priority);
					vController.getView().byId("enggFlag").data("enggFlag",faultModel.oData.EngFlag);
					vController.getView().byId("temp").data("temp",faultModel.oData.Temperature);
					vController.getView().byId("weather").data("weather",faultModel.oData.Weather);

					var userStatus = faultModel.oData.FaultUserStat;
					if(userStatus.indexOf("FCTO") > -1){
						vController.getView().byId("cutOut").setSelected(true);
					}else{
						vController.getView().byId("cutOut").setSelected(false);
					}
					if(userStatus.indexOf("FNBF") > -1){
						vController.getView().byId("nonBlockFlt").setSelected(true);
					}else{
						vController.getView().byId("nonBlockFlt").setSelected(false);
					}
					if(userStatus.indexOf("FFTR") > -1){
						vController.getView().byId("faultRectified").setSelected(true);
					}else{
						vController.getView().byId("faultRectified").setSelected(false);
					}
					vController.initData.setId = faultModel.oData.Setid;
					vController.initData.carId = faultModel.oData.Carid;
					var initModel = new sap.ui.model.json.JSONModel();
					initModel.setData(vController.initData);
					vController.getView().setModel(initModel, "initModel");
					models.checkSetInSAP(vController,initModel);
				},
				error: function(oError) {
					sap.m.MessageToast.show(mFSMsg.getProperty("updateNoFault"));
					this.router.navTo("Search");
				}
			});
		},
		showTemperature: function(oEvent) {
			if (!this._oTemperaturePopover) {
				this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultTemperature", this);
				this._oTemperaturePopover.bindElement("/");
				this.getView().addDependent(this._oTemperaturePopover);
			}
			this._oTemperaturePopover.openBy(oEvent);
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp)
			this._oTemperaturePopover.close();
		},
		showWeather: function(oEvent) {
			if (!this._oWeatherPopover) {
				this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultweather", this);
				this._oWeatherPopover.bindElement("/");
				this.getView().addDependent(this._oWeatherPopover);
			}
			this._oWeatherPopover.openBy(oEvent);
		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather)
			this._oWeatherPopover.close();
		},
		onPressAttachments: function(oEvent){
//			var faultId = this.getView().getModel("faultModel").oData.Qmnum;
			this.router.navTo("Attachment",{
				faultId:this.faultId,
				sapFlag:this.getView().getModel("initModel").oData.set_car_sap
			},true);

		},
		onPressUpdate:function(oEvent){
			var faultModel = this.getView().getModel("faultModel").oData;

			faultModel.Temperature = this.getView().byId("temp").data("temp");
			faultModel.Weather = this.getView().byId("weather").data("weather");
			faultModel.FftrDesc = (this.getView().byId("faultRectified").getSelected() ?"X" : "");
			console.log("here in update");
			var carSetArr =[]
			var carSet = {
					"CarId" : faultModel.Carid,
					"SetId" : faultModel.Setid
			}
			carSetArr.push(carSet);
			faultModel.NAV_FAULT_CAR = carSetArr;
			models.postNotification(this,faultModel,this.mFSMsg,this.router,"Search");
		},
		onPressMap:function(oEvent){
			oEvent.preventDefault();
			var vController = this;
			if(!vController.busyIndicatorCount){		    
				vController.busyIndicatorCount = new sap.m.BusyDialog()
			}
			vController.busyIndicatorCount.open();
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(
						function(position) {
							var latitude= position.coords.latitude;
							var longitude = position.coords.longitude;
							var tempField = vController.getView().byId("temp");
							var weatherField = vController.getView().byId("weather");
							var weatherData = models.getWeatherServiceData(latitude,longitude);
							if(weatherData.length>0){
								var currentCondition = weatherData[0];
								var currTemp = currentCondition.temp_C;
								var weatherDesc = currentCondition.weatherDesc[0].value;

								if(currTemp < 10){
									tempField.setValue("COLD (<10°C)");
									tempField.data("temp","C")
								}else if(currTemp >= 10 && currTemp <= 35){
									tempField.setValue("AVERAGE (10-35°C)");
									tempField.data("temp","A")								
								}else if(currTemp > 35){
									tempField.setValue("HEAT (>35°C)");
									tempField.data("temp","H")								
								}
								var sepIndex = weatherDesc.indexOf(",");
								if(sepIndex<0){
									sepIndex = weatherDesc.length
								}else{
									sepIndex--;
								}
//								weatherField.setValue(weatherDesc.substr(0,sepIndex));
//								weatherField.data("weather",weatherDesc.substr(0,sepIndex))	

								vController.getView().getModel("faultModel").oData.TempDesc = tempField.getValue();
								vController.getView().getModel("faultModel").oData.Temperature = tempField.data("temp");
//								vController.getView().getModel("faultModel").oData.WeatherDesc = weatherField.getValue();
//								vController.getView().getModel("faultModel").oData.Weather = weatherField.data("weather");
								vController.busyIndicatorCount.close();
							}else{
								vController.busyIndicatorCount.close();
								sap.m.MessageBox.show(vController.mFSMsg.getProperty("weatherServiceError"),{
									icon: vController.mFSMsg.getProperty("popError"), 
									title: vController.mFSMsg.getProperty("popTitleError"), 
									actions: [sap.m.MessageBox.Action.OK], 
									onClose: function(oAction){
										// Do nothing
									}
								});	
							}
						},
						function(err) {
							vController.busyIndicatorCount.close();
							sap.m.MessageBox.show(vController.mFSMsg.getProperty("geoError"),{
								icon: vController.mFSMsg.getProperty("popError"), 
								title: vController.mFSMsg.getProperty("popTitleError"), 
								actions: [sap.m.MessageBox.Action.OK], 
								onClose: function(oAction){
									// Do nothing
								}
							});
						});
			}else{
				vController.busyIndicatorCount.close();
				sap.m.MessageBox.show(vController.mFSMsg.getProperty("geoNotSupported"),{
					icon: vController.mFSMsg.getProperty("popError"), 
					title: vController.mFSMsg.getProperty("popTitleError"), 
					actions: [sap.m.MessageBox.Action.OK], 
					onClose: function(oAction){
						// Do nothing
					}
				});
			}
			return false;
		}
	});
});