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
    required: false
  });

  return VolumeSettingEmailView;
});
