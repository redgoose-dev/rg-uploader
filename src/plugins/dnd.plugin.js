function RG_DragAndDrop(el, jquery)
{
  this.name = 'Drag And Drop';
  this.areaElements = [];

  var $ = jquery || $ || jQuery;
  var self = this;
  var app = null;

  if (!$) return;

  /**
   * init file drag and drop event
   *
   * @Param {Array} area
   * @Return {Object}
   */
  var fileDragAndDrop = function(area)
  {
    if (!window.File || !window.FileList || !window.FileReader || !window.Blob) return false;
    if (!area.length) return false;

    var defer = $.Deferred();
    var over = false;

    /**
     * dragover handler
     *
     * @Param {Object} e
     */
    var overHandler = function(e)
    {
      e.stopPropagation();
      e.preventDefault();

      if (e.type === 'dragover')
      {
        if (over) return false;
        over = true;
        $(e.currentTarget).addClass('drop-mode');
        e.dataTransfer.dropEffect = 'copy';
      }
      else
      {
        over = false;
        $(e.currentTarget).removeClass('drop-mode');
      }
      return false;
    };

    /**
     * drop handler
     *
     * @Param {Object} e
     */
    var dropHandler = function(e)
    {
      e.stopPropagation();
      e.preventDefault();

      overHandler(e);

      var files = (e.dataTransfer) ? e.dataTransfer.files : null;
      if (files && files.length)
      {
        defer.notify(files);
      }
      return false;
    };

    // set events
    for (var i=0; i<area.length; i++)
    {
      area[i].addEventListener('dragover', overHandler, false);
      area[i].addEventListener('dragleave', overHandler, false);
      area[i].addEventListener('drop', dropHandler, false);
    }

    return defer.promise();
  };

  /**
   * done event
   *
   * @Param {FileList} files
   */
  var done = function(files)
  {
    if (app.uploader.uploading)
    {
      alert(app.lang('error_add_upload'));
      return false;
    }

    // play upload
    app.uploader.start(files || []);
  };


  /**
   * init
   *
   * @Param {Object} parent
   */
  this.init = function(parent)
  {
    app = parent;

    // set external area
    var externalAreaElements = !!el ? $(el) : null;

    // push area elements
    this.areaElements.push(app.queue.$queue.parent().get(0));
    if (externalAreaElements)
    {
      externalAreaElements.each(function(){
        self.areaElements.push(this);
      });
    }

    // init event
    if (this.areaElements.length)
    {
      var dnd = fileDragAndDrop(this.areaElements);
      if (dnd && dnd.progress)
      {
        dnd.progress(done);
      }
    }
  }
}

export default RG_DragAndDrop;
