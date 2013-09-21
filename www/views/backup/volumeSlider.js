define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting',
  'text!templates/backup/volumeSlider.html'
], function($, _, Backbone, Bootstrap, VolumeSettingView,
    volumeSliderTemplate) {
  'use strict';
  var VolumeSliderView = VolumeSettingView.extend({
    template: _.template(volumeSliderTemplate),
    events: function() {
      return _.extend(VolumeSliderView.__super__.events, {
        'mousewheel .slider-box': 'onSliderScroll'
      });
    },
    render: function() {
      this.$el.html(this.template({
        name: this.name,
        title: this.title,
        icon: this.icon
      }));

      this.$('.slider').slider({
        animate: true,
        slide: (this.onSliderSlide).bind(this),
        change: (this.onSliderChange).bind(this)
      });
      this.$('.slider').slider(this.sliderOptions);

      this.setValue(this.value);

      this.$('input').tooltip();

      return this;
    },
    setValue: function(value) {
      this.$('.slider').slider('value', value);
    },
    getValue: function() {
      return this.$('.slider').slider('value');
    },
    onSliderScroll: function(evt) {
      var step = this.$('.slider').slider('option', 'step');
      var value = this.$('.slider').slider('value');

      if (evt.originalEvent.wheelDelta > 0) {
        this.$('.slider').slider('value', value + step);
      }
      else {
        this.$('.slider').slider('value', value - step);
      }

      return false;
    },
    onInputFocusIn: function() {
      if (this.expand) {
        var inputWidth = 120;
        this.$('input').css('width', inputWidth);
        this.$('.slider').css('margin-left', (inputWidth + 12) + 'px');
      }
    },
    onInputFocusOut: function() {
      if (this.expand) {
        var inputWidth = 89;
        this.$('input').css('width', inputWidth);
        this.$('.slider').css('margin-left', (inputWidth + 12) + 'px');
      }
    },
    onSliderSlide: function(evt, ui) {
      this.onSliderEvent(evt, ui);
    },
    onSliderChange: function(evt, ui) {
      this.onSliderEvent(evt, ui);
    },
    onSliderEvent: function() {
    }
  });

  return VolumeSliderView;
});
