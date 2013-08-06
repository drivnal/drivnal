define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/event'
], function($, _, Backbone, EventModel) {
  'use strict';
  var EventCollection = Backbone.Collection.extend({
    model: EventModel,
    initialize: function() {
      this.processedEvents = [];
    },
    url: function() {
      return '/event/' + this.getVolume() + '/' + this.lastEventTime;
    },
    setVolume: function(volume) {
      this.lastEventTime = 0;
      this.volume = volume;
    },
    getVolume: function() {
      return this.volume;
    },
    callFetch: function(uuid) {
      if (!this.getVolume()) {
        return;
      }

      this.fetch({
        reset: true,
        success: function(collection) {
          if (uuid !== this.currentLoop) {
            return;
          }
          var i;
          var model;

          for (i = 0; i < collection.models.length; i++) {
            model = collection.models[i];

            if (this.processedEvents.indexOf(model.get('id')) !== -1) {
              continue;
            }
            this.processedEvents.push(model.get('id'));

            if (model.get('time') > this.lastEventTime) {
              this.lastEventTime = model.get('time');
            }

            // Ignore callback for time events
            if (this.callback && model.get('type') !== 'time') {
              this.callback(model.get('type'));
            }
          }

          this.callFetch(uuid);
        }.bind(this),
        error: function() {
          if (uuid !== this.currentLoop) {
            return;
          }
          setTimeout(function() {
            this.callFetch(uuid);
          }.bind(this), 1000);
        }.bind(this)
      });
    },
    start: function(callback) {
      this.currentLoop = new Date().getTime();
      this.callback = callback;
      this.callFetch(this.currentLoop);
    },
    stop: function() {
      this.currentLoop = null;
      this.callback = null;
    }
  });

  return EventCollection;
});
