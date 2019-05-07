import RGUploader from '../src/rg-uploader';
import Sortable from 'sortablejs';
import croppie from 'croppie';

window.rgUploader = new RGUploader(document.getElementById('dev'), {
  autoUpload: true,
  uploadScript: '/upload',
  removeScript: '/remove',
});
