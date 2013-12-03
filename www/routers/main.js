define([
  'jquery',
  'underscore',
  'backbone',
  'routers/backup',
  'routers/about',
], function($, _, Backbone, BackupRouter, AboutRouter) {
  'use strict';
  var initialize = function() {
    var data = {
      element: '#app',
      view: null
    };

    new BackupRouter(data);
    new AboutRouter(data);

    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
