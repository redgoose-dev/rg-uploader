export default class Plugin {

	constructor(parent)
	{
		this.parent = parent;
		this.names = [];
		this.child = {};
	}

	/**
	 * event listener
	 *
	 * queue.changeStyle
	 * queue.selectQueue
	 * queue.addProgress
	 * queue.updateProgress
	 * queue.uploadComplete
	 * queue.removeQueue
	 *
	 * @Param {String} type
	 * @Param {Any} value
	 */
	eventListener(type, value)
	{
		this.names.forEach((name) => {
			let evt = this.child[name].eventListener;
			if (!evt || !(typeof evt === 'function')) return;
			evt(type, value);
		});
	}

	/**
	 * error plugin
	 * 플러그인 작동에 문제가 생겨 호출되어 객체를 삭제한다.
	 *
	 * @Param {String} childName error plugin name
	 */
	error(childName)
	{
		this.names.splice(this.names.indexOf(childName), 1);
		delete this.child[childName];
	}

	/**
	 * init
	 */
	init()
	{
		// init plugins
		let items = this.parent.options.plugin;
		if (items && items.length)
		{
			items.forEach((item) => {
				if (!item.name) return;
				if (!item.obj || !(typeof item.obj === 'object')) return;
				if (!item.obj.init || !(typeof item.obj.init === 'function')) return;

				this.names.push(item.name);
				this.child[item.name] = item.obj;

				// play init()
				this.child[item.name].init(this.parent);
			});
		}
	}

}