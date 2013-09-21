define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSetting',
  'text!templates/backup/volumeEmail.html'
], function($, _, Backbone, Bootstrap, VolumeSettingView,
    volumeEmailTemplate) {
  'use strict';
  var VolumeSettingEmailView = VolumeSettingView.extend({
    template: _.template(volumeEmailTemplate),
    name: 'email',
    title: 'Email Address for Alerts',
    icon: 'icon-envelope',
    required: false,
    events: function() {
      return _.extend(VolumeSettingEmailView.__super__.events, {
        'keyup input': 'triggerChange',
        'change input': 'triggerChange',
        'paste input': 'triggerChange',
        'cut input': 'triggerChange',
        'click .send-test-email': 'setSendTest',
        'click .email-ssl': 'setEmailSSL'
      });
    },
    triggerChange: function() {
      this.trigger('change', this.getValue());
    },
    getSendTest: function() {
      if (this.sendTest) {
        return true;
      }
      return false;
    },
    setSendTest: function(state) {
      var tooltipText;
      if (state !== true && state !== false) {
        state = !this.sendTest;
      }
      if (state) {
        this.sendTest = true;
        tooltipText = 'Test email will be sent after saving';
        this.$('.send-test-email').parent().find('.tooltip-inner').text(
          tooltipText);
        this.$('.send-test-email').attr('data-original-title', tooltipText);
        this.$('.send-test-email').tooltip('fixTitle');
        this.$('.send-test-email').addClass('icon-white');
      }
      else {
        this.sendTest = false;
        tooltipText = 'Test email will not be sent after saving';
        this.$('.send-test-email').parent().find('.tooltip-inner').text(
          tooltipText);
        this.$('.send-test-email').attr('data-original-title', tooltipText);
        this.$('.send-test-email').tooltip('fixTitle');
        this.$('.send-test-email').removeClass('icon-white');
      }
    },
    getEmailSSL: function() {
      if (this.emailSSL) {
        return true;
      }
      return false;
    },
    setEmailSSL: function(state) {
      var tooltipText;
      if (state !== true && state !== false) {
        state = !this.emailSSL;
      }
      if (state) {
        this.emailSSL = true;
        tooltipText = 'SSL is enabled';
        this.$('.email-ssl').parent().find('.tooltip-inner').text(tooltipText);
        this.$('.email-ssl').attr('data-original-title', tooltipText);
        this.$('.email-ssl').tooltip('fixTitle');
        this.$('.email-ssl').addClass('icon-white');
      }
      else {
        this.emailSSL = false;
        tooltipText = 'SSL is disabled';
        this.$('.email-ssl').parent().find('.tooltip-inner').text(tooltipText);
        this.$('.email-ssl').attr('data-original-title', tooltipText);
        this.$('.email-ssl').tooltip('fixTitle');
        this.$('.email-ssl').removeClass('icon-white');
      }
    }
  });

  return VolumeSettingEmailView;
});
