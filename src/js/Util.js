// Util module

module.exports = {

	name : 'Util',
	
	/**
	 * byte to size convert
	 *
	 * @Param {Number} bytes
	 * @Return {String}
	 */
	bytesToSize(bytes)
	{
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
	},

	findElement($con, name)
	{
		return $con.find('[data-element=' + name + ']');
	},

	findText($con, name)
	{
		return $con.find('[data-text=' + name + ']');
	}
};