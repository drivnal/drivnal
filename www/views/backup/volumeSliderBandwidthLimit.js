define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSlider',
  'text!templates/backup/volumeSlider.html'
], function($, _, Backbone, Bootstrap, VolumeSliderView) {
  'use strict';
  var BANDWIDTH_LIMIT_MAX = 26214400;

  var VolumeSliderBandwidthLimitView = VolumeSliderView.extend({
    name: 'bandwidthLimit',
    title: 'Bandwidth Limit',
    icon: 'icon-download-alt',
    expand: true,
    sliderOptions: {
      min: 0,
      max: BANDWIDTH_LIMIT_MAX
    },
    setValue: function(value) {
      this.$('input').val(value).change();
    },
    onInputChange: function() {
      var value = this.$('input').val();
      value = window.reverseFormatSize(value);
      if (value) {
        value = Math.max(value, 2560);
      }
      else {
        value = 0;
      }

      this.$('.slider').slider({'max': Math.max(value, BANDWIDTH_LIMIT_MAX)});
      if (value >= 104857600) {
        this.$('.slider').slider({'step': 1048576});
      }
      else if (value >= 1048576) {
        this.$('.slider').slider({'step': 104858});
      }
      else {
        this.$('.slider').slider({'step': 5120});
      }

      this.$('.slider').slider('value', value);
    },
    onSliderSlide: function(evt, ui) {
      var decimal;
      var value = ui.value;

      if (value >= 104857600) {
        if (this.$('.slider').slider('option', 'step') !== 1048576) {
          this.$('.slider').slider({'step': 1048576});
        }
        decimal = 0;
      }
      else if (value >= 1048576) {
        if (this.$('.slider').slider('option', 'step') !== 104858) {
          this.$('.slider').slider({'step': 104858});
        }
        decimal = 1;
      }
      else {
        if (this.$('.slider').slider('option', 'step') !== 5120) {
          this.$('.slider').slider({'step': 5120});
        }
        decimal = 0;
      }

      if (value === 0) {
        this.$('input').val('None');
      }
      else {
        this.$('input').val(window.formatSize(value, decimal) + '/s');
      }
    },
    onSliderChange: function(evt, ui) {
      var max = Math.max(ui.value, BANDWIDTH_LIMIT_MAX);
      if (this.$('.slider').slider('option', 'max') !== max) {
        this.$('.slider').slider({'max': max});
      }
      this.onSliderSlide(evt, ui);
    }
  });

  return VolumeSliderBandwidthLimitView;
});
