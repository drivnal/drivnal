define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumeSlider',
  'text!templates/backup/volumeSlider.html'
], function($, _, Backbone, Bootstrap, VolumeSliderView) {
  'use strict';
  var MIN_VALUE_START = 0;
  var HOUR_VALUE_START = 59;
  var WEEKDAY_VALUE_START = 82;
  var DAY_VALUE_START = 89;

  var VolumeSliderScheduleView = VolumeSliderView.extend({
    name: 'name',
    title: 'Schedule',
    icon: 'icon-time',
    sliderOptions: {
      min: 0,
      max: 119
    },
    setValue: function(value) {
      this.$('input').val(value).change();
    },
    getSetting: function() {
      var schedule = this.$('input').val();
      schedule = schedule.replace(' ', '').toLowerCase();
      if (schedule.slice(-1) === 's') {
        schedule = schedule.slice(0, -1);
      }
      return schedule;
    },
    onInputChange: function() {
      var i;
      var value = this.$('input').val().toLowerCase();
      var valueSplit = value.split('');
      var alpha = 'abcdefghijklmnopqrstuvwxyz';
      var minuteUnits = ['m', 'min', 'minute'];
      var hourUnits = ['h', 'hr', 'hour'];
      var dayUnits = ['d', 'day'];
      var weekdayUnits = {
        'monday': 1,
        'mon': 1,
        'mo': 1,
        'm': 1,
        'tuesday': 2,
        'tues': 2,
        'tue': 2,
        'tu': 2,
        't': 2,
        'wednesday': 3,
        'wed': 3,
        'we': 3,
        'w': 3,
        'thursday': 4,
        'thur': 4,
        'thu': 4,
        'th': 4,
        'friday': 5,
        'fri': 5,
        'fr': 5,
        'f': 5,
        'saturday': 6,
        'sat': 6,
        'sa': 6,
        's': 6,
        'sunday': 7,
        'sun': 7,
        'su': 7
      };

      if (value in weekdayUnits) {
        value = WEEKDAY_VALUE_START + weekdayUnits[value];
      }
      else {
        var numbers = '';
        var letters = '';
        var onNum = true;
        var inputChar;
        for (i = 0; i < valueSplit.length; i++) {
          inputChar = valueSplit[i];
          if (onNum) {
            if (inputChar !== ' ' && !isNaN(inputChar)) {
              numbers += inputChar;
            }
            else {
              onNum = false;
            }
          }

          if (!onNum) {
            if (alpha.indexOf(inputChar.toLowerCase()) !== -1) {
              letters += inputChar.toLowerCase();
            }
          }
        }

        numbers = parseInt(numbers, 10);
        if (letters.slice(-1) === 's') {
          letters = letters.slice(0, -1);
        }

        if (minuteUnits.indexOf(letters) !== -1) {
          value = MIN_VALUE_START;
        }
        else if (hourUnits.indexOf(letters) !== -1) {
          value = HOUR_VALUE_START;
        }
        else if (dayUnits.indexOf(letters) !== -1) {
          value = DAY_VALUE_START;
        }
        else {
          value = null;
        }

        if (isNaN(numbers) || value === null) {
          value = 0;
        }
        else {
          value += numbers;
        }
      }

      this.$('.slider').slider('value', value);
    },
    onSliderEvent: function(evt, ui) {
      var value = ui.value;
      var inputValue;

      if (value === 0) {
        inputValue = 'None';
      }
      else if (value <= HOUR_VALUE_START) {
        inputValue = value + ' Minute';
        if (value > 1) {
          inputValue += 's';
        }
      }
      else if (value <= WEEKDAY_VALUE_START) {
        value -= HOUR_VALUE_START;
        inputValue = value + ' Hour';
        if (value > 1) {
          inputValue += 's';
        }
      }
      else if (value <= DAY_VALUE_START) {
        value -= WEEKDAY_VALUE_START;
        if (value === 1) {
          inputValue = 'Monday';
        }
        else if (value === 2) {
          inputValue = 'Tuesday';
        }
        else if (value === 3) {
          inputValue = 'Wednesday';
        }
        else if (value === 4) {
          inputValue = 'Thursday';
        }
        else if (value === 5) {
          inputValue = 'Friday';
        }
        else if (value === 6) {
          inputValue = 'Saturday';
        }
        else if (value === 7) {
          inputValue = 'Sunday';
        }
      }
      else {
        value -= DAY_VALUE_START;
        inputValue = value + ' Day';
        if (value > 1) {
          inputValue += 's';
        }
      }

      this.$('input').val(inputValue);
    }
  });

  return VolumeSliderScheduleView;
});
