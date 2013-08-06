define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/backup/volumePath.html'
], function($, _, Backbone, volumePathTemplate) {
  'use strict';
  var VolumePathView = Backbone.View.extend({
    className: 'path',
    template: _.template(volumePathTemplate),
    events: {
      'click': 'onClick'
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    onClick: function() {
      this.trigger('changePath', this.model.get('path'));
    }
  });

  return VolumePathView;
});
