define([
  'jquery',
  'underscore',
  'backbone',
  'collections/backup/task',
  'views/backup/task',
  'views/backup/itemList',
  'views/backup/textLog',
  'models/backup/textLog'
], function($, _, Backbone, TaskCollection, TaskView, ItemListView,
    TextLogView, TextLogModel) {
  'use strict';
  var TaskListView = ItemListView.extend({
    collectionClass: TaskCollection,
    viewClass: TaskView,
    title: 'Tasks',
    removeTitle: 'Remove Selected Tasks',
    onLogView: function(taskId) {
      var model = new TextLogModel({
        id: taskId,
        volume: this.collection.getVolume(),
        type: 'task',
        title: 'Task Log',
        subText: taskId
      });

      this.textView = new TextLogView({
        model: model
      });

      this.textView.model.fetch({
        success: function() {
          this.$el.parent().parent().prepend(this.textView.render().el);
          this.updateSize();
        }.bind(this)
      });
    }
  });

  return TaskListView;
});
