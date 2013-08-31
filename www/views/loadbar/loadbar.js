define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/loadbar/loadbar.html'
], function($, _, Backbone, loadbarTemplate) {
  'use strict';
  var LoadbarView = Backbone.View.extend({
    template: _.template(loadbarTemplate),
    initialize: function() {
      this.progress = 0;
    },
    render: function() {
      this.$el.html(this.template());
      this.$('.main').width('0%');
      this.defaultTransition();
      return this;
    },
    setTransition: function(selector, transition) {
      this.$(selector).css('-webkit-transition', transition);
      this.$(selector).css('-moz-transition', transition);
      this.$(selector).css('-ms-transition', transition);
      this.$(selector).css('-o-transition', transition);
      this.$(selector).css('transition', transition);
    },
    defaultTransition: function() {
      this.setTransition('.main', 'width 10000ms');
    },
    resetPosition: function() {
      this.$('.main, .alt').width('0');
      this.$('.main, .alt').css('top', '0');
      this.$('.main, .alt').css('left', '0');
    },
    clearProgress: function() {
      this.setTransition('.main', 'none');
      this.setProgress(0);
      setTimeout(function() {
        this.defaultTransition();
      }.bind(this), 50);
    },
    setProgress: function(progress) {
      if (this.rolling) {
        return;
      }
      if (progress === undefined) {
        progress = 0;
      }
      this.$('.main').width(progress + '%');
      this.progress = progress;
    },
    setProgressTime: function(progress, time) {
      if (this.rolling) {
        return;
      }
      this.setTransition('.main', 'width ' + time + 'ms');
      this.setProgress(progress);
      setTimeout(function() {
        if (progress === 100) {
          this.clearProgress();
        }
        else {
          this.defaultTransition();
        }
      }.bind(this), time);
    },
    startProgressRoll: function(time) {
      if (this.rolling) {
        return;
      }
      this.rolling = true;
      if (time === undefined) {
        time = 2000;
      }
      var width = 20;
      var partTime = Math.round(time * 0.64);
      var resetTime = Math.round(time * 0.5);
      var alt = false;

      this.setTransition('.main, .alt', 'none');
      this.$('.main, .alt').css('left', '-' + width + '%');
      this.$('.main, .alt').width(width + '%');
      this.setTransition('.main, .alt', 'left ' + time + 'ms');

      var roll = function() {
        var lastElement;
        var nextElement;

        if (alt) {
          lastElement = 'main';
          nextElement = 'alt';
        }
        else {
          lastElement = 'alt';
          nextElement = 'main';
        }

        setTimeout(function() {
          this.setTransition('.' + lastElement, 'none');
          this.$('.' + lastElement).css('left', '-' + width + '%');

          setTimeout(function() {
            if (!this.rolling) {
              this.resetPosition();
              return;
            }
            this.setTransition('.' + lastElement, 'left ' + time + 'ms');
          }.bind(this), 100);
        }.bind(this), resetTime);
        this.$('.' + nextElement).css('left', '100%');

        alt = !alt;
        if (this.rolling) {
          setTimeout(roll, partTime);
        }
      }.bind(this);

      roll();
    },
    stopProgressRoll: function() {
      if (!this.rolling) {
        return;
      }
      this.rolling = false;
      this.$('.main, .alt').css('top', '-10px');
    },
    getProgress: function() {
      return this.progress;
    }
  });

  return LoadbarView;
});
