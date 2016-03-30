jQuery.sap.require("sap.m.MessageBox"); 
sap.ui.controller("tfnswjobcard.jobList", {


	navigateToHome : function(){

		var app = this.getView().getViewData();
		var view = this.getView();

		app.to("empty");
	},

	getJobListData  : function(){

		var app = this.getView().getViewData();
		var view = this.getView();
		var controller = this;
		app.controller.getData("/ETS_TMP_OPERATIONS?$format=json",{},controller,controller.bindJobList);
	},

	bindJobList : function(data){

		var model = this.getView().jobList.getModel();
		var setTypeKeys = {};

		this.getView().dataLoad.hide();
		data.d = data;
		
		
		for ( var i=0 ; i < data.d.results.length ; i++){

			delete data.d.results[i].__metadata;
			data.d.results[i].Username = data.d.results[i].IUname;
			delete data.d.results[i].IUname;
			
			if(data.d.results[i].Eqart != "" && data.d.results[i].InspType != "" && data.d.results[i].ShiftName != ""){
				var key = data.d.results[i].SetNo + "-i" + data.d.results[i].InspType + "-s" + data.d.results[i].ShiftName + "-e";
			}
			else{
				var key = data.d.results[i].SetNo + "-i" + data.d.results[i].InspType + "-s" + data.d.results[i].ShiftName + "-e" + i;
			}
			
			if(setTypeKeys[key]){

				setTypeKeys[key].CarNo += ( "," + data.d.results[i].CarNo );
				setTypeKeys[key].NAV_SET_TO_TASK.push(jQuery.extend({}, data.d.results[i]));
				setTypeKeys[key].Eqrnr = "";
				setTypeKeys[key].Eqktx = "";

			}
			else{
				setTypeKeys[key] = {};				
				setTypeKeys[key] = jQuery.extend({}, data.d.results[i]);
				setTypeKeys[key].NAV_SET_TO_TASK = [];
				setTypeKeys[key].NAV_SET_TO_TASK.push(jQuery.extend({}, data.d.results[i]));
				setTypeKeys[key].SetNo = data.d.results[i].SetNo;
				setTypeKeys[key].InspType = data.d.results[i].InspType;
				setTypeKeys[key].Username = data.d.results[i].Username;				
			}
		}

		var modelData = [];
		for( var key in setTypeKeys){

			if(setTypeKeys)

			modelData.push(setTypeKeys[key])
		}

		model.setData(modelData);

	},
	
	searchJobList : function(evt){
		
		
		var filters = [];
		var searchText = evt.getSource().getValue();


		if (searchText && searchText.length > 0) {
			var carFilter = new sap.ui.model.Filter({path : "CarNo", operator : sap.ui.model.FilterOperator.Contains, value1 : searchText, filters : filters,and : false});
//			var inspFilter = new sap.ui.model.Filter({path : "InspType", operator : sap.ui.model.FilterOperator.Contains, value1 : searchText,filters : filters, and : false});
			filters.push(carFilter);
//			filters.push(inspFilter);
		}

		// update binding
		var list = this.getView().jobList;
		var oBinding = list.getBinding("items");
		oBinding.filter(filters);

		
	},
	
	groupJobList : function(evt){
		
		 function groupInspectionType(oContext) {
			var InspType = oContext.getProperty("InspType");

//			var text = InspType;
			
			return {
				key: InspType,
				text: InspType
			};
		}
		 function groupDepot (oContext) {
			var depot = oContext.getProperty("Depot");
//			var text = sap.ui.demo.myFiori.util.Grouper.bundle.getText("Priority" + priority, "?");
			return {
				key: depot,
				text: depot
			};
		}
		 function groupSet (oContext) {
				var set = oContext.getProperty("SetNo");
//				var text = sap.ui.demo.myFiori.util.Grouper.bundle.getText("Priority" + priority, "?");
				return {
					key: set,
					text: set
				};
			}
		
		var sorters = [];
		var item = evt.getParameter("selectedItem");
		var seltext = item.getText();
		var key = (item) ? item.getKey() : null;
		if ("IT" === key) {
			
			var grouper = groupInspectionType;
			sorters.push(new sap.ui.model.Sorter("InspType", true, grouper));
		}
		else if("SET" === key) {
			var grouper = groupSet;
			sorters.push(new sap.ui.model.Sorter("SetNo", true, grouper));
		}
		

		// update binding
		var list = this.getView().jobList;
		var oBinding = list.getBinding("items");
		oBinding.sort(sorters);
//		evt.getSource().setText(seltext);
		
	},

	selectJob : function(listItem,refresh){

		var app = this.getView().getViewData();
		
		if(!refresh){
		this.showInfoText();		
		}
		var selectOption = listItem.getList().getSelectedItem();
		this.getView().data("selectOption",selectOption);
		var jobData = listItem.getBindingContext().getObject();
		var jobPayload = {};
		jobPayload = {};
		jobPayload.NAV_SET_TO_TASK = jobData.NAV_SET_TO_TASK;
		jobPayload.Username  = jobData.Username;
		jobPayload.SetNo = jobData.SetNo;
		jobPayload.InspType = jobData.InspType;
		
		var carValues = jobData.CarNo;
		var app = this.getView().getViewData();
		var carArray = carValues.split(",");
		var length = carArray.length;
		var finalArray = [];
		var data = {}; // data object
		data.CountFlag = "X";
		data.NAV_SET_TO_OPENFAULTS = [];
		for (var k =0; k<length; k++)
		{
		finalArray.push({"ZznotifNum" :"",
		"ZzfaultDate" : null,
		"ZzfaultTime" : "PT00H00M00S",
		"ZzcarNum" : carArray[k],
		"ZzassetDesc" : "",
		"Zzasset" : "",
		"ZzpriorityDesc" : "",
		"Zzpriority" : "",
		"ZzsymptomGp" : "",
		"ZzsymptomCode" : "",
		"ZzsymptomGpDesc" : "",
		"ZzsymptomCodeDesc" : "",
		"ZzpositionDesc" : "",
		"Zzposition" : "",
		"ZzworkOrder" : "",
		"ZznotifDesc" : "",
		});
		}
		data.NAV_SET_TO_OPENFAULTS = finalArray;
		
		
		if(!this.jobDetailPage){
			
		var rightPane = sap.ui.view({ id :"jobDetails", viewName:"tfnswjobcard.jobDetails", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
		app.addDetailPage(rightPane);
		this.jobDetailPage = rightPane;
		app.jobDetailPage = rightPane;
		}
		var detailController = this.jobDetailPage.controller;
		app.controller.postBatchData("/ETS_SETIN","/ETS_TASKCODES",jobPayload,detailController,detailController.getTaskData);
		this.jobDetailPage.controller.bindHeaderData(jobData);
		app.controller.getNotification(data, this, length);
		app.to("jobDetails");
		app.hideMaster();


	},
	getCount : function(count)
	{
		var app = this.getView().getViewData();
		var faultCount = count;
		var page = app.getPage("jobDetails");
		page.faultCountBtn.setText("Outstanding Faults on selected cars ("+faultCount.trim()+")");
	},
	
	getInfoText : function(){
		
		var app = this.getView().getViewData();
		var view = this.getView();
		var controller = this;
		
		app.controller.getData("/ETS_LONGTEXT?$filter=TextObject eq 'X'&$format=json",{},controller,controller.bindInfoText);		
		
	},
	
	bindInfoText : function(infoText,params){
		
		var controller = this;
		infoText.d = infoText;
		controller.infoText = infoText.d.results[0].LongText.split("@~@").join("\n");		
	},
	
	showWarningText : function(item)
	{   var controller = this;
	    var listItem = item;
	    if(!this.notFirstTime){
	    	this.notFirstTime = true;
			controller.selectJob(listItem);
	    }
	    else{
			var dialog = new sap.m.Dialog({
				title: 'Information Message',
				content: new sap.m.Text({
					text : "Are you sure you want to exit this job card without saving?"
				}),
				beginButton: new sap.m.Button({
					text: 'Ok',
					press: function () {
						controller.selectJob(listItem);
						dialog.close();
					}
				}),
				endButton : new sap.m.Button({
					text: 'Cancel',
					press: function () {
						var list = item.getList();
						list.setSelectedItem(controller.getView().data("selectOption"));
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			this.warningDialog = dialog
			dialog.open();
	    }
		/*if(!this.warningDialog){
			var dialog = new sap.m.Dialog({
				title: 'Information Message',
				content: new sap.m.Text({
					text : "Are you sure you want to exit this job card without saving?"
				}),
				beginButton: new sap.m.Button({
					text: 'Ok',
					press: function () {
						controller.selectJob(listItem);
						dialog.close();
					}
				}),
				endButton : new sap.m.Button({
					text: 'Cancel',
					press: function () {
						var list = item.getList();
						list.setSelectedItem(controller.getView().data("selectOption"));
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			this.warningDialog = dialog
			controller.selectJob(listItem);
			dialog.open();
			}
		else
			{
			this.warningDialog.open();
			}
			*/
	},
	
	showInfoText : function(){
		
		var infoText = this.infoText;
		
		if(!this.infoDialog){
		var dialog = new sap.m.Dialog({
			title: 'Information Message',
			content: new sap.m.Text({
				text : infoText
			}),
			beginButton: new sap.m.Button({
				text: 'Ok',
				press: function () {
					dialog.close();
				}
			})
//			endButton : new sap.m.Button({
//				text: 'No',
//				press: function () {
//					source.setSelected(false)
//					dialog.close();
//				}
//			})
		});
		this.infoDialog = dialog
		}
		this.infoDialog.open();		
		
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnswjobcard.jobList
*/
	onInit: function() {
									this.getJobListData();
									this.getInfoText();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnswjobcard.jobList
*/
//	onBeforeRendering: function() {
//
//	},
 
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnswjobcard.jobList
*/
	onAfterRendering: function() {

		var app = this.getView().getViewData();
		//app.showMaster();
	},
	toTileHome:function(evt)
	{
		var view = this.getView();
		var tileHomeApp = view.getViewData().tileHomeApp.app;

		tileHomeApp.to("tileHome");
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnswjobcard.jobList
*/
//	onExit: function() {
//
//	}

});