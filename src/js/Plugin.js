/**
 * check method
 *
 * @Param {Function} func
 * @Param {Boolean}
 */
function checkMethod(func)
{
	return (func && (typeof func === 'function'));
}

/*
 * receive event list
 *
 * queue.changeStyle
 * queue.selectQueue
 * queue.addProgress
 * queue.updateProgress
 * queue.uploadComplete
 * queue.removeQueue
 */

function Plugin(parent) {

	/**
	 * @var {Array} this.items
	 */
	this.names = [];

	/**
	 * @var {Object} this.obj
	 */
	this.child = {};


	/**
	 * event listener
	 *
	 * @Param {String} type
	 * @Param {*} value
	 */
	this.eventListener = (type, value) => {
		this.names.forEach((name) => {
			let evt = this.child[name].eventListener;
			if (!checkMethod(evt)) return;
			evt(type, value);
		});
	};

	/**
	 * error plugin
	 * 플러그인 작동에 문제가 생겨 호출되어 객체를 삭제한다.
	 *
	 * @Param {String} childName error plugin name
	 */
	this.error = (childName) => {
		this.names.splice(this.names.indexOf(childName), 1);
		delete this.child[childName];
	};

	/**
	 * init
	 *
	 */
	this.init = () => {
		// init plugins
		let items = parent.options.plugin;
		if (items && items.length)
		{
			items.forEach((item) => {
				let obj = parent[item];
				if (!checkMethod(obj) || !checkMethod(obj().init)) return;

				this.names.push(item);
				this.child[item] = obj();

				// play init()
				this.child[item].init(parent);
			});
		}
	};
}


// export module
module.exports = Plugin;
