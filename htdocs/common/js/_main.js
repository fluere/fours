(function($, _) {

  "use strict";

  /**
   * On DOM ready.
   */
  var onDomReady = function() {
    setUpSwap();
    setUpSmoothScroll();
    setUpAccordion();
    setUpTab();
    setUpPopup();
  };

  /**
   * On load.
   */
  var onLoad = function() {
    setUpEqualHeights();
  };

  /**
   * Set up rollover.
   */
  var setUpSwap = function() {
    $('img.js-swap, input.js-swap').swap();
  };

  /**
   * Set up smooth scroll.
   */
  var setUpSmoothScroll = function() {
    $('a[href^="#"], area[href^="#"]').smoothScroll();
  };

  /**
   * Set up accordion.
   */
  var setUpAccordion = function() {
    $('.js-accordion').accordion();
  };

  /**
   * Set up tab.
   */
  var setUpTab = function() {
    $('.js-tab').tab();
  };

  /**
   * Set up popup.
   */
  var setUpPopup = function() {
    $('.js-popup').popup();
  };

  /**
   * Set up equal heights.
   */
  var setUpEqualHeights = function() {
    var $hiddenContent = $('.js-tab-content, .js-accordion-content').filter(':hidden'),
        hasHiddenContent = !!$hiddenContent.length,
        tabGroup,
        itemGroup = {};

    if (hasHiddenContent) {
      $hiddenContent
        .addClass('js-hidden-content')
        .show();
    }

    $('.js-equal-heights').each(function() {
      var groupName = '';

      if (hasHiddenContent) {
        tabGroup = $(this).parents('.js-tab-content').eq(0).attr('id');
        groupName = tabGroup ? ('tab-' + tabGroup + '-') : '';
      }

      if ($(this).data('equalHeightsGroup')) {
        groupName += 'group-' + $(this).data('equalHeightsGroup');
      } else {
        groupName += 'offset-' + $(this).offset().top;
      }

      if (!(groupName in itemGroup)) {
        itemGroup[groupName] = $([]);
      }

      itemGroup[groupName] = itemGroup[groupName].add(this);
    });

    if (hasHiddenContent) {
      $hiddenContent
        .filter('.js-hidden-content')
          .hide();
    }

    $.each(itemGroup, function() {
      this.equalHeights();
    });
  };

  /* DOMContentLoaded. */
  $(document).ready(onDomReady);

  /* Window on loaded. */
  $(window).on('load', onLoad);

})(window.jQuery, window._);