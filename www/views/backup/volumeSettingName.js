define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting'
], function($, _, Backbone, Bootstrap, VolumeSettingView) {
  'use strict';
  var VolumeSettingNameView = VolumeSettingView.extend({
    name: 'name',
    title: 'Volume Name',
    icon: 'icon-user',
    required: false
  });

  return VolumeSettingNameView;
});
