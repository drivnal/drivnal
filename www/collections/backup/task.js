define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/task'
], function($, _, Backbone, TaskModel) {
  'use strict';
  var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    url: function() {
      var url = '/task';

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

  return TaskCollection;
});
