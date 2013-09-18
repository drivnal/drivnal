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
    eventType: 'tasks_updated',
    notifications: true,
    onLogView: function(taskId) {
      var model = new TextLogModel({
        id: taskId,
        volume: this.collection.getVolume(),
        type: 'task',
        title: 'Task Log',
        subText: taskId
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

  return TaskListView;
});
