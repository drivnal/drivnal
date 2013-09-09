define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var TextLogModel = Backbone.Model.extend({
    initialize: function(options) {
      this.volume = options.volume;
      this.type = options.type;
    },
    url: function() {
      return '/log/' + this.type + '/' + this.volume + '/' + this.get('id');
    }
  });

  return TextLogModel;
});
