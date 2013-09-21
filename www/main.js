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
    ace: 'vendor/ace/ace',
    aceModeAbap: 'vendor/ace/mode-abap',
    aceModeActionscript: 'vendor/ace/mode-actionscript',
    aceModeAda: 'vendor/ace/mode-ada',
    aceModeAsciidoc: 'vendor/ace/mode-asciidoc',
    aceModeAssemblyX86: 'vendor/ace/mode-assembly_x86',
    aceModeAutohotkey: 'vendor/ace/mode-autohotkey',
    aceModeBatchfile: 'vendor/ace/mode-batchfile',
    aceModeCcpp: 'vendor/ace/mode-c_cpp',
    aceModeClojure: 'vendor/ace/mode-clojure',
    aceModeCobol: 'vendor/ace/mode-cobol',
    aceModeCoffee: 'vendor/ace/mode-coffee',
    aceModeColdfusion: 'vendor/ace/mode-coldfusion',
    aceModeCsharp: 'vendor/ace/mode-csharp',
    aceModeCss: 'vendor/ace/mode-css',
    aceModeD: 'vendor/ace/mode-d',
    aceModeDart: 'vendor/ace/mode-dart',
    aceModeDiff: 'vendor/ace/mode-diff',
    aceModeDjango: 'vendor/ace/mode-django',
    aceModeDot: 'vendor/ace/mode-dot',
    aceModeErlang: 'vendor/ace/mode-erlang',
    aceModeForth: 'vendor/ace/mode-forth',
    aceModeFtl: 'vendor/ace/mode-ftl',
    aceModeGlsl: 'vendor/ace/mode-glsl',
    aceModeGolang: 'vendor/ace/mode-golang',
    aceModeGroovy: 'vendor/ace/mode-groovy',
    aceModeHaml: 'vendor/ace/mode-haml',
    aceModeHaskell: 'vendor/ace/mode-haskell',
    aceModeHaxe: 'vendor/ace/mode-haxe',
    aceModeHtml: 'vendor/ace/mode-html',
    aceModeHtmlRuby: 'vendor/ace/mode-html_ruby',
    aceModeIni: 'vendor/ace/mode-ini',
    aceModeJava: 'vendor/ace/mode-java',
    aceModeJavascript: 'vendor/ace/mode-javascript',
    aceModeJson: 'vendor/ace/mode-json',
    aceModeJsp: 'vendor/ace/mode-jsp',
    aceModeJsx: 'vendor/ace/mode-jsx',
    aceModeJulia: 'vendor/ace/mode-julia',
    aceModeLatex: 'vendor/ace/mode-latex',
    aceModeLess: 'vendor/ace/mode-less',
    aceModeLisp: 'vendor/ace/mode-lisp',
    aceModeLivescript: 'vendor/ace/mode-livescript',
    aceModeLsl: 'vendor/ace/mode-lsl',
    aceModeLua: 'vendor/ace/mode-lua',
    aceModeLuapage: 'vendor/ace/mode-luapage',
    aceModeLucene: 'vendor/ace/mode-lucene',
    aceModeMakefile: 'vendor/ace/mode-makefile',
    aceModeMarkdown: 'vendor/ace/mode-markdown',
    aceModeMatlab: 'vendor/ace/mode-matlab',
    aceModeMysql: 'vendor/ace/mode-mysql',
    aceModeObjectivec: 'vendor/ace/mode-objectivec',
    aceModeOcaml: 'vendor/ace/mode-ocaml',
    aceModePascal: 'vendor/ace/mode-pascal',
    aceModePerl: 'vendor/ace/mode-perl',
    aceModePhp: 'vendor/ace/mode-php',
    aceModePlainText: 'vendor/ace/mode-plain_text',
    aceModePowershell: 'vendor/ace/mode-powershell',
    aceModeProlog: 'vendor/ace/mode-prolog',
    aceModeProperties: 'vendor/ace/mode-properties',
    aceModePython: 'vendor/ace/mode-python',
    aceModeR: 'vendor/ace/mode-r',
    aceModeRhtml: 'vendor/ace/mode-rhtml',
    aceModeRuby: 'vendor/ace/mode-ruby',
    aceModeRust: 'vendor/ace/mode-rust',
    aceModeSass: 'vendor/ace/mode-sass',
    aceModeScala: 'vendor/ace/mode-scala',
    aceModeScheme: 'vendor/ace/mode-scheme',
    aceModeScss: 'vendor/ace/mode-scss',
    aceModeSh: 'vendor/ace/mode-sh',
    aceModeSql: 'vendor/ace/mode-sql',
    aceModeSvg: 'vendor/ace/mode-svg',
    aceModeTcl: 'vendor/ace/mode-tcl',
    aceModeTex: 'vendor/ace/mode-tex',
    aceModeText: 'vendor/ace/mode-text',
    aceModeToml: 'vendor/ace/mode-toml',
    aceModeTwig: 'vendor/ace/mode-twig',
    aceModeTypescript: 'vendor/ace/mode-typescript',
    aceModeVbscript: 'vendor/ace/mode-vbscript',
    aceModeVelocity: 'vendor/ace/mode-velocity',
    aceModeVerilog: 'vendor/ace/mode-verilog',
    aceModeXml: 'vendor/ace/mode-xml',
    aceModeXquery: 'vendor/ace/mode-xquery',
    aceModeYaml: 'vendor/ace/mode-yaml',
    aceThemeAmbiance: 'vendor/ace/theme-ambiance',
    aceThemeChrome: 'vendor/ace/theme-chrome',
    aceThemeGithub: 'vendor/ace/theme-github',
    aceThemeMonokai: 'vendor/ace/theme-monokai',
    aceThemeTwilight: 'vendor/ace/theme-twilight',
    backbone: 'vendor/backbone/backbone',
    bootstrap: 'vendor/bootstrap/bootstrap',
    d3: 'vendor/d3/d3',
    googleAnalytics: 'vendor/googleAnalytics/googleAnalytics.min',
    jquery: 'vendor/jquery/jquery',
    jqueryUi: 'vendor/jqueryUi/jqueryUi',
    less: 'vendor/less/less',
    text: 'vendor/requireText/text',
    underscore: 'vendor/underscore/underscore',
    initialize: 'init/testing'
  },
  shim: {
    ace: {exports: 'ace'},
    aceModeAbap: ['ace'],
    aceModeActionscript: ['ace'],
    aceModeAda: ['ace'],
    aceModeAsciidoc: ['ace'],
    aceModeAssemblyX86: ['ace'],
    aceModeAutohotkey: ['ace'],
    aceModeBatchfile: ['ace'],
    aceModeCcpp: ['ace'],
    aceModeClojure: ['ace'],
    aceModeCobol: ['ace'],
    aceModeCoffee: ['ace'],
    aceModeColdfusion: ['ace'],
    aceModeCsharp: ['ace'],
    aceModeCss: ['ace'],
    aceModeD: ['ace'],
    aceModeDart: ['ace'],
    aceModeDiff: ['ace'],
    aceModeDjango: ['ace'],
    aceModeDot: ['ace'],
    aceModeErlang: ['ace'],
    aceModeForth: ['ace'],
    aceModeFtl: ['ace'],
    aceModeGlsl: ['ace'],
    aceModeGolang: ['ace'],
    aceModeGroovy: ['ace'],
    aceModeHaml: ['ace'],
    aceModeHaskell: ['ace'],
    aceModeHaxe: ['ace'],
    aceModeHtml: ['ace'],
    aceModeHtmlRuby: ['ace'],
    aceModeIni: ['ace'],
    aceModeJava: ['ace'],
    aceModeJavascript: ['ace'],
    aceModeJson: ['ace'],
    aceModeJsp: ['ace'],
    aceModeJsx: ['ace'],
    aceModeJulia: ['ace'],
    aceModeLatex: ['ace'],
    aceModeLess: ['ace'],
    aceModeLisp: ['ace'],
    aceModeLivescript: ['ace'],
    aceModeLsl: ['ace'],
    aceModeLua: ['ace'],
    aceModeLuapage: ['ace'],
    aceModeLucene: ['ace'],
    aceModeMakefile: ['ace'],
    aceModeMarkdown: ['ace'],
    aceModeMatlab: ['ace'],
    aceModeMysql: ['ace'],
    aceModeObjectivec: ['ace'],
    aceModeOcaml: ['ace'],
    aceModePascal: ['ace'],
    aceModePerl: ['ace'],
    aceModePhp: ['ace'],
    aceModePlainText: ['ace'],
    aceModePowershell: ['ace'],
    aceModeProlog: ['ace'],
    aceModeProperties: ['ace'],
    aceModePython: ['ace'],
    aceModeR: ['ace'],
    aceModeRhtml: ['ace'],
    aceModeRuby: ['ace'],
    aceModeRust: ['ace'],
    aceModeSass: ['ace'],
    aceModeScala: ['ace'],
    aceModeScheme: ['ace'],
    aceModeScss: ['ace'],
    aceModeSh: ['ace'],
    aceModeSql: ['ace'],
    aceModeSvg: ['ace'],
    aceModeTcl: ['ace'],
    aceModeTex: ['ace'],
    aceModeText: ['ace'],
    aceModeToml: ['ace'],
    aceModeTwig: ['ace'],
    aceModeTypescript: ['ace'],
    aceModeVbscript: ['ace'],
    aceModeVelocity: ['ace'],
    aceModeVerilog: ['ace'],
    aceModeXml: ['ace'],
    aceModeXquery: ['ace'],
    aceModeYaml: ['ace'],
    aceThemeAmbiance: ['ace'],
    aceThemeChrome: ['ace'],
    aceThemeGithub: ['ace'],
    aceThemeMonokai: ['ace'],
    aceThemeTwilight: ['ace'],
    backbone: ['less'],
    bootstrap: ['jquery'],
    jqueryUi: ['jquery'],
    d3: {exports: 'd3'},
    googleAnalytics: {exports: '_gaq'}
  }
});

require([
  'backbone',
], function(Backbone) {
  'use strict';
  Backbone.View = Backbone.View.extend({
    deinitialize: function() {
    },
    addView: function(view) {
      this.children = this.children || [];
      var index = this.children.push(view) - 1;
      this.listenToOnce(view, 'destroy', function() {
        if (this.children[index] !== view) {
          index = this.children.indexOf(view);
          if (index === -1) {
            return;
          }
        }
        this.children[index] = null;
      }.bind(this));
    },
    destroy: function() {
      this.deinitialize();
      if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
          if (this.children[i]) {
            this.children[i].destroy();
          }
        }
      }
      this.remove();
      this.trigger('destroy');
    }
  });
});

require([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/event',
  'views/loadbar/loadbar',
  'views/header/header',
  'routers/main',
  'initialize'
], function($, _, Backbone, EventCollection, LoadbarView, HeaderView,
    mainRouter, initialize) {
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

      $(this).css('-webkit-transform', 'none');
      $(this).css('-moz-transform', 'none');
      $(this).css('-ms-transform', 'none');
      $(this).css('-o-transform', 'none');
      $(this).css('transform', 'none');

      if (complete) {
        complete();
      }
    }.bind(this), timeout);
  };

  $(document).on('dblclick mousedown', '.no-select', false);

  window.events = new EventCollection();
  window.events.start();

  var headerView = new HeaderView();
  $('body').prepend(headerView.render().el);

  window.loadbar = new LoadbarView();
  $('body').prepend(window.loadbar.render().el);

  mainRouter.initialize();
});
