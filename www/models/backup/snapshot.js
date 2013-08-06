define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var SnapshotModel = Backbone.Model.extend({
    url: function() {
      var url = '/snapshot/' + this.get('volume');

      if (this.get('id')) {
        url += '/' + this.get('id');
      }

      return url;
    }
  });

  return SnapshotModel;
});
