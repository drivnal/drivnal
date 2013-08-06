define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/snapshot',
  'views/backup/snapshot',
  'views/backup/itemList',
  'text!templates/backup/snapshotList.html'
], function($, _, Backbone, SnapshotCollection, SnapshotView, ItemListView,
    snapshotListTemplate) {
  'use strict';
  var SnapshotListView = ItemListView.extend({
    template: _.template(snapshotListTemplate),
    collectionClass: SnapshotCollection,
    viewClass: SnapshotView,
    title: 'Snapshots',
    removeTitle: 'Delete Selected Snapshots',
    selectable: true,
    defaultOpen: true
  });

  return SnapshotListView;
});
