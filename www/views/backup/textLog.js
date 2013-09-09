define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/text'
], function($, _, Backbone, TextView) {
  'use strict';

  var TextLogView = TextView.extend({
    type: 'log'
  });

  return TextLogView;
});
