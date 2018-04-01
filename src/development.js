import RGUploader from './RG_Uploader';
import './scss/index.scss';

import SizeInfo from './plugins/sizeinfo.plugin';
import ChangeQueueStyle from './plugins/changeQueueStyle.plugin';
import ChangeQueue from './plugins/changeQueue.plugin';
import DragAndDrop from './plugins/dnd.plugin';
import Preview from './plugins/preview.plugin';
import Thumbnail from './plugins/thumbnail.plugin';

// plugin vendors
import Sortable from 'sortablejs';
import croppie from 'croppie';


window.rgUploader = new RGUploader(document.getElementById('example_basic'), {
	autoUpload: true,
	uploadScript: '/upload',
	removeScript: '/remove',
	externalFileForm : document.querySelector('#external'),
	queue: {
		height: 240,
		datas: '/data',
		buttons: [
			{
				name: 'make thumbnail image',
				iconName: 'apps',
				className: 'btn-make-thumbnail',
				show : function(file) {
					return (file.type.split('/')[0] === 'image');
				},
				action : function(app, file) {
					if (!app.plugin.child.thumbnail) return false;
					var plug = app.plugin.child.thumbnail;

					plug.assignOption({
						doneCallback : function(res) {
							app.queue.import([res]);
						}
					});
					plug.open(file);
				}
			},
			{
				name : 'remove queue',
				iconName : 'close',
				className : 'btn-remove-queue',
				action : function(app, file) {
					app.queue.removeQueue(file.id, false, true);
				}
			}
		]
	},
	plugin: [
		{
			name: 'changeQueue',
			obj: new ChangeQueue({
				class_sortable: Sortable,
				endChangeItem: function(app)
				{
					console.log('USER::endChangeItem', app.queue.items);
				}
			})
		},
		{
			name: 'changeQueueStyle',
			obj: new ChangeQueueStyle(),
		},
		{
			name: 'dragAndDrop',
			obj: new DragAndDrop(),
		},
		{
			name: 'preview',
			obj: new Preview(),
		},
		{
			name: 'sizeinfo',
			obj: new SizeInfo('.size-info'),
		},
		{
			name: 'thumbnail',
			obj: new Thumbnail({
				class_croppie: croppie.Croppie,
			}),
		},
	],
	uploadParamsFilter: function(res)
	{
		return {
			dir: '/upload/attachments'
		};
	},
	uploadComplete: function(file)
	{
		console.log('USER::uploadComplete', file);
	},
	removeDataFilter: function(res)
	{
		console.log('USER::removeDataFilter', res);
		return {
			state: 'success',
		}
	}
});
