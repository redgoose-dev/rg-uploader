;(function() {
	RGUploader.prototype.plugins.thumbnail = function ()
	{
		var name = 'Create thumnail image';
		var app = null;
		var option = {

		};


		// return
		return {
			name : name,
			init : function(parent)
			{
				app = parent;

				log(name);
			},
			open : function()
			{

			},
			eventListener : function(type, value)
			{
				switch (type) {
					case '':
						break;
				}
			}
		}
	}
})();