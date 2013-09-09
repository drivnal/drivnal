define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/volume',
  'views/backup/volume',
  'text!templates/backup/volumeList.html'
], function($, _, Backbone, VolumeCollection, VolumeView, volumeListTemplate) {
  'use strict';
  var VolumeListView = Backbone.View.extend({
    template: _.template(volumeListTemplate),
    events: {
      'click .new-volume .item': 'createVolume',
      'click .current-volume .item': 'onClickCurrentVolume',
      'click .new-snapshot-box .new-snapshot': 'onNewSnapshot',
      'click .new-snapshot-box .error': 'hideNewSnapshotError'
    },
    initialize: function() {
      this.collection = new VolumeCollection();
      this.listenTo(this.collection, 'add', this.add);
      this.listenTo(this.collection, 'reset', this.onReset);
      this.views = [];
      this.newVolumeView = null;
    },
    render: function() {
      this.$el.html(this.template());
      this.$('.backup-volumes li').hide();
      return this;
    },
    updateSize: function() {
      this.trigger('updateSize');
    },
    update: function() {
      this.collection.fetch({
        reset: true,
        success: function() {
        }.bind(this),
        error: function() {
        }.bind(this)
      });
    },
    createVolume: function() {
      this.collection.add({});
    },
    showNewSnapshotError: function() {
      if (this.isNewSnapshotError()) {
        return;
      }
      this.$('.new-snapshot-box .error').slideDown({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    hideNewSnapshotError: function() {
      if (!this.isNewSnapshotError()) {
        return;
      }
      this.$('.new-snapshot-box .error').slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    isNewSnapshotError: function() {
      return this.$('.new-snapshot-box .error').is(':visible');
    },
    onNewSnapshot: function() {
      if (!this.currentVolume) {
        return;
      }
      if (this.currentVolume.getRunning()) {
        return;
      }
      this.trigger('newSnapshot', {
        success: function() {
          this.hideNewSnapshotError();
        }.bind(this),
        error: function() {
          this.showNewSnapshotError();
        }.bind(this)
      });
    },
    updateRunning: function() {
      if (!this.currentVolume || this.currentVolume.getRunning() ||
          !this.currentVolume.model.get('id')) {
        if (!this.$('.new-snapshot').hasClass('disabled')) {
          this.$('.new-snapshot').addClass('disabled');
        }
      }
      else {
        if (this.$('.new-snapshot').hasClass('disabled')) {
          this.$('.new-snapshot').removeClass('disabled');
        }
      }
    },
    add: function(model) {
      var volumeView = new VolumeView({model: model});
      if (model.get('id') === null) {
        if (this.newVolumeView) {
          return;
        }
        this.newVolumeView = volumeView;
      }
      else {
        this.views.push(volumeView);
      }
      this.listenTo(volumeView, 'select', this.select);
      this.listenTo(volumeView, 'update', this.update);
      this.listenTo(volumeView, 'updateSize', this.updateSize);
      this.listenTo(volumeView, 'updateOrigin', function() {
        // Only update origin for current volume
        if (this.currentVolume && volumeView.model.get(
            'id') === this.currentVolume.model.get('id')) {
          this.trigger('updateOrigin');
        }
      });
      volumeView.render();

      // If adding a new volume select it
      if (model.get('id') === null) {
        this.select(volumeView);
        volumeView.showSettings();
        this.hideVolumes();
      }
      else {
        volumeView.$el.hide();
        this.$('.backup-volumes .last').before(volumeView.el);
        if (this.isVolumes()) {
          volumeView.$el.slideDown({
            duration: 250,
            step: (this.updateSize).bind(this),
            complete: function() {
              this.updateSize();
            }.bind(this)
          });
        }
      }
      this.updateSize();
    },
    removeItem: function(view) {
      if (this.currentVolume.model.get('id') === view.model.get('id')) {
        view.$el.hide();
        view.remove();
        this.updateSize();
        this.currentVolume = undefined;
        return;
      }

      view.$el.slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          view.remove();
          this.updateSize();
        }.bind(this)
      });
    },
    onReset: function(collection) {
      var i;
      var attr;
      var modified;
      var currentModels = [];
      var newModels = [];

      for (i = 0; i < this.views.length; i++) {
        currentModels.push(this.views[i].model.get('id'));
      }

      for (i = 0; i < collection.models.length; i++) {
        newModels.push(collection.models[i].get('id'));
      }

      // Remove new volume view if settings are not open
      if (this.newVolumeView && !this.newVolumeView.isSettings()) {
        this.removeItem(this.newVolumeView);
        this.newVolumeView = null;
      }

      // Remove elements that no longer exists
      for (i = 0; i < this.views.length; i++) {
        if (newModels.indexOf(this.views[i].model.get('id')) === -1) {

          // Remove item from dom and array
          this.removeItem(this.views[i]);
          this.views.splice(i, 1);
          i -= 1;
        }
      }

      // Add new elements
      for (i = 0; i < collection.models.length; i++) {
        if (currentModels.indexOf(collection.models[i].get('id')) !== -1) {
          continue;
        }

        this.add(collection.models[i]);
      }

      // Check for modified data
      for (i = 0; i < collection.models.length; i++) {
        modified = false;

        // Check each attr for modified data
        for (attr in collection.models[i].attributes) {
          if (collection.models[i].get(attr) !==
              this.views[i].model.get(attr)) {
            modified = true;
            break;
          }
        }

        if (!modified) {
          continue;
        }

        // If data was modified updated attributes and render
        this.views[i].model.set(collection.models[i].attributes);
        this.views[i].update();
      }

      // Select first volume if no current volume
      if (this.currentVolume === undefined) {
        if (!this.views.length) {
          this.createVolume();
        }
        else {
          this.select(this.views[0]);
        }
      }
      else {
        this.updateRunning();
      }
    },
    select: function(volumeView) {
      this.hideNewSnapshotError();

      if (this.currentVolume) {
        this.currentVolume.$el.removeClass('current-volume');
        this.$('.backup-volumes .last').before(this.currentVolume.el);
      }

      this.currentVolume = volumeView;

      this.$('.backup-volumes .dropdown-menu').prepend(volumeView.el);
      volumeView.$el.addClass('current-volume');
      this.trigger('changeVolume', this.currentVolume.model.get('id'));

      if (!volumeView.$el.is(':visible')) {
        volumeView.$el.show();
        this.updateSize();
      }

      this.updateRunning();
    },
    hideVolumes: function() {
      if (!this.isVolumes()) {
        return;
      }
      var elements = this.$('.backup-volumes li').not('.current-volume');

      this.$('.backup-volumes').removeClass('open');

      elements.slice(1).slideUp({
        duration: 250,
        complete: (this.updateSize).bind(this)
      });

      // Call step function only on first element to avoid excessive calls
      elements.first().slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    showVolumes: function() {
      if (this.isVolumes()) {
        return;
      }
      var elements = this.$('.backup-volumes li').not('.current-volume');

      this.$('.backup-volumes').addClass('open');

      elements.slice(1).slideDown({
        duration: 250,
        complete: (this.updateSize).bind(this)
      });

      // Call step function only on first element to avoid excessive calls
      elements.first().slideDown({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
        }.bind(this)
      });
    },
    isVolumes: function() {
      if (this.$('.backup-volumes').hasClass('open')) {
        return true;
      }
      return false;
    },
    toggleVolumes: function() {
      if (this.isVolumes()) {
        if (this.currentVolume) {
          this.currentVolume.$('.open-settings').show();
        }
        this.hideVolumes();
      }
      else {
        if (this.currentVolume) {
          this.currentVolume.$('.open-settings').hide();
        }
        this.showVolumes();
      }
    },
    onClickCurrentVolume: function() {
      this.toggleVolumes();
    }
  });

  return VolumeListView;
});
