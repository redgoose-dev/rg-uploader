export default {
	autoUpload : false,
	externalFileForm : null,
	allowFileTypes : ['jpeg', 'png', 'gif'],
	limitSize : 10000000,
	limitSizeTotal : 30000000,
	uploadScript : null,
	removeScript : null,
	uploadHeaders: null,
	removeHeaders: null,
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
		],
		datas : null
	},
	plugin : [],

	// upload parameters filter `function(res) {}`
	uploadParamsFilter: null,
	// upload data filtering `function(res) {}`
	uploadDataFilter: null,
	// remove parameters filter `function(res) {}`
	removeParamsFilter: null,
	// remove data filtering `function(res) {}`
	removeDataFilter: null,
	// progress upload `function(response, file) {}`
	uploadProgress: null,
	// complete upload `function(file) {}`
	uploadComplete: null,
	// all complete upload `function(app) {}`
	uploadCompleteAll: null,
	// fail upload `function(file) {}`
	uploadFail: null,
	// init app `function(app) {}`
	init: null
};