import $ from 'jquery';
import RGUploader from '../src/rg-uploader';
import * as plugins from '../src/plugins';
import Sortable from 'sortablejs';
import croppie from 'croppie';

window.rgUploader = new RGUploader(document.getElementById('dev'), {
  autoUpload: true,
  uploadScript: '/upload',
  removeScript: '/remove',
  allowFileTypes : ['jpeg', 'jpg', 'png', 'gif', 'zip', 'pdf', 'txt', 'swf'],
  uploadHeaders: { 'UPLOAD_AUTH': '1' },
  removeHeaders: { 'REMOVE_AUTH': '1' },
  externalFileForm : document.querySelector('#external'),
  queue: {
    height: 180,
    datas: '/data',
    buttons: [
      {
        name: 'make thumbnail image',
        iconName: 'apps',
        className: 'btn-make-thumbnail',
        show(file)
        {
          return !!(file.type && file.type.split('/')[0] === 'image');
        },
        action(app, file)
        {
          if (!app.plugin.child.thumbnail) return false;
          const plugin = app.plugin.child.thumbnail;
          plugin.assignOption({
            doneCallback(res) {
              app.queue.import([res]);
            }
          });
          plugin.open(file);
        },
      },
      {
        name: 'remove queue',
        iconName: 'close',
        className: 'btn-remove-queue',
        action(app, file)
        {
          app.queue.removeQueue(file.id, false, true);
        },
      },
      {
        name: 'foo',
        iconName: 'extension',
        className: 'btn-foooooo',
        action(app, file)
        {
          app.queue.changeId(file.id, 111111);
        },
      }
    ],
  },
  plugin: [
    {
      name: 'changeQueue',
      obj: new plugins.ChangeQueue({
        class_sortable: Sortable,
        endChangeItem(app)
        {
          console.log('USER::endChangeItem', app.queue.items);
        }
      }, $)
    },
    {
      name: 'changeQueueStyle',
      obj: new plugins.ChangeQueueStyle(document.querySelector('.rg-uploader > header'), $),
    },
    {
      name: 'dragAndDrop',
      obj: new plugins.DragAndDrop(document.querySelector('.external-dropzone'), $),
    },
    {
      name: 'preview',
      obj: new plugins.Preview($),
    },
    {
      name: 'sizeinfo',
      obj: new plugins.SizeInfo(document.querySelector('.size-info'), $),
    },
    {
      name: 'thumbnail',
      obj: new plugins.Thumbnail({
        class_croppie: croppie.Croppie,
      }, $),
    },
  ],
  uploadComplete(file, app)
  {
    console.log('USER::uploadComplete', file);
  },
  removeDataFilter(res)
  {
    console.log('USER::removeDataFilter', res);
    return {
      state: 'success',
    }
  },
  uploadCompleteAll(app)
  {
    console.log('uploadCompleteAll', app)
  },
  uploadDataFilter(src)
  {
    console.log('uploadDataFilter', src);
    return {
      ...src,
    };
  },
  init(app)
  {
    app.$container.find('.toggle-select-all').on('click', () => app.queue.toggleSelectAllQueues());
  }
});
