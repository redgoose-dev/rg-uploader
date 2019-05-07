function RG_Preview()
{
  this.name = 'Preview';
  this.$preview = null;

  var self = this;
  var app = null;
  var classNameNotImage = 'not-image';
  var width = 150;

  /**
   * create preview
   */
  var createPreview = function()
  {
    var str = '<div class="col preview"><figure></figure></div>';
    self.$preview = $(str);

    // set width
    self.$preview.width(width);

    // append element
    app.$container.find('[data-comp=queue]').prepend(self.$preview);

    // update
    updatePreview();
  };

  /**
   * update preview
   *
   * @Param {String} src
   */
  var updatePreview = function(src)
  {
    var $figure = self.$preview.children('figure');
    if (src)
    {
      $figure
        .css('backgroundImage', 'url(\'' + src + '\')')
        .removeClass(classNameNotImage);
    }
    else
    {
      $figure.attr('style', '').addClass(classNameNotImage);
    }
  };

  /**
   * visible preview
   *
   * @Param {Boolean} src
   */
  var visiblePreview = function(sw)
  {
    if (sw)
    {
      self.$preview.removeClass('hide');
    }
    else
    {
      self.$preview.addClass('hide');
    }
  };


  /**
   * init
   *
   * @Param {Object} parent
   */
  this.init = function(parent)
  {
    app = parent;

    // get preview width
    width = parseInt(app.options.queue.height || parent.$container.find('.body').height());

    // set container body height
    parent.$container.find('.body').height(width);

    // play create preview
    createPreview();
  };

  /**
   * event listener
   *
   * @Param {String} type
   * @Param {*} value
   */
  this.eventListener = function(type, value)
  {
    switch(type) {
      // select queue
      case 'queue.selectQueue':
        var id = value.$selectElement.data('id');
        var n = app.queue.findItem(id);
        var file = app.queue.items.files[n];
        var src = (value.$selectElement.hasClass('selected') && (file.type.split('/')[0] === 'image')) ? file.fullSrc : null;
        updatePreview(src);
        break;

      // change queue style
      case 'queue.changeStyle':
        visiblePreview( (value.style === 'list') );
        break;
    }
  }
}

export default RG_Preview;
