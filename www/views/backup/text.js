define([
  'jquery',
  'underscore',
  'backbone',
  'shCore',
  'shBrushJScript',
  'models/backup/text',
  'text!templates/backup/text.html'
], function($, _, Backbone, SyntaxHighlighter, shBrushJScript,
    TextModel, textTemplate) {
  'use strict';
  var TextView = Backbone.View.extend({
    className: 'text-viewer-box',
    events: {
      'mouseover .close-viewer': 'addIconWhite',
      'mouseout .close-viewer': 'removeIconWhite',
      'click .close-viewer': 'onClickClose'
    },
    template: _.template(textTemplate),
    initialize: function() {
      this.model = new TextModel();
    },
    render: function() {
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
