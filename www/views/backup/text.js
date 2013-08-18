define([
  'jquery',
  'underscore',
  'backbone',
  'shCore',
  'shBrushAppleScript',
  'shBrushAS3',
  'shBrushBash',
  'shBrushColdFusion',
  'shBrushCpp',
  'shBrushCSharp',
  'shBrushCss',
  'shBrushDelphi',
  'shBrushDiff',
  'shBrushErlang',
  'shBrushGroovy',
  'shBrushHaxe',
  'shBrushJava',
  'shBrushJavaFX',
  'shBrushJScript',
  'shBrushPerl',
  'shBrushPhp',
  'shBrushPlain',
  'shBrushPowerShell',
  'shBrushPython',
  'shBrushRuby',
  'shBrushSass',
  'shBrushScala',
  'shBrushSql',
  'shBrushTypeScript',
  'shBrushVb',
  'shBrushXml',
  'models/backup/text',
  'text!templates/backup/text.html'
], function($, _, Backbone, SyntaxHighlighter, BrushAppleScript, BrushAS3,
    BrushBash, BrushColdFusion, BrushCpp, BrushCSharp, BrushCss, BrushDelphi,
    BrushDiff, BrushErlang, BrushGroovy, BrushHaxe, BrushJava, BrushJavaFX,
    BrushJScript, BrushPerl, BrushPhp, BrushPlain, BrushPowerShell,
    BrushPython, BrushRuby, BrushSass, BrushScala, BrushSql, BrushTypeScript,
    BrushVb, BrushXml, TextModel, textTemplate) {
  'use strict';
  var EXT_TYPES = {
    'scpt': 'applescript',
    'AppleScript': 'applescript',
    'as': 'actionscript3',
    'sh': 'shell',
    'cfm': 'coldfusion',
    'cfml': 'coldfusion',
    'cfc': 'coldfusion',
    'h': 'cpp',
    'hh': 'cpp',
    'hpp': 'cpp',
    'hxx': 'cpp',
    'h++': 'cpp',
    'c': 'c',
    'cc': 'cpp',
    'cpp': 'cpp',
    'cxx': 'cpp',
    'c++': 'cpp',
    'cs': 'csharp',
    'css': 'css',
    'dfm': 'delphi',
    'delphi': 'delphi',
    'pp': 'pascal',
    'pas': 'pascal',
    'pascal': 'pascal',
    'diff': 'diff',
    'patch': 'patch',
    'erl': 'erlang',
    'hrl': 'erlang',
    'gy': 'groovy',
    'gvy': 'groovy',
    'gsh': 'groovy',
    'groovy': 'groovy',
    'hx': 'haxe',
    'hxml': 'haxe',
    'java': 'java',
    'class': 'java',
    'jfx': 'javafx',
    'javafx': 'javafx',
    'js': 'javascript',
    'pl': 'perl',
    'pm': 'perl',
    't': 'perl',
    'pod': 'perl',
    'php': 'php',
    'phps': 'php',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phtml': 'php',
    'ps': 'powershell',
    'ps1': 'powershell',
    'py': 'python',
    'rb': 'ruby',
    'rbw': 'ruby',
    'sass': 'sass',
    'scss': 'scss',
    'scala': 'scala',
    'sql': 'sql',
    'svg': 'xml',
    'vb': 'vb',
    'ts': 'ts',
    'txt': 'plain',
    'xml': 'xml',
    'html': 'xml',
    'xhtml': 'xml',
    'xslt': 'xml',
  };

  var TextView = Backbone.View.extend({
    className: 'text-viewer-box',
    events: {
      'mouseover .close-viewer': 'addIconWhite',
      'mouseout .close-viewer': 'removeIconWhite',
      'click .close-viewer': 'onClickClose'
    },
    template: _.template(textTemplate),
    initialize: function(options) {
      this.model = new TextModel({
        id: options.id,
        volume: options.volume,
        snapshot: options.snapshot
      });
    },
    render: function() {
      var ext = this.model.get('id').split('.').pop();
      var type = 'plain';
      if (EXT_TYPES[ext]) {
        type = EXT_TYPES[ext];
      }
      this.$el.html(this.template(
        $.extend(this.model.toJSON(), {type: type})));
      SyntaxHighlighter.highlight(null, this.$('pre')[0]);
      this.$el.fadeIn(400);
      return this;
    },
    addIconWhite: function(evt) {
      this.$(evt.target).addClass('icon-white');
    },
    removeIconWhite: function(evt) {
      this.$(evt.target).removeClass('icon-white');
    },
    onClickClose: function() {
      this.$('.close-viewer').roll(400);
      this.$el.fadeOut(400, function() {
        this.remove();
      }.bind(this));
    }
  });

  return TextView;
});
