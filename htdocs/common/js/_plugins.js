(function($, _) {

  "use strict";

  /**
   * Image rollover.
   */
  var Swap = (function() {

    Swap.prototype.defaults = {
      suffix   : '_on',
      excludes : ['_current']
    };

    function Swap($el, options) {
      this.o = $.extend({}, this.defaults, options);
      this.$el = $el;
      this.defaultSrc = $el.attr('src');

      if (this._isExclude()) {
        this._saveSrc();
        this._setEvents();
      }
    }

    Swap.prototype._isExclude = function() {
      var reExcludes;

      this.o.excludes = this.o.excludes.push(this.o.suffix);
      reExcludes = new RegExp(this.o.excludes.join('|'));

      if (this.defaultSrc && !reExcludes.test(this.defaultSrc)) {
        return false;
      } else {
        return true;
      }
    };

    Swap.prototype._saveSrc = function() {
      var reFilename = /\.(gif|jpe?g|png)$/;

      this.overSrc = this.defaultSrc.replace(reFilename, this.o.suffix + ".$1");
      $('<img />').attr('src', this.overSrc);
    };

    Swap.prototype._setEvents = function() {
      var _this = this;

      this.$el
        .on('mouseenter.rollover', function() {
          return _this.toOver;
        })
        .on('mouseleave.rollover', function() {
          return _this.toDefault;
        });
    };

    Swap.prototype.toOver = function() {
      this.$el.attr('src', this.overSrc);
    };

    Swap.prototype.toDefault = function() {
      this.$el.attr('src', this.defaultSrc);
    };

    return Swap;

  })();

  $.fn.swap = function(options) {
    return this.each(function(i, el) {
      var $el, swap;

      $el = $(this);
      swap = new Swap($el, options);
      $el.data('swap', swap);
    });
  };


  /**
   * Smooth scroll
   */
  var SmoothScroll = (function() {

    SmoothScroll.prototype.defaults = {
      selector : null,
      speed    : 900,
      easing   : 'easeInOutQuad',
      callback : null
    };

    function SmoothScroll($el, options) {
      this.o = $.extend({}, this.defaults, options);
      this.$el = $el;

      this._getScrollBody();
      this._setEvents();
    }

    SmoothScroll.prototype._getScrollBody = function() {
      var scrollTop = $(window).scrollTop();

      $(window).scrollTop(scrollTop+1);

      if ($('html').scrollTop() > 0) {
        this.$scrollBody = $('html');
      } else {
        this.$scrollBody = $('body');
      }

      $(window).scrollTop(scrollTop);
    };

    SmoothScroll.prototype._setEvents = function() {
      var _this = this;

      this.$el
        .off('click')
        .on('click.smoothScroll', function() {
          _this.$target = this.hash ? $(this.hash) : null;
          if (_this.$target && _this.$target.length) {
            _this.scrollTo(this.hash);
            return false;
          }
        });
    };

    SmoothScroll.prototype.scrollTo = function() {
      var _this = this,
          maxOffset = $(document).height() - $(window).height(),
          offset = Math.min(maxOffset, this.$target.offset().top);

      this.$scrollBody.animate({
        scrollTop: offset
      }, this.o.speed, this.o.easing, function() {
        if (_this.o.callback) {
          _this.o.callback();
        }
      });
    };

    return SmoothScroll;

  })();

  $.smoothScroll = function(hash, options) {
    var $el, imageRollover;

    $el = $('<a>').attr('href', hash);
    imageRollover = new SmoothScroll($el, options);
    imageRollover.trigger('click.smoothScroll');
  };

  $.fn.smoothScroll = function(options) {
    return this.each(function() {
      var $el, smoothScroll;

      $el = $(this);
      smoothScroll = new SmoothScroll($el, options);
      $el.data('smoothScroll', smoothScroll);
    });
  };


  /**
   * Accordion
   */
  var Accordion = (function() {

    Accordion.prototype.defaults = {
      handle         : '.js-accordion-handle',
      content        : '.js-accordion-content',
      speed          : 'fast',
      easing         : 'easeOutExpo',
      collapsedClass : 'is-collapsed',
      expandedClass  : 'is-expanded'
    };

    function Accordion($el, options) {
      this.o = $.extend({}, this.defaults, options);
      this.$el = $el;
      this.$handle = this.$el.find(this.o.handle);
      this.$content = this.$el.find(this.o.content);
      this.defaultView = this.$el.data('accordionDefault') || 'collapsed';

      if (this.$handle.length && this.$content.length) {
        this._setDefault();
        this._setEvents();
      }
    }

    Accordion.prototype._setDefault = function() {
      if (this.defaultView === 'collapsed') {
        this.$el.addClass(this.o.collapsedClass);
        this.$content.hide();
      } else if (this.defaultView === 'expanded') {
        this.$el.addClass(this.o.expandedClass);
        this.$content.show();
      }
    };

    Accordion.prototype._setEvents = function() {
      var _this = this;

      this.$handle
        .on('click', function() {
          return _this.toggle();
      });
    };

    Accordion.prototype.expand = function() {
      this.$content
        .show();

      if ($.type($.equalHeights) !== 'undefined') {
        $.equalHeights();
      }

      this.$content
        .hide()
        .slideDown(this.o.speed, this.o.easing);

      this.$el
        .removeClass(this.o.collapsedClass)
        .addClass(this.o.expandedClass);
    };

    Accordion.prototype.collapse = function() {
      this.$content
        .slideUp(this.o.speed, this.o.easing);

      this.$el
        .removeClass(this.o.expandedClass)
        .addClass(this.o.collapsedClass);
    };

    Accordion.prototype.toggle = function() {
      if (this.$content.is(':visible')) {
        this.collapse();
      } else {
        this.expand();
      }

      return false;
    };

    return Accordion;

  })();

  $.fn.accordion = function(options) {
    return this.each(function(i, el) {
      var $el, accordion;

      $el = $(this);
      accordion = new Accordion($el, options);
      $el.data('accordion', accordion);
    });
  };


  /**
   * Tab
   */
  var Tab = (function() {

    Tab.prototype.defaults = {
      handle : '.js-tab-handle a, a.js-tab-handle',
      target : '.js-tab-content'
    };

    function Tab($el, options) {
      this.o = $.extend({}, this.defaults, options);
      this.$el = $el;
      this.$handle = this.$el.find(this.o.handle);
      this.$target = this.$el.find(this.o.target);

      if (this.$handle.length && this.$target.length) {
        this._setEvents();
      }
    }

    Tab.prototype._setEvents = function() {
      var _this = this;

      this.$handle
        .off('click')
        .on('click.tab', function() {
          if (!$(this).hasClass('is-current')) {
            _this.contentId = $(this).attr('href').replace(/.*?#/, '#');
            _this._updateHandle();
            _this._updateTarget();
          }
          return false;
        })
        .first()
          .trigger('click.tab');
    };

    Tab.prototype._updateHandle = function() {
      this.$handle
        .removeClass('is-current')
        .filter('[href$=' + this.contentId + ']')
          .addClass('is-current');
    };

    Tab.prototype._updateTarget = function() {
      this.$target
        .removeClass('is-current')
        .hide()
        .filter(this.contentId)
          .addClass('is-current')
          .show();

      if ($.type($.equalHeights) !== 'undefined') {
        $.equalHeights();
      }
    };

    return Tab;

  })();

  $.fn.tab = function(options) {
    return this.each(function(i, el) {
      var $el, tab;

      $el = $(this);
      tab = new Tab($el, options);
      $el.data('tab', tab);
    });
  };


  /**
   * Popup
   */
  var Popup = (function() {

    Popup.prototype.defaults = {
      width      : 600,
      height     : 500,
      menubar    : 'no',
      toolbar    : 'no',
      location   : 'no',
      status     : 'no',
      resizable  : 'no',
      scrollbars : 'no'
    };

    function Popup($el, options) {
      this.o = $.extend({}, this.defaults, options);
      this.$el = $el;

      this._setEvents();
    }

    Popup.prototype._setEvents = function() {
      var _this = this;

      this.$el.filter('[href]')
        .off('click')
        .on('click.popup', function() {
          return _this.open();
        });
    };

    Popup.prototype.open = function() {
      var optionString;

      this.o.top = Math.floor((window.screen.height - this.o.height) / 2);
      this.o.left = Math.floor((window.screen.width - this.o.width) / 2);
      optionString = $.param(this.o).replace(/&/g,',');

      window.open($(this).attr('href'), '', optionString);

      return false;
    };

    return Popup;

  })();

  $.fn.popup = function(options) {
    return this.each(function(i, el) {
      var $el, popup;

      $el = $(this);
      popup = new Popup($el, options);
      $el.data('popup', popup);
    });
  };


  /**
   * Equalize heights
   */
  var equalHeights = (function() {
    var groups = [];

    var initialize = (function() {
      if ($.type($.fontSizeDetector) !== 'undefined') {
        $.fontSizeDetector.addEventListener(equalizeAll);
      }
    })();

    var equalize = function($targets) {
      var highest = 0;

      $targets
        .height('auto')
        .each(function() {
          if ($(this).height() > highest) {
            highest = $(this).height();
          }
        });

      if (highest > 0) {
        $targets.height(highest);
      }
    };

    var equalizeAll = function() {
      if (!groups.length) {
        return false;
      }

      $.each(groups, function(i, set) {
        equalize(set);
      });
    };

    return {
      add: function(item) {
        groups.push(item);
        return equalize(item);
      },
      equalize : function() {
        return equalizeAll();
      }
    };
  })();

  $.equalHeights = function() {
    return equalHeights.equalize();
  };

  $.fn.equalHeights = function() {
    equalHeights.add(this);
    return this;
  };


  /**
   * Font size detector
   */
  var FontSizeDetector = (function() {

    function FontSizeDetector() {
      var _this = this;

      this.listeners = [];
      this.lastSize = 0;
      this.$checker = $('<span id="font-size-checker"></span>')
        .css({
          width      : '1em',
          height     : '1px',
          position   : 'absolute',
          top        : '-1px',
          left       : '-1em',
          fontFamily : 'monospace'
        })
        .appendTo('body');

      setInterval(function() {
        _this.detect();
      }, 1000);
    }

    FontSizeDetector.prototype.addEventListener = function(fn) {
      this.listeners.push(fn);
      this.detect();
    };

    FontSizeDetector.prototype.detect = function() {
      var currentSize = this.$checker.width();

      if (this.lastSize !== currentSize) {
        this.lastSize = currentSize;
        this._runEvents();
      }
    };

    FontSizeDetector.prototype._runEvents = function() {
      if (!this.listeners.length) {
        return;
      }

      $.each(this.listeners, function(i, listener) {
        listener();
      });
    };

    return FontSizeDetector;

  })();

  $.fontSizeDetector = new FontSizeDetector();

}(window.jQuery, window._));