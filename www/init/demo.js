define([
  'jquery',
  'underscore',
  'backbone',
  'googleAnalytics',
  'demo/ajax'
], function($, _, Backbone, GoogleAnalytics, demoAjax) {
  'use strict';
  var initialize = function() {
    GoogleAnalytics.push(['_setAccount', 'UA-20492194-10']);
    //GoogleAnalytics.push(['_setDomainName', 'demo.drivnal.com']);
    Backbone.ajax = demoAjax;
  };

  return initialize;
});
