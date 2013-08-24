define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting'
], function($, _, Backbone, Bootstrap, VolumeSettingView) {
  'use strict';
  var VolumeSettingEmailUserView = VolumeSettingView.extend({
    name: 'emailUser',
    title: 'SMTP Username',
    icon: 'icon-user',
    required: false
  });

  return VolumeSettingEmailUserView;
});
