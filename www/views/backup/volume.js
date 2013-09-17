define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'd3',
  'jqueryUi',
  'views/backup/volumeSettingName',
  'views/backup/volumeSettingEmail',
  'views/backup/volumeSettingEmailHost',
  'views/backup/volumeSettingEmailUser',
  'views/backup/volumeSettingEmailPass',
  'views/backup/volumeSliderSchedule',
  'views/backup/volumeSliderMinFreeSpace',
  'views/backup/volumeSliderSnapshotLimit',
  'views/backup/volumeSliderBandwidthLimit',
  'views/backup/volumePathSelectSourcePath',
  'views/backup/volumePathSelectPath',
  'views/backup/volumePathSelectExclude',
  'text!templates/backup/volume.html'
], function($, _, Backbone, Bootstrap, d3, jQueryUI, VolumeSettingName,
    VolumeSettingEmailView, VolumeSettingEmailHostView,
    VolumeSettingEmailUserView, VolumeSettingEmailPassView,
    VolumeSliderScheduleView, VolumeSliderMinFreeSpaceView,
    VolumeSliderSnapshotLimitView, VolumeSliderBandwidthLimitView,
    VolumePathSelectSourcePathView, VolumePathSelectPathView,
    VolumePathSelectExcludeView, volumeTemplate) {
  'use strict';
  var VolumeView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(volumeTemplate),
    events: {
      'click .item': 'onClickItem',
      'click .cancel': 'onClickCancel',
      'click .save': 'onClickSave',
      'mouseover': 'onMouseOver',
      'mouseout': 'onMouseOut',
      'mouseover .remove-volume': 'addIconWhite',
      'mouseout .open-settings, .remove-volume': 'removeIconWhite',
      'mouseover .open-settings': 'onMouseOverSettings'
    },
    initialize: function() {
      this.excludeViews = [];

      this.nameView = new VolumeSettingName({
        value: this.model.get('name')
      });
      this.addView(this.nameView);

      this.sourePathView = new VolumePathSelectSourcePathView({
        value: this.model.get('source_path')
      });
      this.addView(this.sourePathView);
      this.listenTo(this.sourePathView, 'updateSize', this.updateSize);
      this.listenTo(this.sourePathView, 'change', function(path) {
        // When source path change exclude paths must be cleared
        this.resetExcludePathViews(path, []);
      }.bind(this));

      this.pathView = new VolumePathSelectPathView({
        value: this.model.get('path')
      });
      this.addView(this.pathView);
      this.listenTo(this.pathView, 'updateSize', this.updateSize);

      this.scheduleView = new VolumeSliderScheduleView({
        value: this.model.get('schedule')
      });
      this.addView(this.scheduleView);

      this.minFreeSpaceView = new VolumeSliderMinFreeSpaceView({
        value: this.model.get('min_free_space') * 100
      });
      this.addView(this.minFreeSpaceView);

      this.snapshotLimit = new VolumeSliderSnapshotLimitView({
        value: this.model.get('snapshot_limit')
      });
      this.addView(this.snapshotLimit);

      this.bandwidthLimitView = new VolumeSliderBandwidthLimitView({
        value: this.model.get('bandwidth_limit')
      });
      this.addView(this.bandwidthLimitView);

      this.emailView = new VolumeSettingEmailView({
        value: this.model.get('email')
      });
      this.addView(this.emailView);
      this.listenTo(this.emailView, 'change', this.onEmailChange);

      this.emailHostView = new VolumeSettingEmailHostView({
        value: this.model.get('email_host')
      });
      this.addView(this.emailHostView);

      this.emailUserView = new VolumeSettingEmailUserView({
        value: this.model.get('email_user')
      });
      this.addView(this.emailUserView);

      this.emailPassView = new VolumeSettingEmailPassView({
        value: this.model.get('email_pass')
      });
      this.addView(this.emailPassView);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.origSourcePath = this.model.get('source_path');

      var width = 40;

      this.storageArc = d3.svg.arc();
      this.storageArc.startAngle(0);
      this.storageArc.innerRadius(width / 4);
      this.storageArc.outerRadius(width / 2);

      this.runningArc = d3.svg.arc();
      this.runningArc.innerRadius(width / 4);
      this.runningArc.outerRadius(width / 2);

      this.$('.usage-meter g').attr('transform',
        'translate(' + width / 2 + ', ' + width / 2 + ')');

      this.setStorage(this.model.get('percent_used'));
      this.setRunning(this.model.get('snapshot_pending'));

      this.$('.usage-meter').tooltip({
        title: 'Volume is 0% full'
      });

      this.$('.setting-name').html(this.nameView.render().el);
      this.$('.setting-source-path').html(this.sourePathView.render().el);
      this.$('.setting-path').html(this.pathView.render().el);

      this.resetExcludePathViews();

      this.$('.setting-schedule').html(this.scheduleView.render().el);
      this.$('.setting-min-free-space').html(
        this.minFreeSpaceView.render().el);
      this.$('.setting-snapshot-limit').html(
        this.snapshotLimit.render().el);
      this.$('.setting-bandwidth-limit').html(
        this.bandwidthLimitView.render().el);

      this.$('.setting-email').html(this.emailView.render().el);
      this.emailView.setEmailSSL(this.model.get('email_ssl'));

      this.$('.setting-email-host').html(this.emailHostView.render().el);
      this.$('.setting-email-user').html(this.emailUserView.render().el);
      this.$('.setting-email-pass').html(this.emailPassView.render().el);

      this.$('.remove-volume').tooltip({
        title: 'Click three times to remove volume',
        trigger: 'manual'
      });

      if (!this.model.get('email')) {
        this.emailHostView.$el.hide();
        this.emailUserView.$el.hide();
        this.emailPassView.$el.hide();
      }

      return this;
    },
    update: function() {
      if (this.model.get('name')) {
        this.$('.info .title-name').text(this.model.get('name'));
      }

      if (this.model.get('source_path')) {
        this.$('.info .title-source-path').text(this.model.get('source_path'));
      }

      this.setStorage(this.model.get('percent_used'));
      this.setRunning(this.model.get('snapshot_pending'));

      if (!this.isSettings()) {
        this.resetSetttings();
      }

      // If source path changed update origin
      if (this.model.get('source_path') !== this.origSourcePath) {
        this.origSourcePath = this.model.get('source_path');
        this.trigger('updateOrigin');
      }
    },
    setStorage: function(percent) {
      var twoPi = 2 * Math.PI;

      this.$('.usage-meter .background').attr(
        'd', this.storageArc.endAngle(twoPi));
      this.$('.usage-meter .foreground').attr(
        'd', this.storageArc.endAngle(twoPi * percent * -1));

      if (percent >= 0.9) {
        if (!this.$('.volume').hasClass('storage-alert')) {
          this.$('.volume').addClass('storage-alert');
        }
      }
      else {
        if (this.$('.volume').hasClass('storage-alert')) {
          this.$('.volume').removeClass('storage-alert');
        }
      }

      this.$('.usage-meter').tooltip({
        title: 'Volume is ' + Math.round(percent * 100).toString() + '% full'
      });
    },
    rollStorage: function() {
      var twoPi = 2 * Math.PI;

      var arc = function(percent) {
        this.$('.usage-meter .background').attr(
          'd', this.storageArc.endAngle(twoPi));
        this.$('.usage-meter .foreground').attr(
          'd', this.storageArc.endAngle(twoPi * percent * -1));

        setTimeout(function() {
          percent += 0.01;
          if (percent <= this.model.get('percent_used')) {
            arc(percent);
          }
        }.bind(this), 3);
      }.bind(this);

      arc(0);
    },
    setRunning: function(state) {
      if (this.getRunning() === state) {
        return;
      }
      this.running = state;
      if (this.running) {
        this.runningLoop(0);
      }
    },
    getRunning: function() {
      return this.running;
    },
    showEmailSettings: function() {
      if (this.isEmailSettings()) {
        return;
      }

      this.emailHostView.$('i').hide();
      this.emailUserView.$('i').hide();
      this.emailPassView.$('i').hide();

      this.emailHostView.$el.slideDown({
        duration: 250
      });
      this.emailUserView.$el.slideDown({
        duration: 250
      });
      this.emailPassView.$el.slideDown({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.emailHostView.$('i').show();
          this.emailUserView.$('i').show();
          this.emailPassView.$('i').show();

          this.updateSize();
        }.bind(this)
      });
    },
    hideEmailSettings: function() {
      if (!this.isEmailSettings()) {
        return;
      }

      this.emailHostView.$('i').hide();
      this.emailUserView.$('i').hide();
      this.emailPassView.$('i').hide();

      this.emailHostView.$el.slideUp({
        duration: 250
      });
      this.emailUserView.$el.slideUp({
        duration: 250
      });
      this.emailPassView.$el.slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    isEmailSettings: function() {
      return this.emailPassView.$el.is(':visible');
    },
    onEmailChange: function(value) {
      if (value) {
        this.showEmailSettings();
      }
      else {
        this.hideEmailSettings();
      }
    },
    runningLoop: function(progress) {
      var twoPi = 2 * Math.PI;

      if (this.running) {
        this.runningArc.startAngle(twoPi * (progress - 0.25));
        this.runningArc.endAngle(twoPi * progress);
      }
      else {
        this.runningArc.startAngle(twoPi);
        this.runningArc.endAngle(twoPi);
      }

      this.$('.usage-meter .running-background').attr('d', this.runningArc);

      if (this.running) {
        progress += 0.03;
        if (progress > 1) {
          progress = 0;
        }

        setTimeout(function() {
          this.runningLoop(progress);
        }.bind(this), 50);
      }
    },
    updateSize: function() {
      this.trigger('updateSize');
    },
    resetExcludePathViews: function(sourcePath, excludes) {
      var i;
      excludes = excludes || this.model.get('excludes');
      sourcePath = sourcePath || this.model.get('source_path');

      for (i = 0; i < this.excludeViews.length; i++) {
        this.excludeViews[i].destroy();
      }
      this.excludeViews = [];
      for (i = 0; i < excludes.length; i++) {
        this.addExcludePathView(sourcePath, excludes[i]);
      }
      this.addExcludePathView(sourcePath, '', true);
    },
    addExcludePathView: function(sourcePath, path, last, animate) {
      var excludeView = new VolumePathSelectExcludeView({
        name: 'excludes',
        title: 'Exclude Directory',
        value: path,
        basePath: sourcePath,
        removable: true,
        last: last
      });
      this.addView(excludeView);
      this.listenTo(excludeView, 'updateSize', this.updateSize);

      if (last) {
        this.listenTo(excludeView, 'newView', function() {
          this.addExcludePathView(sourcePath, '', true, true);
        });
      }

      this.listenTo(excludeView, 'remove', function() {
        var i;
        for (i = 0; i < this.excludeViews.length; i++) {
          if (this.excludeViews[i] === excludeView) {
            this.excludeViews.splice(i, 1);
            break;
          }
        }
      }.bind(this));

      this.$('.setting-excludes').append(excludeView.render().el);

      if (animate) {
        excludeView.$('i').hide();
        excludeView.$el.hide().slideDown({
          duration: 250,
          step: (this.updateSize).bind(this),
          complete: function() {
            // Path remove icon is hidden by default
            excludeView.$('i').not('.path-remove').show();
            this.updateSize();
          }.bind(this)
        });
      }

      this.excludeViews.push(excludeView);
      this.updateSize();

      return excludeView;
    },
    showSettings: function(complete) {
      if (this.isSettings()) {
        return;
      }
      this.$('.open-settings').show();
      this.$('.remove-volume').show();
      this.$('.settings i').hide();
      this.$('.open-settings').roll(450);

      this.$('.settings').slideDown({
        duration: 350,
        step: (this.updateSize).bind(this),
        complete: function() {
          // Path remove icon is hidden by default
          this.$('.settings i').not('.path-remove').show();
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    hideSettings: function(complete) {
      if (!this.isSettings()) {
        return;
      }
      this.hideError();

      this.$('.remove-volume').hide();
      this.$('.settings i').hide();
      this.$('.open-settings').roll(450);
      this.emailView.setSendTest(false);

      this.$('.settings').slideUp({
        duration: 350,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    isSettings: function() {
      return this.$('.settings').is(':visible');
    },
    showError: function() {
      if (this.isError()) {
        return;
      }
      this.$('.error').slideDown({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    hideError: function() {
      if (!this.isError()) {
        return;
      }
      this.$('.error').slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    isError: function() {
      return this.$('.error').is(':visible');
    },
    onClickItem: function(evt) {
      if (this.$(evt.target).hasClass('remove-volume')) {
        if (this.$('.remove-volume-container .tooltip').length) {
          this.removeClickCount += 1;

          if (this.removeClickCount === 1) {
            this.$('.remove-volume-container .tooltip-inner').text(
              'Click two times to remove volume');
          }
          else if (this.removeClickCount === 2) {
            this.$('.remove-volume-container .tooltip-inner').text(
              'Click to remove volume');
          }
          else if (this.removeClickCount === 3) {
            this.removeClickCount = 0;
            this.$('.remove-volume').tooltip('hide');

            if (this.model.get('id') === null) {
              this.hideSettings(function() {
                this.trigger('update');
              }.bind(this));
            }
            else {
              this.model.destroy({
                success: function() {
                  this.hideSettings(function() {
                    this.trigger('update');
                  }.bind(this));
                }.bind(this)
              });
            }
          }
        }
        else {
          this.$('.remove-volume').tooltip('show');
          this.removeClickCount = 0;

          this.$('.remove-volume').one('mouseout', function() {
            this.removeClickCount = 0;
            this.$('.remove-volume').tooltip('hide');
          }.bind(this));
        }

        return false;
      }

      if (this.isSettings()) {
        return false;
      }
      else if (this.$(evt.target).hasClass('open-settings')) {
        this.showSettings();
        return false;
      }
      else if (!this.$el.hasClass('current-volume')) {
        this.trigger('select', this);
      }
    },
    resetSetttings: function() {
      this.nameView.setValue(this.model.get('name'));
      this.sourePathView.setValue(this.model.get('source_path'));
      this.sourePathView.hidePathSelect();
      this.pathView.setValue(this.model.get('path'));
      this.pathView.hidePathSelect();
      this.resetExcludePathViews();
      this.scheduleView.setValue(this.model.get('schedule'));
      this.minFreeSpaceView.setValue(this.model.get('min_free_space') * 100);
      this.snapshotLimit.setValue(this.model.get('snapshot_limit'));
      this.bandwidthLimitView.setValue(this.model.get('bandwidth_limit'));
      this.emailView.setValue(this.model.get('email'));
      this.emailView.setEmailSSL(this.model.get('email_ssl'));
      this.emailHostView.setValue(this.model.get('email_host'));
      this.emailUserView.setValue(this.model.get('email_user'));
      this.emailPassView.setValue(this.model.get('email_pass'));

      if (this.model.get('email')) {
        this.emailHostView.$el.show();
        this.emailUserView.$el.show();
        this.emailPassView.$el.show();
      }
      else {
        this.emailHostView.$el.hide();
        this.emailUserView.$el.hide();
        this.emailPassView.$el.hide();
      }
    },
    onClickCancel: function() {
      this.hideSettings(function() {
        this.resetSetttings();
        this.trigger('update');
      }.bind(this));
    },
    onClickSave: function() {
      var i;
      var error = false;
      var excludes = [];

      for (i = 0; i < this.excludeViews.length; i++) {
        if (this.excludeViews[i].getSetting()) {
          excludes.push(this.excludeViews[i].getSetting());
        }
      }

      error = (!this.nameView.checkSetting() ? true : error);
      error = (!this.sourePathView.checkSetting() ? true : error);
      error = (!this.pathView.checkSetting() ? true : error);
      error = (!this.scheduleView.checkSetting() ? true : error);
      error = (!this.minFreeSpaceView.checkSetting() ? true : error);
      error = (!this.snapshotLimit.checkSetting() ? true : error);
      error = (!this.bandwidthLimitView.checkSetting() ? true : error);
      error = (!this.emailView.checkSetting() ? true : error);
      error = (!this.emailHostView.checkSetting() ? true : error);
      error = (!this.emailUserView.checkSetting() ? true : error);
      error = (!this.emailPassView.checkSetting() ? true : error);

      for (i = 0; i < this.excludeViews.length; i++) {
        error = (!this.excludeViews[i].checkSetting() ? true : error);
      }

      if (error) {
        return;
      }

      var emailHost = this.emailHostView.getSetting();
      var emailUser = this.emailUserView.getSetting();
      var emailPass = this.emailPassView.getSetting();
      if (!this.emailView.getSetting()) {
        // Clear values if there is no email address
        emailHost = '';
        emailUser = '';
        emailPass = '';
      }

      this.model.save({
        'name': this.nameView.getSetting(),
        'source_path': this.sourePathView.getSetting(),
        'path': this.pathView.getSetting(),
        'excludes': excludes,
        'schedule': this.scheduleView.getSetting(),
        'min_free_space': this.minFreeSpaceView.getSetting(),
        'snapshot_limit': this.snapshotLimit.getSetting(),
        'bandwidth_limit': this.bandwidthLimitView.getSetting(),
        'email': this.emailView.getSetting(),
        'email_host': emailHost,
        'email_user': emailUser,
        'email_pass': emailPass,
        'email_ssl': this.emailView.getEmailSSL(),
        'email_send_test': this.emailView.getSendTest(),
      }, {
        success: function() {
          this.hideSettings(function() {
            this.trigger('update');
          }.bind(this));
        }.bind(this),
        error: function() {
          this.showError();
        }.bind(this)
      });
    },
    onMouseOver: function() {
      if (this.isSettings() && !this.$('.remove-volume').is(':visible')) {
        this.$('.remove-volume').show();
      }
      if (this.$el.hasClass('current-volume') &&
          !this.$('.open-settings').is(':visible') &&
          !this.$el.parent().parent().hasClass('open')) {
        this.$('.open-settings').show();
      }
    },
    onMouseOut: function() {
      if (this.isSettings()) {
        return;
      }
      if (this.$('.remove-volume').is(':visible')) {
        this.$('.remove-volume').hide();
      }
      if (this.$('.open-settings').is(':visible')) {
        this.$('.open-settings').hide();
      }
    },
    addIconWhite: function(evt) {
      this.$(evt.target).addClass('icon-white');
    },
    removeIconWhite: function(evt) {
      this.$(evt.target).removeClass('icon-white');
    },
    onMouseOverSettings: function(evt) {
      if (this.isSettings() || !this.$el.hasClass('current-volume')) {
        return;
      }
      this.$(evt.target).addClass('icon-white');
    }
  });

  return VolumeView;
});
