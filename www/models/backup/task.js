define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var TaskModel = Backbone.Model.extend({
    url: function() {
      var url = '/task/' + this.get('volume');

      if (this.get('id')) {
        url += '/' + this.get('id');
      }

      return url;
    }
  });

  return TaskModel;
});
