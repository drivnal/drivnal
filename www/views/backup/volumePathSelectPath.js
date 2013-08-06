define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumePathSelect'
], function($, _, Backbone, Bootstrap, VolumePathSelectView) {
  'use strict';
  var VolumePathSelectPathView = VolumePathSelectView.extend({
    name: 'path',
    title: 'Location of Backup',
    icon: 'icon-upload',
    required: true
  });

  return VolumePathSelectPathView;
});
