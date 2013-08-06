define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/backup/objectDrop.html'
], function($, _, Backbone, objectDropTemplate) {
  'use strict';
  var ObjectDropView = Backbone.View.extend({
    className: 'object-drop',
    template: _.template(objectDropTemplate),
    events: {
      'mouseover': 'onMouseOver',
      'mouseout': 'onMouseOut'
    },
    initialize: function() {
      this.hover = false;
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    isHover: function() {
      return this.hover;
    },
    onMouseOver: function() {
      if (!this.hover) {
        this.$el.addClass('hover');
        this.hover = true;
      }
    },
    onMouseOut: function() {
      if (this.hover) {
        this.$el.removeClass('hover');
        this.hover = false;
      }
    }
  });

  return ObjectDropView;
});
