define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting'
], function($, _, Backbone, Bootstrap, VolumeSettingView) {
  'use strict';
  var VolumeSettingEmailView = VolumeSettingView.extend({
    name: 'email',
    title: 'Email Address for Alerts',
    icon: 'icon-envelope',
    required: false,
    events: {
      'keyup input': 'triggerChange',
      'change input': 'triggerChange',
      'paste input': 'triggerChange',
      'cut input': 'triggerChange'
    },
    triggerChange: function() {
      this.trigger('change', this.getValue());
    }
  });

  return VolumeSettingEmailView;
});
