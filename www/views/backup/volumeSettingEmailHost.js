define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting'
], function($, _, Backbone, Bootstrap, VolumeSettingView) {
  'use strict';
  var VolumeSettingEmailHostView = VolumeSettingView.extend({
    name: 'emailHost',
    title: 'SMTP Hostname and Port',
    icon: 'icon-globe',
    required: false
  });

  return VolumeSettingEmailHostView;
});
