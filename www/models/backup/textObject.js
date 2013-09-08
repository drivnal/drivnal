define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var TextObjectModel = Backbone.Model.extend({
    initialize: function(options) {
      this.volume = options.volume;
      this.snapshot = options.snapshot;
    },
    url: function() {
      var url = '/text/' + this.volume;

      if (this.snapshot) {
        url += '/' + this.snapshot;
      }
      else {
        url += '/origin';
      }

      url += '/' + this.get('id');

      return url;
    }
  });

  return TextObjectModel;
});
