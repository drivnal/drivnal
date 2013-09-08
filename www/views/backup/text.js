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
  'text!templates/backup/text.html'
], function($, _, Backbone, SyntaxHighlighter, BrushAppleScript, BrushAS3,
    BrushBash, BrushColdFusion, BrushCpp, BrushCSharp, BrushCss, BrushDelphi,
    BrushDiff, BrushErlang, BrushGroovy, BrushHaxe, BrushJava, BrushJavaFX,
    BrushJScript, BrushPerl, BrushPhp, BrushPlain, BrushPowerShell,
    BrushPython, BrushRuby, BrushSass, BrushScala, BrushSql, BrushTypeScript,
    BrushVb, BrushXml, textTemplate) {
  'use strict';
  var TextView = Backbone.View.extend({
    className: 'text-viewer-box',
    type: null,
    events: {
      'mouseover .close-viewer': 'addIconWhite',
      'mouseout .close-viewer': 'removeIconWhite',
      'click .close-viewer': 'onClickClose'
    },
    template: _.template(textTemplate),
    render: function() {
      if (this.type) {
        this.$el.addClass(this.type);
      }
      this.$el.html(this.template(this.model.toJSON()));
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
