

// export
module.exports = {

	/**
	 * @var {String} component name
	 */
	name : 'Queue',

	/**
	 * @var {RGUploader} parent
	 */
	parent : null,


	/**
	 * init
	 *
	 * @param {RGUploader} parent
	 */
	init(parent)
	{
		this.parent = parent;
	}

};