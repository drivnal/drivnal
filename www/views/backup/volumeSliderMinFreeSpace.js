define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSlider',
  'text!templates/backup/volumeSlider.html'
], function($, _, Backbone, Bootstrap, VolumeSliderView) {
  'use strict';
  var VolumeSliderMinFreeSpaceView = VolumeSliderView.extend({
    name: 'minFreeSpace',
    title: 'Minimum Free Space',
    icon: 'icon-hdd',
    sliderOptions: {
      min: 0,
      max: 50,
      step: 1
    },
    getSetting: function() {
      return this.getValue() / 100;
    },
    onInputChange: function() {
      var value = this.$('input').val();
      value = parseInt(value, 10) || 0;
      this.$('.slider').slider('value', value);
    },
    onSliderEvent: function(evt, ui) {
      var value = ui.value;

      if (value === 0) {
        this.$('input').val('None');
      }
      else {
        this.$('input').val(value + '%');
      }
    }
  });

  return VolumeSliderMinFreeSpaceView;
});
