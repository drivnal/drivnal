define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  'use strict';
  var VolumeModel = Backbone.Model.extend({
    defaults: {
      'id': null,
      'name': null,
      'path': null,
      'source_path': null,
      'percent_used': null,
      'excludes': [],
      'schedule': '1day',
      'min_free_space': 0.1,
      'snapshot_limit': 300,
      'bandwidth_limit': 0,
      'snapshot_pending': false,
      'email': '',
      'email_host': '',
      'email_user': '',
      'email_pass': '',
      'email_ssl': true
    },
    url: function() {
      var url = '/volume';

      if (this.get('id')) {
        url += '/' + this.get('id');
      }

      return url;
    }
  });

  return VolumeModel;
});
