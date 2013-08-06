define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/volume'
], function($, _, Backbone, SnapshotModel) {
  'use strict';
  var VolumeCollection = Backbone.Collection.extend({
    model: SnapshotModel,
    url: function() {
      return '/volume';
    }
  });

  return VolumeCollection;
});
