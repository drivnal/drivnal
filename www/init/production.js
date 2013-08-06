define([
  'jquery',
  'underscore',
  'backbone',
  'googleAnalytics'
], function($, _, Backbone, GoogleAnalytics) {
  'use strict';
  var initialize = function() {
    GoogleAnalytics.push(['_setAccount', 'UA-20492194-11']);
    //GoogleAnalytics.push(['_setDomainName', 'production.drivnal.com']);
  };

  return initialize;
});
