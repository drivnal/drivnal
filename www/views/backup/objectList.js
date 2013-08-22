define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/object',
  'views/backup/object',
  'views/backup/objectPathList',
  'views/backup/objectDrop',
  'views/backup/text',
  'text!templates/backup/objectList.html'
], function($, _, Backbone, ObjectCollection, ObjectView, ObjectPathListView,
    ObjectDropView, TextView, objectListTemplate) {
  'use strict';
  var ObjectListView = Backbone.View.extend({
    className: 'object-list  no-select',
    template: _.template(objectListTemplate),
    events: {
      'click .select-header .select': 'globalSelect'
    },
    initialize: function() {
      this.views = [];
      this.selected = [];
      this.collection = new ObjectCollection();
      this.listenTo(this.collection, 'reset', this.onReset);
      this.pathList = new ObjectPathListView();
      this.listenTo(this.pathList, 'changePath', this.onChangePath);
    },
    render: function() {
      this.$el.html(this.template());
      this.$el.prepend(this.pathList.render().el);
      return this;
    },
    initSnapshot: function(presentView) {
      this.origin = presentView;
    },
    update: function() {
      var snapshot;

      if (this.origin) {
        if (this.collection.getSnapshot()) {
          snapshot = window.formatTime(this.collection.getSnapshot());
        }
        else {
          snapshot = 'Snapshot';
        }
      }
      else {
        snapshot = 'Present';
      }

      var path = this.collection.getPath();
      this.pathList.updatePath(snapshot, path);

      // If no snapshot selected or volume is null clear object list
      if ((this.origin && !this.collection.getSnapshot()) ||
          !this.collection.getVolume()) {
        this.collection.reset();
        return;
      }

      this.collection.fetch({
        reset: true,
        error: function() {
          this.collection.reset();
        }.bind(this)
      });
    },
    updateSize: function() {
      this.trigger('updateSize');
    },
    globalSelect: function() {
      var i;

      // Only snapshot object list uses selection
      if (!this.origin) {
        return;
      }

      if (this.selected.length) {
        this.clearSelected();
      }
      else if (this.views.length) {
        for (i = 0; i < this.views.length; i++) {
          this.views[i].setSelect('full');
          this.selected.push(this.views[i]);
        }
        this.$('.select-header .select').addClass('selected');
      }
    },
    clearSelected: function() {
      for (var i = 0; i < this.selected.length; i++) {
        this.selected[i].setSelect(null);
      }
      this.selected = [];
      this.$('.select-header .select').removeClass('selected');
    },
    onReset: function(collection) {
      var i;
      var objectView;

      for (i = 0; i < this.views.length; i++) {
        this.views[i].remove();
      }
      this.views = [];
      this.selected = [];
      this.$('.select-header .select').removeClass('selected');
      for (i = 0; i < collection.models.length; i++) {
        objectView = new ObjectView({model: collection.models[i]});
        this.views.push(objectView);
        this.listenTo(objectView, 'select', this.onSelect);
        this.listenTo(objectView, 'drag', this.onDrag);
        this.listenTo(objectView, 'open', this.onOpen);
        this.listenTo(objectView, 'view', this.onView);
        this.$('tbody').append(objectView.render().el);
      }
      this.updateSize();
    },
    onSelect: function(objectView, key) {
      var i;

      // Only snapshot object list uses selection
      if (!this.origin) {
        return;
      }

      if (!key) {
        this.clearSelected();
        this.selected.push(objectView);
        objectView.setSelect('full');
      }
      else if (key === 'shift') {
        if (!this.selected.length) {
          return;
        }
        var start = this.views.indexOf(
          this.selected[this.selected.length - 1]);
        var end = this.views.indexOf(objectView) + 1;
        if (start >= end) {
          var temp = start;
          start = end - 1;
          end = temp;
        }
        for (i = start; i < end; i++) {
          if (!this.views[i].getSelect()) {
            this.selected.push(this.views[i]);
          }
          this.views[i].setSelect('full');
        }
      }
      else if (!objectView.getSelect() && key === 'ctrl') {
        this.selected.push(objectView);
        objectView.setSelect('full');
      }
      else if (objectView.getSelect() && key === 'ctrl') {
        this.selected.splice(this.selected.indexOf(objectView), 1);
        objectView.setSelect(null);
      }

      if (this.selected.length) {
        this.$('.select-header .select').addClass('selected');
      }
      else {
        this.$('.select-header .select').removeClass('selected');
      }
    },
    onDrag: function(objectView) {
      var selectedObjects;
      var dragBoxText;
      var resetSelect = false;

      // Only snapshot object list uses dragging
      if (!this.origin) {
        return;
      }

      var objectDropView = new ObjectDropView();
      this.origin.$el.parent().prepend(objectDropView.render().el);
      this.updateSize();

      if (objectView.getSelect() && this.selected.length > 1) {
        selectedObjects = this.selected.slice(0);
        dragBoxText = 'Restore ' + this.selected.length + ' Items';
      }
      else {
        selectedObjects = [objectView];
        dragBoxText = 'Restore \'' + objectView.model.get('id') + '\'';

        if (!objectView.getSelect()) {
          // When dragging a object that is unselected half select object
          objectView.setSelect('half');
          resetSelect = true;
        }
      }

      // TODO Create view for drag box
      var dragBox = $('<div>' + dragBoxText + '</div>');
      dragBox.addClass('backup').addClass('drag-box');

      $('body').append(dragBox);

      $(document).bind('mousemove.objectList', function(evt) {
        var mouseX = evt.clientX + window.scrollX;
        var mouseY = evt.clientY + window.scrollY;
        var dragBoxWidth = dragBox.width() + 17;
        var dragBoxHeight = dragBox.height() + 3;

        // Prevent box from leaving window
        if (mouseY + dragBoxHeight < $(window).height()) {
          $(dragBox).css('top', (mouseY - 12) + 'px');
        }

        // Prevent box from leaving window
        if (mouseX + dragBoxWidth < $('body').width()) {
          $(dragBox).css('left', (mouseX - 3) + 'px');
          $(dragBox).css('position', (mouseX - 3) + 'px');
        }
      });

      $(document).bind('mouseup.objectList', function() {
        var i;

        $(document).unbind('mousemove.objectList');
        $(document).unbind('mouseup.objectList');
        $(dragBox).remove();
        objectDropView.remove();
        if (objectDropView.isHover()) {
          var selectedObjectIds = [];

          for (i = 0; i < selectedObjects.length; i++) {
            selectedObjectIds[i] = selectedObjects[i].model.get('id');
          }

          this.trigger('restoreObjects', this.collection.getVolume(),
            this.collection.getSnapshot(),
            this.collection.getPath() || '.', selectedObjectIds);
        }

        // If object was half selected clear selection
        if (resetSelect) {
          objectView.setSelect(null);
        }
      }.bind(this));
    },
    onOpen: function(objectView) {
      this.collection.addPath(objectView.model.get('id'));
      this.pathList.updatePath(this.collection.getSnapshot(),
        this.collection.getPath());
      this.update();
    },
    onView: function(objectView) {
      if (this.textView && this.textView.$el.is(':visible')) {
        return;
      }

      var path = '';
      if (this.collection.getPath()) {
        path += this.collection.getPath() + '/';
      }
      path += objectView.model.get('id');

      this.textView = new TextView({
        id: path,
        volume: this.collection.getVolume(),
        snapshot: this.collection.getSnapshot()
      });

      this.textView.model.fetch({
        success: function() {
          this.$el.parent().prepend(this.textView.render().el);
          this.updateSize();
        }.bind(this)
      });
    },
    onChangePath: function(path) {
      this.collection.setPath(path);
      this.pathList.updatePath(this.collection.getSnapshot(), path);
      this.update();
    }
  });

  return ObjectListView;
});
