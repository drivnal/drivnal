define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/volumeList',
  'views/backup/snapshotList',
  'views/backup/taskList',
  'views/backup/objectList',
  'text!templates/backup/backups.html'
], function($, _, Backbone, VolumeListView, SnapshotListView, TaskListView,
    ObjectListView, backupsTemplate) {
  'use strict';
  var BackupsView = Backbone.View.extend({
    template: _.template(backupsTemplate),
    render: function() {
      this.$el.html(this.template());

      this.volumes = new VolumeListView();
      this.addView(this.volumes);
      this.snapshots = new SnapshotListView();
      this.addView(this.snapshots);
      this.tasks = new TaskListView();
      this.addView(this.tasks);
      this.origin = new ObjectListView();
      this.addView(this.origin);
      this.past = new ObjectListView({
        originView: this.origin
      });
      this.addView(this.past);

      this.listenTo(this.volumes, 'changeVolume', this.changeVolume);
      this.listenTo(this.volumes, 'updateSize', this.updateSize);
      this.listenTo(this.volumes, 'newSnapshot', this.newSnapshot);
      this.listenTo(this.volumes, 'updateOrigin', this.updateOrigin);

      this.listenTo(this.snapshots, 'change', this.changeSnapshot);
      this.listenTo(this.snapshots, 'remove', this.deleteSnapshots);
      this.listenTo(this.snapshots, 'updateSize', this.updateSize);
      this.listenTo(this.snapshots, 'open', this.snapshotsOpen);

      this.listenTo(this.tasks, 'updateSize', this.updateSize);
      this.listenTo(this.tasks, 'open', this.tasksOpen);

      this.listenTo(this.past, 'restoreObjects', this.restoreObjects);
      this.listenTo(this.past, 'updateSize', this.updateSize);
      this.listenTo(this.origin, 'updateSize', this.updateSize);

      this.$('.volumes-box').html(this.volumes.render().el);
      this.$('.snapshots-box').html(this.snapshots.render().el);
      this.$('.tasks-box').html(this.tasks.render().el);
      this.$('.past').html(this.past.render().el);
      this.$('.origin').html(this.origin.render().el);

      this.volumes.update();

      $(window).bind('resize.backups', (this.updateSize).bind(this));
      this.updateSize();

      return this;
    },
    deinitialize: function() {
      $(window).unbind('resize.backups');
    },
    snapshotsOpen: function() {
      this.tasks.hideItems();
    },
    tasksOpen: function() {
      this.snapshots.hideItems();
    },
    updateSize: function() {
      var innerHeight = $(window).height();
      var listHeight = innerHeight - this.volumes.$el.outerHeight() - 156;
      var objectWidth = this.past.$('.object-list-box').width() - 200;

      if (this.snapshots.isItems()) {
        this.snapshots.$('.item-list-box').children().not(
          '.item-list').each(function() {
            if ($(this).is(':visible')) {
              listHeight -= $(this).outerHeight();
            }
          });
        this.snapshots.$('.item-list').height(listHeight);
      }
      else {
        this.tasks.$('.item-list-box').children().not(
          '.item-list').each(function() {
            if ($(this).is(':visible')) {
              listHeight -= $(this).outerHeight();
            }
          });
        this.tasks.$('.item-list').height(listHeight);
      }

      this.past.$('.object-list-box').height(innerHeight - 137);
      this.origin.$('.object-list-box').height(innerHeight - 137);
      this.$('.object-drop').height(innerHeight - 98);
      this.$('.text-viewer-box .editor, ' +
        '.text-viewer-box .plaintext').height(innerHeight - 144);

      this.$('.object-list-box .title-header').width(objectWidth);
      this.$('.object-list-box .title-col-box').width(objectWidth - 22);

      this.past.pathList.onResize();
      this.origin.pathList.onResize();
    },
    updateOrigin: function() {
      this.origin.update();
    },
    changeVolume: function(volume) {
      this.snapshots.collection.setVolume(volume);
      this.snapshots.update();

      this.tasks.collection.setVolume(volume);
      this.tasks.update();

      this.past.collection.setVolume(volume);
      this.past.collection.setSnapshot(null);
      this.past.collection.setPath(null);
      this.past.update();

      this.origin.collection.setVolume(volume);
      this.origin.update();
    },
    changeSnapshot: function(snapshot) {
      this.past.collection.setSnapshot(snapshot);
      this.past.collection.setPath(null);
      this.past.update();
    },
    deleteSnapshots: function(snapshots) {
      _.each(snapshots, function(snapshot) {
        snapshot.model.destroy({
          success: function() {
            snapshot.destroy();
          }
        });
      });
    },
    newSnapshot: function(options) {
      this.snapshots.collection.create({
        volume: this.snapshots.collection.getVolume()
      }, options);
    },
    restoreObjects: function(volumeId, snapshotId, sourcePath, objectIds) {
      var i;
      var destPath = this.origin.collection.getPath() || '';

      var sourcePaths = [];
      for (i = 0; i < objectIds.length; i++) {
        sourcePaths.push(sourcePath + '/' + objectIds[i]);
      }

      Backbone.ajax({
        type: 'POST',
        url: '/restore/' + volumeId + '/' + snapshotId,
        contentType: 'application/json',
        data: JSON.stringify({
          'source_paths': sourcePaths,
          'destination_path': destPath
        }),
        success: function() {},
        error: function() {}
      });
    }
  });

  return BackupsView;
});
