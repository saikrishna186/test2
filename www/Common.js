function getApplications(callback, callbackObject){
	var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_SMP_SRV/ETS_APP";
	if(!this.busyIndicator){
		this.busyIndicator = new sap.m.BusyDialog()
	}
	var modal = this;
	modal.busyIndicator.open();
	var oHeaders = {};
	oHeaders['Authorization'] = authStr;
	var request = {
			headers: oHeaders,
			requestUri: url,
			method: "GET",
	};
	OData.read(request,
			function(oData, response){
		modal.busyIndicator.close();
		var data = {};
		if(oData)
			data = oData.results;
		callback.call(callbackObject,data);
	},
	function(e){
		modal.busyIndicator.close();
		console.log("An error occurred " + JSON.stringify(e));
	}
	);
}

function getApplications_Back(data, callback, callbackObject){
	callback.call(callbackObject,data);
}

function getDynamicCount(url){
	if(!this.busyIndicator){
		this.busyIndicator = new sap.m.BusyDialog()
	}
	var modal = this;
	var count;
	modal.busyIndicator.open();
	var jsonModel = new sap.ui.model.json.JSONModel();
	var urlPartIndex = url.lastIndexOf("/");
	var metaUrl = url.substring(0,urlPartIndex);
	var countUrl = url.substring(urlPartIndex , url.length)
	var oModel = new sap.ui.model.odata.ODataModel(metaUrl, true);
	oModel.read(countUrl,null, null, false,
			function (oData, response) {
		modal.busyIndicator.close();
		count = oData.number;
	},
	function (oError) {
		modal.busyIndicator.close();
		count = 0;
	}
	);
	return count;
}