import RGUploader from './RG_Uploader';
import './scss/index.scss';

import SizeInfo from './plugins/sizeinfo.plugin';
import ChangeQueueStyle from './plugins/changeQueueStyle.plugin';
import ChangeQueue from './plugins/changeQueue.plugin';


let basic = new RGUploader(document.getElementById('example_basic'), {
	uploadScript: 'http://tools/rg-Uploader/upload/script-php/upload.php',
	removeScript : 'http://tools/rg-Uploader/upload/script-php/remove.php',
	queue : {
		height: 'auto',
		datas : [
			{
				"id" : 8742867877,
				"name" : "img-demo-1.jpg",
				"size" : 53710,
				"src" : "https://goose.redgoose.me/data/upload/original/201803/rg-20180315-000424.jpg",
				"type" : "image/jpeg"
			},
			{
				"id" : 6860860674,
				"name" : "img-demo-2.jpg",
				"size" : 129454,
				"src" : "https://goose.redgoose.me/data/upload/original/201711/rg-20171109-000393.jpg",
				"type" : "image/jpeg"
			}
		]
	},
	plugin: [
		{
			name: 'sizeinfo',
			obj: new SizeInfo('.size-info'),
		},
		{
			name: 'changeQueueStyle',
			obj : new ChangeQueueStyle(),
		},
		{
			name: 'changeQueue',
			obj : new ChangeQueue({
				endChangeItem : function(app) {
					console.log(app.queue.items);
				}
			})
		}
	],
	uploadParamsFilter: function(res)
	{
		return {
			dir: 'http://tools/rg-Uploader/upload/attachments'
		};
	},
});
