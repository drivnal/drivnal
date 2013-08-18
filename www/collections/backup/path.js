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
      var path = this.getPath();
      if (path && path !== '/') {
        if (path.substr(0, 1) !== '/') {
          path = '/' + path;
        }
        url += path;
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
