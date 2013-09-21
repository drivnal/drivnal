define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/backup/volumeSetting.html'
], function($, _, Backbone, Bootstrap, volumeSettingTemplate) {
  'use strict';
  var VolumeSettingView = Backbone.View.extend({
    template: _.template(volumeSettingTemplate),
    events: {
      'change input': 'onInputChange',
      'focusin input': 'onInputFocusIn',
      'focusout input': 'onInputFocusOut'
    },
    initialize: function(options) {
      this.value = options.value;
    },
    render: function() {
      this.$el.html(this.template({
        name: this.name,
        title: this.title,
        icon: this.icon,
        value: this.value,
        password: this.password
      }));

      this.$('input').tooltip();
      this.$('i').tooltip();

      return this;
    },
    onInputChange: function() {
    },
    onInputFocusIn: function() {
    },
    onInputFocusOut: function() {
    },
    setErrorMessage: function(message) {
      if (message) {
        if (!this.getErrorMessage()) {
          this.$('input').addClass('input-error');
          this.$('input').before(
            '<span class="setting-error">' + message + '</span>');
        }
        else {
          this.$('.setting-error').text(message);
        }
      }
      else {
        this.showError = false;
        this.$('input').removeClass('input-error');
        this.$('.setting-error').remove();
      }
    },
    getErrorMessage: function() {
      if (this.$('.setting-error').length) {
        return this.$('.setting-error').text();
      }
      else {
        return null;
      }
    },
    flashErrorMessage: function() {
      this.$('input').addClass('flash');
      this.$('.setting-error').addClass('flash');
      setTimeout(function() {
        this.$('input').removeClass('flash');
        this.$('.setting-error').removeClass('flash');
      }.bind(this), 200);
    },
    getValue: function() {
      return this.$('input').val();
    },
    setValue: function(value) {
      this.$('input').val(value);
    },
    getSetting: function() {
      return this.getValue();
    },
    checkSetting: function() {
      if (this.required) {
        if (!this.getValue()) {
          this.setErrorMessage('Required');
        }
        else if (this.getErrorMessage() === 'Required') {
          this.setErrorMessage();
        }
      }

      if (this.getErrorMessage()) {
        this.flashErrorMessage();
        return false;
      }
      return true;
    }
  });

  return VolumeSettingView;
});
