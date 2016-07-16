/**
 * File upload class
 *
 * @author : redgoose
 * @param {String} action 파일처리 백엔드 url
 * @param {File} file
 * @param {Function} callback
 * @return void
 */
var FileUpload = function(action, file, callback)
{
	var xhr = new XMLHttpRequest();

	if (typeof FormData === 'function' || typeof FormData === 'object')
	{
		var formData = new FormData();
		formData.append('file', file);

		xhr.open('post', action, true);
		xhr.upload.addEventListener('progress', function(e){
			if (callback)
			{
				callback('progress', uploadProgress(e), file);
			}
		}, false);
		xhr.addEventListener('load', function(e){
			if (callback)
			{
				callback('complete', uploadSuccess(e.target), file);
			}
		});
		xhr.send(formData);
	}
	else
	{
		if (callback)
		{
			callback('complete', {
				state : 'error',
				response : {
					message : 'not support browser'
				}
			});
		}
	}
};


/**
 * upload progress
 * 
 * @Param {XMLHttpRequestProgressEvent} e
 * @Return {object}
 */
var uploadProgress = (e) => {
	if (e.lengthComputable)
	{
		return { loaded : e.loaded, total : e.total };
	}	
};


/**
 * upload success
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Param {File} file
 * @Return {Object}
 */
var uploadSuccess = (e, file) => {
	if (e.readyState == 4)
	{
		switch (e.status)
		{
			case 200:
				let response = e.responseText;
				try {
					return JSON.parse((response+''));
				} catch(e) {
					return {
						state : 'error',
						response : {
							message : response
						}
					};
				}
				break;
			case 404:
				return {
					state : 'error',
					response : {
						message : '404 - File not found'
					}
				};
				break;
			case 403:
				return {
					state : 'error',
					response : {
						message : '403 - Forbidden file type'
					}
				};
				break;
			default:
				return {
					state : 'error',
					response : {
						message : 'Unknown Error'
					}
				};
				break;
		}
	}

	return {
		state : 'error',
		response : {
			message : 'Unknown Error'
		}
	};
};


// export
module.exports = FileUpload;
