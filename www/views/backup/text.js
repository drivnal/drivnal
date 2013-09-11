define([
  'jquery',
  'underscore',
  'backbone',
  'ace/ace',
  'text!templates/backup/text.html'
], function($, _, Backbone, ace, textTemplate) {
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

      if (this.$('.editor').length) {
        var editor = ace.edit(this.$('.editor')[0]);
        editor.setTheme('ace/theme/github');
        // editor.setTheme('ace/theme/monokai');
        // editor.setTheme('ace/theme/twilight');
        editor.setReadOnly(true);
        editor.getSession().setMode('ace/mode/' + this.model.get('syntax'));
      }

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
