define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/backup/objectPath.html'
], function($, _, Backbone, Bootstrap, objectPathTemplate) {
  'use strict';
  var ObjectPathView = Backbone.View.extend({
    className: 'object-path',
    template: _.template(objectPathTemplate),
    events: {
      'click .name': 'onClick'
    },
    initialize: function(options) {
      this.compressed = false;
      this.path = options.path;
      this.fullPath = options.fullPath;
      this.last = options.last;
    },
    render: function() {
      this.$el.html(this.template({
        path: this.path,
        last: this.last
      }));
      return this;
    },
    compress: function() {
      if (this.compressed) {
        return;
      }
      this.compressed = true;
      this.$('.name').html('...');
      this.$('.name').tooltip({
        placement: 'bottom',
        title: this.path
      });
    },
    decompress: function() {
      if (!this.compressed) {
        return;
      }
      this.compressed = false;
      this.$('.name').html(this.path);
      this.$('.name').tooltip('destroy');
    },
    hide: function() {
      this.$el.hide();
    },
    show: function() {
      this.$el.show();
    },
    onClick: function(evt) {
      if ($(evt.target).hasClass('last')) {
        return;
      }
      this.trigger('changePath', this.fullPath.join('/'));
    }
  });

  return ObjectPathView;
});
