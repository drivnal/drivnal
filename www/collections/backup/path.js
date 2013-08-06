define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/path'
], function($, _, Backbone, PathModel) {
  'use strict';
  var PathCollection = Backbone.Collection.extend({
    model: PathModel,
    url: function() {
      var url = '/path';
      if (this.getPath() && this.getPath() !== '/') {
        url += '/' + this.getPath().slice(1);
      }
      return url;
    },
    setPath: function(path) {
      this.path = path;
    },
    getPath: function() {
      return (this.path || '');
    }
  });

  return PathCollection;
});
