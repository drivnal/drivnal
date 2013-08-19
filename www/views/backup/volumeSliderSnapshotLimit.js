define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSlider',
  'text!templates/backup/volumeSlider.html'
], function($, _, Backbone, Bootstrap, VolumeSliderView) {
  'use strict';
  var VolumeSliderSnapshotLimitView = VolumeSliderView.extend({
    name: 'snapshotLimit',
    title: 'Snapshot Limit',
    icon: 'icon-list',
    sliderOptions: {
      min: 0,
      max: 500,
      step: 1
    },
    onInputChange: function() {
      var value = this.$('input').val();
      value = parseInt(value, 10) || 0;
      if (value >= 1 && value <= 2) {
        value = 3;
      }
      this.$('.slider').slider('value', value);
    },
    onSliderEvent: function(evt, ui) {
      var value = ui.value;

      if (value === 1) {
        value = 3;
        this.$('.slider').slider('value', value);
      }
      else if (value === 2) {
        value = 0;
        this.$('.slider').slider('value', value);
      }

      if (value === 0) {
        this.$('input').val('None');
      }
      else {
        this.$('input').val(value);
      }
    }
  });

  return VolumeSliderSnapshotLimitView;
});
