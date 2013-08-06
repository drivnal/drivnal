define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/task',
  'views/backup/task',
  'views/backup/itemList'
], function($, _, Backbone, TaskCollection, TaskView, ItemListView) {
  'use strict';
  var TaskListView = ItemListView.extend({
    collectionClass: TaskCollection,
    viewClass: TaskView,
    title: 'Tasks',
    removeTitle: 'Remove Selected Tasks',
  });

  return TaskListView;
});
