define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/snapshot'
], function($, _, Backbone, SnapshotModel) {
  'use strict';
  var SnapshotCollection = Backbone.Collection.extend({
    model: SnapshotModel,
    url: function() {
      var url = '/snapshot';

      if (this.getVolume()) {
        url += '/' + this.getVolume();
      }

      return url;
    },
    setVolume: function(volume) {
      this.volume = volume;
    },
    getVolume: function() {
      return this.volume;
    }
  });

  return SnapshotCollection;
});
