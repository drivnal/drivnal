define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone) {
  'use strict';
  var LoadbarView = Backbone.View.extend({
    className: 'loadbar',
    initialize: function() {
      this.progress = 0;
    },
    render: function() {
      this.$el.width('0%');
      this.resetTransition();
      return this;
    },
    resetTransition: function() {
      this.$el.css('-webkit-transition', 'width 200ms');
      this.$el.css('-moz-transition', 'width 200ms');
      this.$el.css('-ms-transition', 'width 200ms');
      this.$el.css('-o-transition', 'width 200ms');
      this.$el.css('transition', 'width 200ms');
    },
    setProgress: function(progress) {
      this.$el.width(progress + '%');
      this.progress = progress;
    },
    setProgressTime: function(progress, time) {
      this.$el.css('-webkit-transition', 'width ' + time + 'ms');
      this.$el.css('-moz-transition', 'width ' + time + 'ms');
      this.$el.css('-ms-transition', 'width ' + time + 'ms');
      this.$el.css('-o-transition', 'width ' + time + 'ms');
      this.$el.css('transition', 'width ' + time + 'ms');
      this.setProgress(progress);
      setTimeout((this.resetTransition).bind(this), time);
    },
    getProgress: function() {
      return this.progress;
    }
  });

  return LoadbarView;
});
