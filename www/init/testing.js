define([
  'jquery',
  'underscore',
  'backbone',
  'googleAnalytics'
], function($, _, Backbone, GoogleAnalytics) {
  'use strict';
  var initialize = function() {
    GoogleAnalytics.push(['_setAccount', 'UA-20492194-12']);
    //GoogleAnalytics.push(['_setDomainName', 'testing.drivnal.com']);
  };

  return initialize;
});
