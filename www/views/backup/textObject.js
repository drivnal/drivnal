define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/text'
], function($, _, Backbone, TextView) {
  'use strict';

  var TextObjectView = TextView.extend({
    type: 'object'
  });

  return TextObjectView;
});
