define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting'
], function($, _, Backbone, Bootstrap, VolumeSettingView) {
  'use strict';
  var VolumeSettingEmailPassView = VolumeSettingView.extend({
    name: 'emailPass',
    title: 'SMTP Password',
    icon: 'icon-lock',
    required: false,
    password: true
  });

  return VolumeSettingEmailPassView;
});
