define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/task',
  'views/backup/item',
  'text!templates/backup/itemList.html'
], function($, _, Backbone, TaskCollection, ItemView, itemListTemplate) {
  'use strict';
  var ItemListView = Backbone.View.extend({
    template: _.template(itemListTemplate),
    collectionClass: null,
    viewClass: ItemView,
    title: 'Items',
    removeTitle: 'Remove Select Items',
    eventType: null,
    selectable: false,
    defaultOpen: false,
    notifications: false,
    events: {},
    defaultEvents: {
      'click .list-title': 'onClickTitle',
      'click .remove-selected': 'onRemoveSelected'
    },
    initialize: function() {
      $.extend(this.events, this.defaultEvents);
      this.collection = new this.collectionClass();
      this.listenTo(this.collection, 'reset', this.onReset);
      if (this.eventType) {
        this.listenTo(window.events, this.eventType, function(volume) {
          if (volume !== this.collection.getVolume()) {
            return;
          }
          this.update(this.notifications);
        }.bind(this));
      }
      this.views = [];
      this.removing = [];
      this.currentVolume = null;
    },
    render: function() {
      this.$el.html(this.template({
        title: this.title,
        removeTitle: this.removeTitle
      }));

      if (!this.defaultOpen) {
        this.$('.item-list-box').addClass('closed');
        this.$('.item-list').hide();
        this.$('.item-list').css('padding-right', '1px');
      }

      return this;
    },
    updateSize: function() {
      this.trigger('updateSize');
    },
    update: function(notification) {
      if (this.collection.getVolume() !== this.currentVolume) {
        this.currentVolume = this.collection.getVolume();
        this.clearNotification();
      }

      if (!this.collection.getVolume()) {
        this.collection.reset();
        return;
      }

      if (notification) {
        this.notification = true;
      }

      this.collection.fetch({
        reset: true,
        success: function() {
          this.notification = false;
        }.bind(this),
        error: function() {
          this.notification = false;
          this.collection.reset();
          // TODO Show error message
        }.bind(this)
      });
    },
    showItems: function(complete) {
      if (this.isItems()) {
        return;
      }
      this.trigger('open');

      this.$('.item-list-box').removeClass('closed');
      this.updateSize();
      this.$('.item-list').slideDown(300, function() {
        // Padding must change to fix error with scroll bar
        this.$('.item-list').css('padding-right', '0');
        if (complete) {
          complete();
        }
      }.bind(this));
    },
    hideItems: function(complete) {
      if (!this.isItems()) {
        return;
      }

      this.$('.item-list-box').addClass('closed');
      this.resetRemove();
      this.updateSize();
      this.$('.item-list').slideUp(300, function() {
        // Padding must change to fix error with scroll bar
        this.$('.item-list').css('padding-right', '1px');
        if (complete) {
          complete();
        }
      }.bind(this));
    },
    isItems: function() {
      return !this.$('.item-list-box').hasClass('closed');
    },
    showRemove: function(complete) {
      if (this.isRemove()) {
        return;
      }

      this.$('.remove-selected').slideDown({
        duration: 100,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    hideRemove: function(complete) {
      if (!this.isRemove()) {
        return;
      }

      this.$('.remove-selected').slideUp({
        duration: 100,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    isRemove: function() {
      return this.$('.remove-selected').is(':visible');
    },
    removeItem: function(view) {
      view.$el.slideUp({
        duration: 250,
        complete: function() {
          view.destroy();
        }.bind(this)
      });
    },
    addNotification: function() {
      var count = parseInt(this.$('.notification').text(), 10);

      if (isNaN(count)) {
        count = 1;
      }
      else {
        count += 1;
      }

      if (count < 10) {
        if (this.$('.notification').hasClass('many')) {
          this.$('.notification').removeClass('many');
        }
        if (!this.$('.notification').hasClass('one')) {
          this.$('.notification').addClass('one');
        }
      }
      else {
        if (this.$('.notification').hasClass('one')) {
          this.$('.notification').removeClass('one');
        }
        if (!this.$('.notification').hasClass('many')) {
          this.$('.notification').addClass('many');
        }
      }

      this.$('.notification').text(count.toString());

      if (!this.$('.notification').is(':visible')) {
        this.$('.notification').fadeIn(250);
      }

      this.$('.notification').addClass('flash');
      setTimeout(function() {
        this.$('.notification').removeClass('flash');
      }.bind(this), 100);
    },
    clearNotification: function() {
      this.$('.notification').text('');
      this.$('.notification').fadeOut(250);
    },
    onReset: function(collection) {
      var i;
      var modelView;
      var attr;
      var modified;
      var currentModels = [];
      var newModels = [];

      this.$('.list-title span').text(this.title + ' (' +
        collection.models.length + ')');

      for (i = 0; i < this.views.length; i++) {
        currentModels.push(this.views[i].model.get('id'));
      }

      for (i = 0; i < collection.models.length; i++) {
        newModels.push(collection.models[i].get('id'));
      }

      // Remove elements that no longer exists
      for (i = 0; i < this.views.length; i++) {
        if (newModels.indexOf(this.views[i].model.get('id')) === -1) {
          // If view is selected trigger change to remove selection
          if (this.views[i].getSelect()) {
            this.trigger('change', null);
          }

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

        if (this.notification && !this.isItems()) {
          this.addNotification();
        }

        modelView = new this.viewClass({model: collection.models[i]});
        this.addView(modelView);
        this.views.splice(i, 0, modelView);
        this.listenTo(modelView, 'select', this.onSelect);
        this.listenTo(modelView, 'remove', this.onRemove);
        this.listenTo(modelView, 'viewLog', this.onLogView);
        modelView.render().$el.hide();

        if (i === 0) {
          this.$('.item-list').prepend(modelView.el);
        }
        else {
          this.views[i - 1].$el.after(modelView.el);
        }

        modelView.$el.slideDown(250);
      }

      // Save orig scroll position
      var scrollPos = this.$('.item-list').scrollTop();

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
        this.views[i].render();
      }

      // Restore orig scroll position
      if (this.$('.item-list').scrollTop() !== scrollPos) {
        this.$('.item-list').scrollTop(scrollPos);
      }
    },
    onClickTitle: function() {
      if (this.isItems()) {
        return;
      }
      this.clearNotification();
      this.showItems();
    },
    resetSelected: function() {
      this.currentItem.setSelect(false);
      this.currentItem = null;
      this.trigger('change', null);
    },
    resetRemove: function() {
      for (var i = 0; i < this.removing.length; i++) {
        if (this.currentItem === this.removing[i]) {
          this.resetSelected();
        }
        this.removing[i].setRemove(false);
      }
      this.removing = [];
      this.hideRemove();
    },
    onSelect: function(view) {
      if (!this.selectable || this.currentItem === view) {
        return;
      }
      if (this.currentItem) {
        this.currentItem.setSelect(false);
      }
      this.currentItem = view;
      this.currentItem.setSelect(true);
      this.trigger('change', this.currentItem.model.get('id'));
    },
    onRemove: function(snapshotView, key) {
      var i;

      if (key === 'shift' && this.removing.length) {
        var start = this.views.indexOf(
          this.removing[this.removing.length - 1]);
        var end = this.views.indexOf(snapshotView) + 1;
        if (start >= end) {
          var temp = start;
          start = end - 1;
          end = temp;
        }
        for (i = start; i < end; i++) {
          if (this.views[i].getRemove()) {
            continue;
          }
          this.removing.push(this.views[i]);
          this.views[i].setRemove(true);
        }
      }
      else {
        if (snapshotView.getRemove()) {
          for (i = 0; i < this.removing.length; i++) {
            if (this.removing[i] === snapshotView) {
              this.removing.splice(i, 1);
            }
          }
          snapshotView.setRemove(false);
        }
        else {
          this.removing.push(snapshotView);
          snapshotView.setRemove(true);
        }
      }

      if (this.removing.length) {
        this.showRemove();
      }
      else {
        this.hideRemove();
      }
    },
    onLogView: function() {
    },
    onNewSnapshot: function() {
      if (!this.collection.getVolume()) {
        return;
      }
      this.collection.create({
        volume: this.collection.getVolume()
      });
    },
    onRemoveSelected: function() {
      _.each(this.removing, function(view) {
        view.model.destroy({});
      });
      this.resetRemove();
      this.updateSize();
    }
  });

  return ItemListView;
});
