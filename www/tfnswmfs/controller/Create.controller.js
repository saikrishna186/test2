sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tfnswmfs.webapp.view.Create
		 */
		onInit: function() {
			this.firstTime = true;
			this.mFSMsg 	= this.getOwnerComponent().getModel("mFSMsg");
			this.faultModel = new sap.ui.model.json.JSONModel();
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.initData = {
					"setId":"",
					"carId": "",
					"set_car_sap":false
			};
			var initModel = new sap.ui.model.json.JSONModel();
			initModel.setData(this.initData);
			this.getView().setModel(initModel, "initModel");
			this.loadInitPopOverData(this);
			this.getSymptomsList(this);
			models.initWarningMsg(this,this.getView().byId("messageBar"));

		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Create") {
				return;
			}
//			var newFaultModel = new sap.ui.model.json.JSONModel();
//			this.faultModel = newFaultModel;
//			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
//			var valueHelpData = valueHelpModel.oData;
//			var currentdate = new Date();
//			this.faultModel.setData(models.getEmptyFaultStructure());
//			this.faultModel.oData.FaultDate = currentdate;
//			this.faultModel.oData.FaultTime = (currentdate.getHours() + ":" + currentdate.getMinutes());
//			this.getView().setModel(this.faultModel, "faultModel");

			var vController = this;
			if (this.firstTime) {
				this.getView().byId("faultSource").ontouchstart = function(){vController.showFaultSource(this)};
				this.getView().byId("auditType").ontouchstart = function(){vController.showAuditType(this)};
				this.getView().byId("majorSystem").ontouchstart = function(){vController.showMajorSystem(this)};
				this.getView().byId("subSystem").ontouchstart = function(){vController.showSubSystem(this)};
				this.getView().byId("reportPhase").ontouchstart = function(){vController.showReportPhase(this)};
				this.getView().byId("fltSymptom").ontouchstart = function(){vController.showFaultSymptom(this)};
				this.getView().byId("fltPosition").ontouchstart = function(){vController.showPosition(this)};
				this.getView().byId("temp").ontouchstart = function(){vController.showTemperature(this)};
				this.getView().byId("weather").ontouchstart = function(){vController.showWeather(this)};			
				this.firstTime = false;
			}
//			this.toggleSearchFieldRows(false);
//			this.toggleFormFieldRows(false);
//			// Set it to deafult when coming to create screen 2nd time.
//			this.getView().byId("carSelectButtons").setVisible(false);
//			this.getView().byId("carsContainer").setVisible(false);
//			this.getView().byId("setorCar").setValue("");
//			this.resetPopoverFields(this);
			this.resetForm(this);
		},
		resetForm:function(vController){
			var newFaultModel = new sap.ui.model.json.JSONModel();
			vController.faultModel = newFaultModel;
			var valueHelpModel = vController.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			var currentdate = new Date();
			vController.faultModel.setData(models.getEmptyFaultStructure());
			vController.faultModel.oData.FaultDate = currentdate;
			vController.faultModel.oData.FaultTime = (currentdate.getHours() + ":" + currentdate.getMinutes());
			vController.getView().setModel(vController.faultModel, "faultModel");

			vController.toggleSearchFieldRows(false);
			vController.toggleFormFieldRows(false);
			// Set it to deafult when coming to create screen 2nd time.
			vController.getView().byId("carSelectButtons").setVisible(false);
			vController.getView().byId("carsContainer").setVisible(false);
			vController.getView().byId("setorCar").setValue("");
			vController.resetPopoverFields(vController);
		},
		resetPopoverFields:function(vController){
			vController.getView().byId("faultSource").setValue("");
			vController.getView().byId("faultSource").data("fltSource","");

			vController.getView().byId("auditType").setValue("");
			vController.getView().byId("auditType").data("auditType","")

			vController.getView().byId("subSystem").setValue("");
			vController.getView().byId("subSystem").data("subSystem","");

			vController.getView().byId("majorSystem").setValue("");
			vController.getView().byId("majorSystem").data("majorSystem","");

			vController.getView().byId("reportPhase").setValue("");
			vController.getView().byId("reportPhase").data("reportPhase","");

			vController.getView().byId("fltSymptom").setValue("");
			vController.getView().byId("fltSymptom").data("fltSymptom","");

			vController.getView().byId("fltPosition").setValue("");
			vController.getView().byId("fltPosition").data("fltPosition","");

			vController.getView().byId("temp").setValue("");
			vController.getView().byId("temp").data("temp","");

			vController.getView().byId("weather").setValue("");
			vController.getView().byId("weather").data("weather","");

			vController.getView().byId("faultRectified").setSelected(false)	
			vController.getView().byId("tsrNo").setValue("");
			vController.getView().byId("auditNo").setValue("");
			vController.getView().byId("tpcNo").setValue("");
			vController.getView().byId("voiNo").setValue("");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tfnswmfs.webapp.view.Create
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tfnswmfs.webapp.view.Create
		 */
		onAfterRendering: function() {

		},		
		loadInitPopOverData:function(vController){
			models.getPopOverModel(vController,'ETS_FAULT_SRC',"fltSourceModel");	
			models.getPopOverModel(vController,'ETS_AUDIT_TYPE',"auditTypeModel");
			models.getPopOverModel(vController,'ETS_REPORT_PHASE',"reportPhaseModel");
			models.getPopOverModel(vController,'ETS_SYMPTOM',"fullSymptomModel");
			models.getPopOverModel(vController,'ETS_POSITION',"positionModel");
			models.getPopOverModel(vController,'ETS_TEMPERATURE',"temperatureModel");
			models.getPopOverModel(vController,'ETS_WEATHER',"weatherModel");
		},
		getSymptomsList:function(vController){
			var oModel = new sap.ui.model.json.JSONModel();
			var symptomGroupModel = new sap.ui.model.json.JSONModel();
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			mainDataModel.read("ETS_SYMPTOM", {
				success: function(data, response) {
					oModel.setData({
						listitems: data.results
					});
					symptomGroupModel.setData({
						listitems: vController.getSymptomGroup(data.results)
					});
					vController.getView().setModel(oModel, "fullModel");
					vController.getView().setModel(symptomGroupModel, "symptomGroupModel");
				},
				error: function(oError) {
//					vController.getView().setModel(oModel, "faultSymptomModel");				
				}
			});	
		},
		searchSetorCar:function(oEvent){
			var vController = this;
			var initModel = this.getView().getModel("initModel");	
			var carModel = new sap.ui.model.json.JSONModel();			
			var setNo = oEvent.getParameters().value;
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");

			if(setNo && setNo !== ""){
				mainDataModel.read("ETS_CAR_SET_PAIR?$filter=(IvAsset eq '"+setNo.toUpperCase()+"')&$format=json", {
					success: function(data, response) {
						carModel.setData({
							carSet: data.results
						});	
						vController.getView().setModel(carModel,"carModel");
						if(data.results.length > 0){
							initModel.oData.setId = data.results[0].Setid;
							initModel.oData.carId = data.results[0].Carid;
							var qryFilter ="?$filter=Zzcarid eq '"+initModel.oData.carId+"'&$format=json";
							models.getPopOverModelWQFilter(vController,'ETS_MAJOR_SYSTEM',qryFilter,"majorSystemModel");
							vController.getView().byId("subSystem").setValue("");
							vController.getView().byId("subSystem").data("subSystem","");
						}
						if(data.results.length === 1){
							initModel.oData.setId = data.results[0].Setid;
							initModel.oData.carId = data.results[0].Carid;
							vController.getView().getModel("carModel").oData.carSet[0].selected = data.results[0].Carid;
							vController.getView().byId("carSelectButtons").setVisible(false);
							vController.getView().byId("carsContainer").setVisible(false);	

							vController.toggleSearchFieldRows(true);
							vController.getView().byId("list_expand").setVisible(false);
							vController.getView().byId("list_collapse").setVisible(true);
							models.searchOpenFaultsByCar(vController,initModel.oData.setId, initModel.oData.carId);
						}else if(data.results.length > 1){
							vController.loadCarsFragment(carModel,vController);
							vController.getView().byId("carSelectButtons").setVisible(true);
							vController.getView().byId("carsContainer").setVisible(true);
							vController.getView().byId("car_select_all").setEnabled(true);
							vController.getView().byId("car_dSelect_all").setEnabled(true);
							vController.toggleSearchFieldRows(false);

						}else if(data.results.length === 0) {
							vController.getView().byId("carSelectButtons").setVisible(false);
							vController.getView().byId("carsContainer").setVisible(false);
							vController.toggleSearchFieldRows(false);
							vController.toggleFormFieldRows(false);	
							vController.getView().byId("majorSystem").setValue("");
							vController.getView().byId("majorSystem").data("majorSystem","");
							vController.getView().byId("subSystem").setValue("");
							vController.getView().byId("subSystem").data("subSystem","");
						}
						vController.getView().setModel(initModel,"initModel");
						models.checkSetInSAP(vController,initModel);
					},
					error: function(oError) {
//						vController.busyIndicatorCount.close();
						sap.m.MessageBox.show(oError.message,{
							icon: this.mFSMsg.getProperty("popError"), 
							title: this.mFSMsg.getProperty("popTitleNetwork"), 
							actions: sap.m.MessageBox.Action.OK, 
							onClose: function() {/* do nothing*/ }
						});
					}
				});
			}else{
				vController.loadCarsFragment(carModel,vController);
				vController.getView().byId("carSelectButtons").setVisible(false);
			}

		},
		showFaultSource: function(oEvent) {
			if (!this._ofaultSourcePopover) {
				this._ofaultSourcePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultSource", this);
				this._ofaultSourcePopover.bindElement("/");
				this.getView().addDependent(this._ofaultSourcePopover);
			}
			this._ofaultSourcePopover.openBy(oEvent);
		},

		showAuditType: function(oEvent) {
			if (!this._oauditTypePopover) {
				this._oauditTypePopover = sap.ui.xmlfragment("tfnswmfs.fragment.auditType", this);
				this._oauditTypePopover.bindElement("/");
				this.getView().addDependent(this._oauditTypePopover);
			}
			this._oauditTypePopover.openBy(oEvent);
		},
		showMajorSystem: function(oEvent) {
			var vController = this;
			if (!this._omajorSystemPopover) {
				this._omajorSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.majorSystem", this);
				this._omajorSystemPopover.bindElement("/");
				this.getView().addDependent(vController._omajorSystemPopover);
			}
			this._omajorSystemPopover.openBy(oEvent);
		},

		showSubSystem: function(oEvent) {

			var vController = this;
			var selMajorSystem = this.getView().byId("majorSystem").data("majorSystem");

			if(selMajorSystem && selMajorSystem !== ""){
				if (!vController._osubSystemPopover) {
					vController._osubSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.subSystem", this);
					vController._osubSystemPopover.bindElement("/");
					vController.getView().addDependent(vController._osubSystemPopover);
				}
				vController._osubSystemPopover.openBy(oEvent);
			}else{
				sap.m.MessageBox.show(this.mFSMsg.getProperty("selectMjrSystem"),{
					icon: this.mFSMsg.getProperty("popInfo"), 
					title: this.mFSMsg.getProperty("popTitleValidation"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {/* do nothing*/}
				});
			}
		},
		showReportPhase: function(oEvent) {
			if (!this._oreportPhasePopover) {
				this._oreportPhasePopover = sap.ui.xmlfragment("tfnswmfs.fragment.reportPhase", this);
				this._oreportPhasePopover.bindElement("/");
				this.getView().addDependent(this._oreportPhasePopover);
			}
			this._oreportPhasePopover.openBy(oEvent);
		},		

		showFaultSymptom: function(oEvent) {
			if (!this._ofaultSymptomPopover) {
				this._ofaultSymptomPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultSymptom", this);
				this._ofaultSymptomPopover.bindElement("/");
				this.getView().addDependent(this._ofaultSymptomPopover);
			}
			this._ofaultSymptomPopover.openBy(oEvent);
		},
		showPosition: function(oEvent) {
			if (!this._opositionPopover) {
				this._opositionPopover = sap.ui.xmlfragment("tfnswmfs.fragment.position", this);
				this._opositionPopover.bindElement("/");
				this.getView().addDependent(this._opositionPopover);
			}
			this._opositionPopover.openBy(oEvent);
		},
		showTemperature: function(oEvent) {
			if (!this._oTemperaturePopover) {
				this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultTemperature", this);
				this._oTemperaturePopover.bindElement("/");
				this.getView().addDependent(this._oTemperaturePopover);
			}
			this._oTemperaturePopover.openBy(oEvent);
		},
		showWeather: function(oEvent) {
			if (!this._oWeatherPopover) {
				this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultweather", this);
				this._oWeatherPopover.bindElement("/");
				this.getView().addDependent(this._oWeatherPopover);
			}
			this._oWeatherPopover.openBy(oEvent);
		},

		loadCarsFragment:function(carModel,that){
			var carContainer = this.getView().byId("carsContainer");
			var oCarFragment = sap.ui.xmlfragment("tfnswmfs.fragment.car", this);
			carContainer.bindAggregation("content", {
				path: "carModel>/carSet",
				template: oCarFragment
			});
		},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tfnswmfs.webapp.view.Create
		 */
		//	onExit: function() {
		//
		//	}	
		onSelAuditType: function(oEvent){
			var selAuditType = this.getView().getModel("auditTypeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var auditTypeField = this.getView().byId("auditType");
			auditTypeField.setValue(selAuditType.Zzdesc);
			auditTypeField.data("auditType",selAuditType.ZzauditType);
			this.getView().getModel("faultModel").oData.AuditType = selAuditType.ZzauditType;
			this.getView().getModel("faultModel").oData.AuditTypeDesc = selAuditType.Zzdesc;
			this._oauditTypePopover.close();
		},
		onSelSystem:function(oEvent){
			var qryFilter = "";
			var carId = this.getView().getModel("initModel").oData.carId;
			var selSystem = this.getView().getModel("majorSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var systemField = this.getView().byId("majorSystem");
			systemField.setValue(selSystem.Zzdescrption);
			systemField.data("majorSystem",selSystem.Zzmajorsystem)
			this.getView().getModel("faultModel").oData.MajorSystem = selSystem.Zzmajorsystem;
			this.getView().getModel("faultModel").oData.MjrsysDesc = selSystem.Zzdescrption;
			var subSystemField = this.getView().byId("subSystem");
			subSystemField.setValue("");
			subSystemField.data("subSystem","");

			qryFilter +="?$filter=IvCarid eq '"+carId+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"'";
			models.getPopOverModelWQFilter(this,'ETS_SUB_SYSTEM',qryFilter,"subSystemModel");

			this._omajorSystemPopover.close();
		},
		onSelSubSystem:function(oEvent){
			var selSubSystem = this.getView().getModel("subSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var subSystemField = this.getView().byId("subSystem");
			subSystemField.setValue(selSubSystem.SubsysDesc);
			subSystemField.data("subSystem",selSubSystem.SubSystem)
			this.getView().getModel("faultModel").oData.SubSystem = selSubSystem.SubSystem;
			this.getView().getModel("faultModel").oData.SubsysDesc = selSubSystem.SubsysDesc;
			this._osubSystemPopover.close();
			this.toggleFormFieldRows(true);
//			Show Graffity field only if the SET is from SAP			
			this.getView().byId("graffitiRow").setVisible(!this.getView().getModel("initModel").oData.set_car_sap);
		},
		onSelReportPhase:function(oEvent){
			var selReportPhase = this.getView().getModel("reportPhaseModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var reportPhaseField = this.getView().byId("reportPhase");
			reportPhaseField.setValue(selReportPhase.Zzdesc);
			reportPhaseField.data("reportPhase",selReportPhase.Zzrphase)
			this.getView().getModel("faultModel").oData.ReportPhase = selReportPhase.Zzrphase;
			this.getView().getModel("faultModel").oData.RepPhaseDesc = selReportPhase.Zzdesc;
			this._oreportPhasePopover.close();
		},
		onSelSymptom:function(oEvent){
			var selSymptom = this.getView().getModel("faultSymptomModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var symptomField = this.getView().byId("fltSymptom");
			symptomField.setValue(selSymptom.CodeText);
			symptomField.data("fltSymptom",selSymptom.Code)
			this._ofaultSymptomPopover.close();
		},
		onSelPosition:function(oEvent){
			var selPosition = this.getView().getModel("positionModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var positionField = this.getView().byId("fltPosition");
			positionField.setValue(selPosition.Zzdesc);
			positionField.data("fltPosition",selPosition.Zzcode)
			this.getView().getModel("faultModel").oData.Position = selPosition.Zzcode;
			this.getView().getModel("faultModel").oData.PositionDesc = selPosition.Zzdesc;
			this._opositionPopover.close();
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp)
			this.getView().getModel("faultModel").oData.Temperature = selTemp.Zztemp;
			this.getView().getModel("faultModel").oData.TempDesc = selTemp.Zzdesc;
			this._oTemperaturePopover.close();
		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather)
			this.getView().getModel("faultModel").oData.Weather = selWeather.Zzweather;
			this.getView().getModel("faultModel").oData.WeatherDesc = selWeather.Zzdesc;			
			this._oWeatherPopover.close();
		},
		onFltSrcChange: function(oEvent) {

			var selfltSource = this.getView().getModel("fltSourceModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var fltSourceField = this.getView().byId("faultSource");
			fltSourceField.setValue(selfltSource.Zzdesc);
			fltSourceField.data("fltSource",selfltSource.Zzfaultsrc)
			this.getView().getModel("faultModel").oData.FaultSource = selfltSource.Zzfaultsrc;
			this.getView().getModel("faultModel").oData.FaultSrcDesc = selfltSource.Zzdesc;
			this._ofaultSourcePopover.close();
			var faultSrc = selfltSource.Zzfaultsrc;
			var TSRset = this.getView().byId("TSR_fields");
			var AUDITset = this.getView().byId("Audit_fields");
			var TPCset = this.getView().byId("TPC_fields");
			var VOIset = this.getView().byId("VOI_fields");
			var gridLayout = this.getView().byId("faultSourceRow");
			gridLayout.setDefaultSpan("L6 M6 S12");
			if (faultSrc === "TSR") {

				TSRset.setVisible(true);
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
				VOIset.setVisible(false);
				this.getView().byId("voiNo").setValue("");
			} else if (faultSrc === "AUDIT") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("");
				AUDITset.setVisible(true);
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
				VOIset.setVisible(false);
				this.getView().byId("voiNo").setValue("");
			} else if (faultSrc === "TPC") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("");
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(true);
				VOIset.setVisible(false);
				this.getView().byId("voiNo").setValue("");
			} else if (faultSrc === "VOI") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("");
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
				VOIset.setVisible(true);
			} else {
				gridLayout.setDefaultSpan("L12 M12 S12");
				TSRset.setVisible(false);
				AUDITset.setVisible(false);
				TPCset.setVisible(false);
				VOIset.setVisible(false);
			}
		},

		toggleExpand: function(buttonPressed) {
			var Expand = this.getView().byId("list_expand");
			var Collapse = this.getView().byId("list_collapse");
			var panel = this.getView().byId("panelOpenFault");
			if (buttonPressed.oSource.getText() === "Expand") {
				Expand.setVisible(false);
				Collapse.setVisible(true);
				panel.setVisible(true);
			} else if (buttonPressed.oSource.getText() === "Collapse") {
				Expand.setVisible(true);
				Collapse.setVisible(false);
				panel.setVisible(false);
			}
		},

		onPressNavToSearch: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(vController.mFSMsg.getProperty("cancelTransaction"),{
				icon: vController.mFSMsg.getProperty("popWarning"), 
				title: vController.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.getView().getModel("faultModel").destroy();
						vController.router.navTo("Search");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});

		},
		onPressNavToInfo: function() {
			var vController = this;
			sap.m.MessageBox.show(vController.mFSMsg.getProperty("cancelTransaction"),{
				icon: vController.mFSMsg.getProperty("popWarning"), 
				title: vController.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.getView().getModel("faultModel").destroy();
						vController.router.navTo("Info");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
//		singleCarSelect:function(){

//		},
		handleTimePick: function (oEvent) {
			var oText = this.byId("fltTime");
			var oTP = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			this._iEvent++;
			if (bValid) {
				oTP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oTP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		oncarPress:function(oEvent){
			var that = this;
			var count = 0;
			var selCar = oEvent.getSource();
			var car = this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).Carid;
			if(selCar.hasStyleClass("CarOff")){
				selCar.removeStyleClass("CarOff");
				selCar.addStyleClass("CarOn");
				this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).selected = car;
			}else{
				selCar.removeStyleClass("CarOn");
				selCar.addStyleClass("CarOff");	
				this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).selected = "";
			}
			var carsSet = this.getView().getModel("carModel").oData.carSet;
			if(carsSet <= 1){
				that.getView().byId("car_select_confirm").setVisible(false);
			}else{
				for(var i=0;i < carsSet.length; i++){
					if(carsSet[i].Carid === carsSet[i].selected) {count++;}
				}
				if(count === 0){
					that.getView().byId("car_select_confirm").setVisible(false);
				} else{
					that.getView().byId("car_select_confirm").setVisible(true);
				}
			}
		},
		selectAllCars: function(){
			var carsGroup = this.getView().byId("carsContainer").getContent();
			var count = carsGroup.length;
			var car = "";
			for(var i=0; i<count; i++){
				this.getView().getModel("carModel").oData.carSet[i].selected = this.getView().getModel("carModel").oData.carSet[i].Carid;
				car = carsGroup[i];
				if(car.hasStyleClass("CarOff")){
					car.removeStyleClass("CarOff");
					car.addStyleClass("CarOn");
				}
			}
			this.getView().byId("car_select_confirm").setVisible(true);
		},
		dSelectAllCars: function(){
			var carsGroup = this.getView().byId("carsContainer").getContent();
			var count = carsGroup.length;
			var car = "";
			for(var i=0; i<count; i++){
				this.getView().getModel("carModel").oData.carSet[i].selected = "";
				car = carsGroup[i];
				if(car.hasStyleClass("CarOn")){
					car.removeStyleClass("CarOn");
					car.addStyleClass("CarOff");
				}
			}
			this.getView().byId("car_select_confirm").setVisible(false);
		},
		toggleSearchFieldRows:function(visibleFlag){
			this.getView().byId("dateRow").setVisible(visibleFlag);
			this.getView().byId("faultSourceRow").setVisible(visibleFlag);
			this.getView().byId("systemsRow").setVisible(visibleFlag);
			this.getView().byId("faultListHeader").setVisible(visibleFlag);
			this.getView().byId("panelOpenFault").setVisible(visibleFlag);
		},
		toggleFormFieldRows:function(visibleFlag){
			this.getView().byId("reportPhaseRow").setVisible(visibleFlag);
			this.getView().byId("graffitiRow").setVisible(visibleFlag);
			this.getView().byId("rectifiedRow").setVisible(visibleFlag);
			this.getView().byId("commentsRow").setVisible(visibleFlag);

		},
		onPressGetTripID: function(oEvent){
			var setNo = this.getView().getModel("initModel").oData.setId;
			var tripIdField = this.getView().byId("tripID");
			var qryFilter = "";

			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var fltDate = new Date(this.getView().byId("fltDate").getDateValue());
			var fltTime = new Date(this.getView().byId("fltTime").getDateValue());
			var fltTime1 = new Date(fltTime.getTime() - TZOffsetMs);
			var hour = fltTime.getHours(); // get hours from the date value
			var minutes = fltTime.getMinutes(); //get minutes from the date value
			var seconds = fltTime.getSeconds(); //get seconds from the date value
			if(seconds<10) {seconds = "0"+seconds;}

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" }); 

			var qryfltDate = dateFormat.format(new Date(fltDate))+"T00:00:01";
			var qryfltTime = "PT"+hour+"H"+minutes+"M"+seconds+"S"; //setting time in JSON format

			qryFilter += "?$filter=(IvFdate eq datetime'"+qryfltDate+"') and ";
			qryFilter += "(IvFtime eq time'"+qryfltTime+"') and ";
			qryFilter += "(IvSetid eq '"+setNo+"')&$format=json";
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			models.setTripId(this,qryFilter, "tripID");
			this.busyIndicatorCount.close();
		},
		onConfirmCars:function(oEvent){
			var carsSet = this.getView().getModel("carModel").oData.carSet;
			this.getView().byId("car_select_confirm").setVisible(true);
			this.getView().byId("car_select_all").setEnabled(false);
			this.getView().byId("car_dSelect_all").setEnabled(false);
//			this.getView().byId("carsContainer").setEnabled(false);
			this.toggleSearchFieldRows(true);
//			models.searchOpenFaultsBySet(this,initModel.oData.setNo, carsSet)
		},
		onPressCancel:function(oEvent){
			var that = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						that.getView().getModel("faultModel").destroy();
						that.router.navTo("Search",true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onPressHelp:function(oEvent){
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");

			var dialog = new sap.m.Dialog({
				contentWidth:'60%',
				contentHeight:'40%',
				content: new sap.m.Image({ src: mainDataModel.sServiceUrl+"/ETS_POS_HELP(qmnum='1')/$value" }),
				endButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onPressSubmit:function(oEvent){
			var carSet = this.getView().getModel("carModel").oData.carSet;
			var carSetArr =[]
			for(var i=0;i<carSet.length;i++){
				if(carSet[i].Carid === carSet[i].selected){
					var car = {
							"CarId" : "",
							"SetId" : ""
					}
					car.CarId = carSet[i].Carid;
					car.SetId = carSet[i].Setid;
					this.getView().getModel("faultModel").oData.Setid = carSet[i].Setid;
					carSetArr.push(car);
				}
			}
			this.getView().getModel("faultModel").oData.Setid = carSetArr[0].SetId;
			this.getView().getModel("faultModel").oData.Carid = carSetArr[0].CarId;
			carSetArr.splice(0,1);
			this.getView().getModel("faultModel").oData.NAV_FAULT_CAR = carSetArr;

			this.getView().getModel("faultModel").oData.FftrDesc = (this.getView().byId("faultRectified").getSelected() ?"X" : "");
			var fltDate = new Date(this.getView().byId("fltDate").getDateValue());
			var fltTime = new Date(this.getView().byId("fltTime").getDateValue());
			var hour = fltTime.getHours(); // get hours from the date value
			var minutes = fltTime.getMinutes(); //get minutes from the date value
			var seconds = fltTime.getSeconds(); //get seconds from the date value
			if(seconds<10) {seconds = "0"+seconds;}
			this.getView().getModel("faultModel").oData.FaultDate = "\/Date("+fltDate.setHours(0,0,0,0)+")\/";
			this.getView().getModel("faultModel").oData.FaultTime = ( "PT"+hour+"H"+minutes+"M"+seconds+"S");

			var fltSourceField = this.getView().byId("faultSource");
			var faultSrc = fltSourceField.data("fltSource");
			if (faultSrc === "TSR") {
				this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("tsrNo").getValue();
			} else if (faultSrc === "AUDIT") {
				this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("auditNo").getValue();
			} else if (faultSrc === "TPC") {
				this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("tpcNo").getValue();
			} else if (faultSrc === "VOI") {
				this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("voiNo").getValue();
			}
			models.postNotification(this,this.getView().getModel("faultModel").oData,this.mFSMsg,this.router,"Create");
		},
		onSelectSympGroup:function(oEvent){
			var vController = this;
			var selSympGroup = this.getView().getModel("symptomGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var symptomModel = new sap.ui.model.json.JSONModel();
			symptomModel.setData({
				listitems: vController.getSymptom(vController,vController.getView().getModel("fullModel").oData.listitems,selSympGroup.Codegruppe)
			});
			var valueHelpModel = this.getView().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			valueHelpData.symptomGroup = selSympGroup.Codegruppe;
			valueHelpData.symptomGrpText =  selSympGroup.CodegrText;
			this.getView().setModel(symptomModel,"symptomModel");
		},
		onSelectSymptom:function(oEvent){
			var vController = this;
			var selSymptom = this.getView().getModel("symptomModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var valueHelpData = this.getView().getModel("ValueHelpModel").oData;

			valueHelpData.symptom = selSymptom.Code;
			valueHelpData.symptomText =  selSymptom.CodeText;
			var symptomField = this.getView().byId("fltSymptom");

			symptomField.setValue(valueHelpData.symptomGrpText+" - "+valueHelpData.symptomText);

			this.getView().getModel("faultModel").oData.Qmgrp = valueHelpData.symptomGroup;
			this.getView().getModel("faultModel").oData.QmgrpDesc = valueHelpData.symptomGrpText;
			this.getView().getModel("faultModel").oData.Qmcod = valueHelpData.symptom;
			this.getView().getModel("faultModel").oData.QmcodDesc = valueHelpData.symptomText;
			this._ofaultSymptomPopover.close();
		},
		getSymptomGroup:function(arr) {
			var cleaned = [];
			arr.forEach(function(itm) {
				var unique = true;
				cleaned.forEach(function(itm2) {
					if (itm.Codegruppe === itm2.Codegruppe) unique = false;
				});
				if (unique)  cleaned.push(itm);
			});
			return cleaned;
		},
		getSymptom:function(vController,arr,symptom) {
			var cleaned = [];
			arr.forEach(function(itm) {
				if (itm.Codegruppe === symptom) cleaned.push(itm);
			});
			return cleaned;
		},
		toTileHome: function(evt){
			var that = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						that.getView().getModel("faultModel").destroy();
						that.getOwnerComponent().app.to("tileHome");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
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
									tempField.data("temp","C");
								}else if(currTemp >= 10 && currTemp <= 35){
									tempField.setValue("AVERAGE (10-35°C)");
									tempField.data("temp","A");								
								}else if(currTemp > 35){
									tempField.setValue("HEAT (>35°C)");
									tempField.data("temp","H");							
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