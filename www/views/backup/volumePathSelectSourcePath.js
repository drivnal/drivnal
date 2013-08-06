define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumePathSelect'
], function($, _, Backbone, Bootstrap, VolumePathSelectView) {
  'use strict';
  var VolumePathSelectSourcePathView = VolumePathSelectView.extend({
    name: 'sourcePath',
    title: 'Directory to Backup',
    icon: 'icon-download'
  });

  return VolumePathSelectSourcePathView;
});
