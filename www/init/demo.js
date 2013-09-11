define([
  'jquery',
  'underscore',
  'backbone',
  'googleAnalytics',
  'ace',
  'demo/ajax'
], function($, _, Backbone, GoogleAnalytics, Ace, demoAjax) {
  'use strict';
  var initialize = function() {
    GoogleAnalytics.push(['_setAccount', 'UA-20492194-10']);
    //GoogleAnalytics.push(['_setDomainName', 'demo.drivnal.com']);

    Ace.config.setModuleUrl('ace/mode/coffee_worker', 'js/worker-coffee.js');
    Ace.config.setModuleUrl('ace/mode/css_worker', 'js/worker-css.js');
    Ace.config.setModuleUrl('ace/mode/javascript_worker',
      'js/worker-javascript.js');
    Ace.config.setModuleUrl('ace/mode/json_worker', 'js/worker-json.js');
    Ace.config.setModuleUrl('ace/mode/lua_worker', 'js/worker-lua.js');
    Ace.config.setModuleUrl('ace/mode/php_worker', 'js/worker-php.js');
    Ace.config.setModuleUrl('ace/mode/xquery_worker', 'js/worker-xquery.js');

    Backbone.ajax = demoAjax;
  };

  return initialize;
});
