sap.ui.controller("tfnswjobcard.TaskDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf TaskDetails
*/
	onInit: function() {
		var app = this.getView().getViewData();
		this.actionsData = app.getPage("jobDetails").oController.actionsData;
	},
	
	handleNavBack : function(evt){
		var app = this.getView().getViewData();
		app.to("jobDetails");
	},	
	bindFurtherActionPopup : function(){
		var controller = this;
		var app = this.getView().getViewData();
		var view = this.getView();
		var actionsData = this.actionsData;
		function openFurtherActionPopup(){
			return function () {
	        var source = this;
	        function selectFurtherActionRequired() {
	            return function (evt) {
	                var control = sap.ui.getCore().byId(source.id);
	            	if(evt.getParameters().listItem.getTitle() != "X"){	           
	            		control.setValue(evt.getParameters().listItem.getTitle());
	            	}
	            	else{
	            		control.setValue("");
	            	}
	            	 control.data("key", evt.getParameters().listItem.data("key"));
	                 source.list.close();
	            }
	        }
	        if (!source.list) {
	            var list = new sap.m.ResponsivePopover({
	                placement: sap.m.PlacementType.Left,
	                title: "Action Required?",
	                content: [],
	                width: "200px",
	                height: "300px"
	            }).addStyleClass("actionPopoverClass");
	            source.list = list;
	            var optionList = new sap.m.List({
	                mode: sap.m.ListMode.SingleSelectMaster,
	                includeItemInSelection: true,
	                select: selectFurtherActionRequired(),
//	                items: [option1, option2, option3],
	                width: "100%",
	                height: "100%"
	            }).addStyleClass("optionsList");
	            for ( var i = 0 ; i < actionsData.length ; i++){
		            var option = new sap.m.StandardListItem({
		                title: actionsData[i].Zztext	             
		            }).data("key", actionsData[i].ZzvalueL);
		            optionList.addItem(option);
	            } 	            
	            source.list.addContent(optionList);
	        }
	        source.list.openBy(source);
	    }
	}
	    $(".furtherActionInput").off().on("tap", openFurtherActionPopup());
	},
	
	toRecordObservation: function(evt){
		var controller = this;
		var selectedRowContext = evt.getSource().getBindingContext();
		var selectedRow = selectedRowContext.getObject();
		
		var view = this.getView();
		var app = view.getViewData();
		if(!this.recordObservPage){
			this.recordObservPage = sap.ui.view({id:"longText", viewName:"tfnswjobcard.LongText",type:sap.ui.core.mvc.ViewType.JS, viewData : app});
			app.addDetailPage(this.recordObservPage);
		}
		this.recordObservPage.data("selectedRow",selectedRow);
		var recordObservController = this.recordObservPage.oController;
		this.recordObservPage.getModel().setData(selectedRow);
		this.recordObservPage.data("selectedPath",selectedRowContext.sPath);
		app.controller.getFaultLongText(selectedRow.Aufnr, selectedRow.Car, selectedRow.TaskCode, selectedRow.Vornr, recordObservController);
		app.to("longText");
	},
	
	confirmAndPost : function(Message,callback){
		
		var controller = this;
//		sap.m.MessageBox.show(Message,
//				sap.m.MessageBox.Icon.SUCCESS,"Confirm User Action", sap.m.MessageBox.Action.QUESTION, null );	
		sap.m.MessageBox.confirm(
					Message,{
//					icon: MessageBox.Icon.QUESTION,
					title: "Are you sure?",
					styleClass : "confirmationDialog",
					onClose : function(action){
					if(action == "OK"){
						callback.call(controller)
					}	
					}					
				}
		);
		
	},	
	saveTaskDetails : function(evt){
		var taskTableData = this.getView().taskDetTable.getModel().getData();
		var taskData = this.getView().taskDetTable.getModel().getData();
		var app = this.getView().getViewData();
		var controller = this;
		var jobDetailController = app.getPage("jobDetails").oController;
		var temptaskData = [];
		for ( var k = 0 ; k < taskData.length ; k ++ ){
			var data = {};


			data.Aplzl = taskData[k].Aplzl;
			data.Aufnr = taskData[k].Aufnr;
			data.Aufpl = taskData[k].Aufpl;
			//data.Car = taskData[k].Car;
			data.CarType = taskData[k].CarType;
			data.Depot = taskData[k].Depot;
			data.Docex = taskData[k].Docex;
			data.InspType = taskData[k].InspType;
			data.Matex = taskData[k].Matex;
			data.MeasPoints = taskData[k].MeasPoints;
			data.Oper = taskData[k].Oper;
			data.Pernr = taskData[k].Pernr;
			data.ReasonCode = taskData[k].ReasonCode;
			data.ReasonText = taskData[k].ReasonText;
			data.Safety = taskData[k].Safety;
			data.SeqInsp = taskData[k].SeqInsp;
			//data.SetNo = taskData[k].SetNo;
			data.ShiftInsp = taskData[k].ShiftInsp;
			data.ShiftRepair = taskData[k].ShiftRepair;
			data.SkilRepair = taskData[k].SkilRepair;
			data.SkillInsp = taskData[k].SkillInsp;
			data.Status = taskData[k].Status;
			data.StdText = taskData[k].StdText;
			data.Subject = taskData[k].Subject;
			data.SuppTask = taskData[k].SuppTask;
			data.TaskCode = taskData[k].TaskCode;
			data.TaskText = taskData[k].TaskText;
			data.Version = taskData[k].Version;
			data.Vornr = taskData[k].Vornr;
			data.ZoneArea = taskData[k].ZoneArea;
			data.Zzsystem = taskData[k].Zzsystem;


			
			if(taskData[k].ReasonCode == "X"){
				taskData[k].ReasonCode = "";
				data.ReasonCode = "";
			}
			if(taskData[k].completed){
				taskData[k].ReasonCode = "";
				taskData[k].Status = "2";
				data.ReasonCode = "";
				data.Status = "2";
			}
			else if(taskData[k].ReasonText  != ""){
				taskData[k].ReasonCode = jobDetailController.getActionKey[taskData[k].ReasonText];
				taskData[k].Status = "3"
				data.ReasonCode = jobDetailController.getActionKey[taskData[k].ReasonText];
				data.Status = "3";
			}
			temptaskData.push(data);
			/*delete temptaskData[k].completed;
			delete temptaskData[k].filterKey;
			delete temptaskData[k].line;
			delete temptaskData[k].Car;
			delete temptaskData[k].SetNo;
			delete temptaskData[k].ExistingRecLongText;
			delete temptaskData[k].RecLongText;*/
		}
		
		var taskPayload = {};
		taskPayload.d = {};
		taskPayload.d.Username = "SUSS";
		taskPayload.d.SetNo = "SUSS";
		taskPayload.d.InspType = "SUSS";
		taskPayload.d.CountFlag = "";
		taskPayload.d.FaultCount = "";
		taskPayload.d.HoldFlag = "";
		taskPayload.d.NAV_SET_TO_TASKCODES = temptaskData;
		
		//For return entity
		taskPayload.d.NAV_TO_RETURN = [];
		
		app.controller.postData("/ETS_SETIN",taskPayload,controller,controller.handleSaveSuccess);
	},
		
	handleSaveSuccess : function(data){
		var controller = this;
		var app = this.getView().getViewData();
		var successMsg = "The task details have been successfully updated to the server."; //Custom Success message
		if(data){
			var message = data.NAV_TO_RETURN.results;
			if(message)
			{
				message = message[0];
				if(message.TYPE === "S"){
					sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
					controller.saveLongText();
				}
				else if(message.TYPE === "E"){
					sap.m.MessageBox.show(message.MESSAGE,sap.m.MessageBox.Icon.ERROR,"Save Error!", sap.m.MessageBox.Action.OK, null );
					controller.saveLongText();
				}
				else // If no message returned issue success messgae as backend returns no msg
				{	
					sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
					controller.saveLongText();
				}
			}
			else // If no message returned issue success messgae as backend returns no msg
			{
				sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
				controller.saveLongText();
			}
		}
		else{
			sap.m.MessageBox.show("Error in updating to the server" ,sap.m.MessageBox.Icon.ERROR,"Save Error!", sap.m.MessageBox.Action.OK, null );
		}
	},
	
	saveLongText: function(){
		var temptaskData = this.getView().taskDetTable.getModel().getData();
		var app = this.getView().getViewData();
		var controller = this;
		//var taskRecData = this.getView().getModel().getData();
		var dataArr = [];
		for(var i = 0; i < temptaskData.length; i++){
			var data = {};
			data.IvAufnr = temptaskData[i].Aufnr;
			data.IvCarid = temptaskData[i].Car;
			data.IvPost = "X";
			data.IvTaskcode = temptaskData[i].TaskCode;
			data.IvVornr = temptaskData[i].Vornr;
			data.EvAufnr = "";
			data.EvCarid = "";
			data.EvLongtextOut = "";
			data.EvTaskcode = "";
			data.EvVornr = "";
			data.IvLongtextIn = temptaskData[i].RecLongText;
			if($.trim(data.IvLongtextIn) !== "")
				dataArr.push(data);
		}
		var payload = {};
		payload.record_observation = dataArr;
		//payload.ETY_RETURNSet = [];
		//For return entity
		//data.ETY_RETURNSet = [];
		//taskData.push(taskPayload);
		if(dataArr.length > 0)
			app.controller.postData("/ETS_RECORD_OBSERVATION",payload,controller,controller.handleLongTxtSaveSuccess);
	},
	
	navigateToFault: function(evt){
		console.log(evt);
		var selectedRow = evt.getSource().getBindingContext().getObject();
		var car = selectedRow.Car;
		var setNo = selectedRow.SetNo;
		//window.open("https://"+location.host+"/sap/bc/bsp/sap/zfault_mgmt/webcontent/index.html?queryFaultNo="+evt.getSource().getBindingContext().getProperty().Zznotif,"_blank");
	}
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf TaskDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf TaskDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf TaskDetails
*/
//	onExit: function() {
//
//	}

});