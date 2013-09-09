define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var TextLogSnapshotModel = Backbone.Model.extend({
    initialize: function(options) {
      this.volume = options.volume;
      this.snapshot = options.snapshot;
    },
    url: function() {
      return '/log/snapshot/' + this.volume + '/' + this.snapshot;
    }
  });

  return TextLogSnapshotModel;
});
