var dic = {
	ko : {
		error_add_upload : '업로드가 끝난후에 추가해주세요.',
		error_upload_limit : '파일은 총 {0}개까지 업로드할 수 있습니다.',
		error_limit_size : '업로드할 수 있는 용량이 초과되었습니다.',
		error_limit_size2 : '허용하는 용량을 초과한 파일은 제외됩니다.',
		error_file_type : '잘못된 형식의 파일입니다.',
		error_check_file : '허용되지 않는 파일은 제외됩니다.',
		error_not_upload_file : '업로드할 파일이 없습니다.',
		error_remove_error : '파일삭제 오류'
	},
	en : {
		error_add_upload : 'Please add after upload.'
	}
};


/**
 * string format
 * http://stackoverflow.com/a/4673436
 *
 * @Param {String} str
 * @Param {Array} args
 * @Return {String}
 */
function stringFormat(str, args)
{
	return str.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
}


// export
module.exports = function(code, values)
{
	let lang = $('html').attr('lang') || 'ko';
	let str = dic[lang][code] || '';

	// assign values
	str = (values && values.length) ? stringFormat(str, values) : str;

	return str;
};