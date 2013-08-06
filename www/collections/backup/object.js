define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/object'
], function($, _, Backbone, ObjectModel) {
  'use strict';
  var ObjectCollection = Backbone.Collection.extend({
    model: ObjectModel,
    url: function() {
      var url = '/object/' + this.getVolume();

      if (this.getSnapshot()) {
        url += '/' + this.getSnapshot();
      }
      else {
        url += '/origin';
      }

      if (this.getPath()) {
        url += '/' + this.getPath();
      }

      return url;
    },
    setVolume: function(volume) {
      this.volume = volume;
    },
    getVolume: function() {
      return this.volume;
    },
    setSnapshot: function(snapshot) {
      this.snapshot = snapshot;
    },
    getSnapshot: function() {
      return this.snapshot;
    },
    setPath: function(path) {
      this.path = path;
    },
    addPath: function(path) {
      if (this.path) {
        this.path += '/' + path;
      }
      else {
        this.path = path;
      }
    },
    getPath: function() {
      return this.path;
    },
  });

  return ObjectCollection;
});
