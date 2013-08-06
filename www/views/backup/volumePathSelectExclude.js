define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumePathSelect'
], function($, _, Backbone, Bootstrap, VolumePathSelectView) {
  'use strict';
  var VolumePathSelectExcludeView = VolumePathSelectView.extend({
    name: 'exclude',
    title: 'Exclude Directory',
    icon: 'icon-ban-circle'
  });

  return VolumePathSelectExcludeView;
});
