export default {
	autoUpload : false,
	$externalFileForm : null,
	allowFileTypes : ['jpeg', 'png', 'gif'],
	limitSize : 1000000,
	limitSizeTotal : 3000000,
	uploadScript : null,
	removeScript : null,
	eventPrefixName : 'RG-',
	srcPrefixName : '',
	queue : {
		height : 150,
		limit : 10,
		style : 'list',
		buttons : [
			{
				name : 'remove queue',
				iconName : 'close',
				className : 'btn-remove-queue',
				action : function(app, file) {
					app.queue.removeQueue(file.id, false, true);
				}
			}
		]
		,datas : null
	},
	plugin : [],
	// upload parameters filter
	uploadParamsFilter : function(res) {},
	// upload data filtering
	uploadDataFilter : function(res) {},
	// remove parameters filter
	removeParamsFilter : function(res) {},
	// remove data filtering
	removeDataFilter : function(res) {},
	// progress upload
	uploadProgress : function(response, file) {},
	// complete upload
	uploadComplete : function(file) {},
	// all complete upload
	uploadCompleteAll : function(app) {},
	// fail upload
	uploadFail : function(file) {},
	// init app
	init : function(app) {}
};