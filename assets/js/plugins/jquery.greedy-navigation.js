/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];
var mobileBreakpoint = 925;

function updateNav() {

  /* on mobile: items already moved by inline script in masthead.html,
     just ensure button is visible and return */
  if (window.innerWidth < mobileBreakpoint) {
    $btn.removeClass('hidden');
    $btn.css({'display': 'block', 'visibility': 'visible'});
    var mh = $('.masthead').height();
    $('body').css('padding-top', mh + 'px');
    if ($(".author__urls-wrapper button").is(":visible")) {
      $(".sidebar").css("padding-top", "");
    } else {
      $(".sidebar").css("padding-top", mh + "px");
    }
    return;
  }

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

  if ($vlinks.width() > availableSpace) {

    while ($vlinks.width() > availableSpace && $vlinks.children("*:not(.persist)").length > 0) {
      breaks.push($vlinks.width());
      $vlinks.children("*:not(.persist)").last().prependTo($hlinks);
      availableSpace = $btn.hasClass("hidden") ? $nav.width() : $nav.width() - $btn.width() - 30;
      $btn.removeClass("hidden");
    }

  } else {

    while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
      if ($vlinks_persist_tail.children().length > 0) {
        $hlinks.children().first().insertBefore($vlinks_persist_tail);
      } else {
        $hlinks.children().first().appendTo($vlinks);
      }
      breaks.pop();
    }

    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $btn.removeClass('close');
      $hlinks.addClass('hidden');
    }
  }

  $btn.attr("count", breaks.length);

  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }

}

$(window).on('resize', function () {
  updateNav();
});
screen.orientation.addEventListener("change", function () {
  updateNav();
});

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();
