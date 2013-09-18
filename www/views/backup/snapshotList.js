define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/snapshot',
  'views/backup/snapshot',
  'views/backup/itemList',
  'views/backup/textLog',
  'models/backup/textLog',
  'text!templates/backup/snapshotList.html'
], function($, _, Backbone, SnapshotCollection, SnapshotView, ItemListView,
    TextLogView, TextLogModel, snapshotListTemplate) {
  'use strict';
  var SnapshotListView = ItemListView.extend({
    template: _.template(snapshotListTemplate),
    collectionClass: SnapshotCollection,
    viewClass: SnapshotView,
    title: 'Snapshots',
    removeTitle: 'Delete Selected Snapshots',
    eventType: 'snapshots_updated',
    selectable: true,
    defaultOpen: true,
    onLogView: function(snapshotId) {
      var model = new TextLogModel({
        id: snapshotId,
        volume: this.collection.getVolume(),
        type: 'snapshot',
        title: 'Snapshot Log',
        subText: window.formatTime(snapshotId)
      });

      var textView = new TextLogView({
        model: model
      });
      this.addView(textView);
      textView.model.fetch({
        success: function() {
          this.$el.parent().parent().prepend(textView.render().el);
          this.updateSize();
        }.bind(this)
      });
    }
  });

  return SnapshotListView;
});
