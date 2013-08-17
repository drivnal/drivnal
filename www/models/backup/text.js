define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var TextModel = Backbone.Model.extend({
    defaults: {
      'path': '/home/ubuntu/test.txt',
      'data': 'Test text file'
    }
  });

  return TextModel;
});
