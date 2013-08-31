(function() {
  'use strict';
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      /*jshint eqeqeq:false, bitwise:false */
      if (this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n !== 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5 internal
        // IsCallable function
        throw new TypeError('Function.prototype.bind - what is ' +
          'trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          NOP = function () {},
          Bound = function () {
            return fToBind.apply(this instanceof NOP && oThis ? this : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      NOP.prototype = this.prototype;
      Bound.prototype = new NOP();

      return Bound;
    };
  }
}());

require.config({
  paths: {
    backbone: 'vendor/backbone/backbone',
    bootstrap: 'vendor/bootstrap/bootstrap',
    d3: 'vendor/d3/d3',
    googleAnalytics: 'vendor/googleAnalytics/googleAnalytics.min',
    jquery: 'vendor/jquery/jquery',
    jqueryUi: 'vendor/jqueryUi/jqueryUi',
    less: 'vendor/less/less',
    text: 'vendor/requireText/text',
    shCore: 'vendor/syntaxHighlighter/shCore',
    shBrushAppleScript: 'vendor/syntaxHighlighter/shBrushAppleScript',
    shBrushAS3: 'vendor/syntaxHighlighter/shBrushAS3',
    shBrushBash: 'vendor/syntaxHighlighter/shBrushBash',
    shBrushColdFusion: 'vendor/syntaxHighlighter/shBrushColdFusion',
    shBrushCpp: 'vendor/syntaxHighlighter/shBrushCpp',
    shBrushCSharp: 'vendor/syntaxHighlighter/shBrushCSharp',
    shBrushCss: 'vendor/syntaxHighlighter/shBrushCss',
    shBrushDelphi: 'vendor/syntaxHighlighter/shBrushDelphi',
    shBrushDiff: 'vendor/syntaxHighlighter/shBrushDiff',
    shBrushErlang: 'vendor/syntaxHighlighter/shBrushErlang',
    shBrushGroovy: 'vendor/syntaxHighlighter/shBrushGroovy',
    shBrushHaxe: 'vendor/syntaxHighlighter/shBrushHaxe',
    shBrushJava: 'vendor/syntaxHighlighter/shBrushJava',
    shBrushJavaFX: 'vendor/syntaxHighlighter/shBrushJavaFX',
    shBrushJScript: 'vendor/syntaxHighlighter/shBrushJScript',
    shBrushPerl: 'vendor/syntaxHighlighter/shBrushPerl',
    shBrushPhp: 'vendor/syntaxHighlighter/shBrushPhp',
    shBrushPlain: 'vendor/syntaxHighlighter/shBrushPlain',
    shBrushPowerShell: 'vendor/syntaxHighlighter/shBrushPowerShell',
    shBrushPython: 'vendor/syntaxHighlighter/shBrushPython',
    shBrushRuby: 'vendor/syntaxHighlighter/shBrushRuby',
    shBrushSass: 'vendor/syntaxHighlighter/shBrushSass',
    shBrushScala: 'vendor/syntaxHighlighter/shBrushScala',
    shBrushSql: 'vendor/syntaxHighlighter/shBrushSql',
    shBrushTypeScript: 'vendor/syntaxHighlighter/shBrushTypeScript',
    shBrushVb: 'vendor/syntaxHighlighter/shBrushVb',
    shBrushXml: 'vendor/syntaxHighlighter/shBrushXml',
    underscore: 'vendor/underscore/underscore',
    initialize: 'init/testing'
  },
  shim: {
    backbone: ['less'],
    bootstrap: ['jquery'],
    jqueryUi: ['jquery'],
    d3: {exports: 'd3'},
    googleAnalytics: {exports: '_gaq'},
    shCore: {exports: 'SyntaxHighlighter'},
    shBrushAppleScript: ['shCore'],
    shBrushAS3: ['shCore'],
    shBrushBash: ['shCore'],
    shBrushColdFusion: ['shCore'],
    shBrushCpp: ['shCore'],
    shBrushCSharp: ['shCore'],
    shBrushCss: ['shCore'],
    shBrushDelphi: ['shCore'],
    shBrushDiff: ['shCore'],
    shBrushErlang: ['shCore'],
    shBrushGroovy: ['shCore'],
    shBrushHaxe: ['shCore'],
    shBrushJava: ['shCore'],
    shBrushJavaFX: ['shCore'],
    shBrushJScript: ['shCore'],
    shBrushPerl: ['shCore'],
    shBrushPhp: ['shCore'],
    shBrushPlain: ['shCore'],
    shBrushPowerShell: ['shCore'],
    shBrushPython: ['shCore'],
    shBrushRuby: ['shCore'],
    shBrushSass: ['shCore'],
    shBrushScala: ['shCore'],
    shBrushSql: ['shCore'],
    shBrushTypeScript: ['shCore'],
    shBrushVb: ['shCore'],
    shBrushXml: ['shCore']
  }
});

require([
  'jquery',
  'underscore',
  'backbone',
  'views/loadbar/loadbar',
  'views/header/header',
  'routers/main',
  'initialize'
], function($, _, Backbone, LoadbarView, HeaderView, mainRouter, initialize) {
  'use strict';

  initialize();

  window.placeholder = function() {
    if (window.hasPlaceholder) {
      return;
    }
    else if (window.hasPlaceholder === undefined) {
      var testInput = document.createElement('input');
      if('placeholder' in testInput) {
        window.hasPlaceholder = true;
        return;
      }
      else {
        window.hasPlaceholder = false;
      }
    }
    $(this).focus(function() {
      if ($(this).val() === $(this).attr('placeholder')) {
        $(this).val('').removeClass('placeholder');
      }
    }).blur(function() {
      if ($(this).val() === $(this).attr('placeholder') ||
          $(this).val() === '') {
        $(this).val($(this).attr('placeholder')).addClass('placeholder');
      }
    }).blur().parents('form').submit(function() {
      $(this).find('input[placeholder]').each(function() {
        if($(this).val() === $(this).attr('placeholder')) {
          $(this).val('');
        }
      });
    }).addClass('placeholder').val($(this).attr('placeholder'));
  };

  window.formatTime = function(time, short) {
    var abbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date(0);
    var curDate = new Date();
    time = time * 1000;
    date.setUTCMilliseconds(parseInt(time, 10));
    var month = abbrev[date.getMonth()];
    var day = date.getDate().toString();
    var year = date.getFullYear().toString();
    var hours = date.getHours();
    var meridiem;
    if (hours > 12) {
      hours = (hours - 12).toString();
      meridiem = 'pm';
    }
    else {
      hours = hours.toString();
      meridiem = 'am';
    }
    if (hours === '0') {
      hours = '12';
    }
    var minutes = date.getMinutes().toString();
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (short) {
      if (curDate.getDate() === date.getDate() &&
          curDate.getMonth() === date.getMonth() &&
          curDate.getFullYear() === date.getFullYear()) {
        time = hours + ':' + minutes + ' ' + meridiem;
      }
      else {
        time = month + ' ' + day;
        if (curDate.getFullYear() !== date.getFullYear()) {
          time += ' ' + year;
        }
      }
    }
    else {
      time = month + ' ' + day + ' ' + year + ' ' +
        hours + ':' + minutes + ' ' + meridiem;
    }

    return time;
  };

  window.formatSize = function(bytes, decimals) {
    if (decimals === undefined) {
      decimals = 1;
    }
    if (!bytes) {
      bytes = '0 bytes';
    }
    else if (bytes < 1024) {
      bytes = bytes + ' bytes';
    }
    else if (bytes < 1048576) {
      bytes = Math.round(bytes / 1024).toFixed(decimals) + ' kB';
    }
    else if (bytes < 1073741824) {
      bytes = (bytes / 1048576).toFixed(decimals) + ' MB';
    }
    else if (bytes < 1099511627776) {
      bytes = (bytes / 1073741824).toFixed(decimals) + ' GB';
    }
    else {
      bytes = (bytes / 1099511627776).toFixed(decimals) + ' TB';
    }

    return bytes;
  };

  window.reverseFormatSize = function(input) {
    var i;
    var inputChar;
    var inputSplit = input.split('');
    var bytes;
    var size = '';
    var unit = '';
    var onSize = true;
    var alpha = 'abcdefghijklmnopqrstuvwxyz';
    var byteUnits = ['', 'b', 'byte'];
    var kilobyteUnits = ['kb', 'kbyte', 'kilobyte'];
    var megabyteUnits = ['mb', 'mbyte', 'megabyte'];
    var gigabyteUnits = ['gb', 'gbyte', 'gigabyte'];
    var terabyteUnits = ['tb', 'tbyte', 'terabyte'];
    var bitUnits = ['bit'];
    var kilobitUnits = ['kbit', 'kilobit'];
    var megabitUnits = ['mbit', 'megabit'];
    var gigabitUnits = ['gbit', 'gigabit'];
    var terabitUnits = ['tbit', 'terabit'];

    for (i = 0; i < inputSplit.length; i++) {
      inputChar = inputSplit[i];
      if (onSize) {
        if (inputChar !== ' ' && (!isNaN(inputChar) || inputChar === '.')) {
          size += inputChar;
          continue;
        }
        else if (inputChar === ',') {
          continue;
        }
        onSize = false;
      }

      if (alpha.indexOf(inputChar.toLowerCase()) !== -1) {
        unit += inputChar.toLowerCase();
      }
    }

    size = parseFloat(size);
    if (isNaN(size)) {
      return null;
    }
    unit = unit.replace('sec', '').replace('ss', '').replace('s', '');

    if ($.inArray(unit, byteUnits) !== -1) {
      bytes = parseInt(size, 10);
    }
    else if ($.inArray(unit, kilobyteUnits) !== -1) {
      bytes = parseInt(size * 1024, 10);
    }
    else if ($.inArray(unit, megabyteUnits) !== -1) {
      bytes = parseInt(size * 1048576, 10);
    }
    else if ($.inArray(unit, gigabyteUnits) !== -1) {
      bytes = parseInt(size * 1073741824, 10);
    }
    else if ($.inArray(unit, terabyteUnits) !== -1) {
      bytes = parseInt(size * 1099511627776, 10);
    }
    else if ($.inArray(unit, bitUnits) !== -1) {
      bytes = parseInt(size * 0.125, 10);
    }
    else if ($.inArray(unit, kilobitUnits) !== -1) {
      bytes = parseInt(size * 128, 10);
    }
    else if ($.inArray(unit, megabitUnits) !== -1) {
      bytes = parseInt(size * 131072, 10);
    }
    else if ($.inArray(unit, gigabitUnits) !== -1) {
      bytes = parseInt(size * 134217728, 10);
    }
    else if ($.inArray(unit, terabitUnits) !== -1) {
      bytes = parseInt(size * 137438953472, 10);
    }
    else {
      bytes = null;
    }

    return bytes;
  };

  $.fn.roll = function(timeout, complete) {
    var timer;

    var rotate = function(degree) {
      $(this).css('-webkit-transform', 'rotate(' + degree + 'deg)');
      $(this).css('-moz-transform', 'rotate(' + degree + 'deg)');
      $(this).css('-ms-transform', 'rotate(' + degree + 'deg)');
      $(this).css('-o-transform', 'rotate(' + degree + 'deg)');
      $(this).css('transform', 'rotate(' + degree + 'deg)');

      timer = setTimeout(function() {
        degree += 1;
        rotate(degree);
      }, 4);
    }.bind(this);

    rotate(0);

    setTimeout(function() {
      clearTimeout(timer);

      $(this).css('-webkit-transform', 'rotate(0deg)');
      $(this).css('-moz-transform', 'rotate(0deg)');
      $(this).css('-ms-transform', 'rotate(0deg)');
      $(this).css('-o-transform', 'rotate(0deg)');
      $(this).css('transform', 'rotate(0deg)');

      if (complete) {
        complete();
      }
    }.bind(this), timeout);
  };

  $(document).on('dblclick mousedown', '.no-select', false);

  var headerView = new HeaderView();
  $('body').prepend(headerView.render().el);

  window.loadbar = new LoadbarView();
  $('body').prepend(window.loadbar.render().el);

  mainRouter.initialize();
});
