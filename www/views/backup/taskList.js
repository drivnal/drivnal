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

      if (this.textView) {
        var index = this.children.indexOf(this.textView);
        if (index !== -1) {
          this.children.splice(index, 1);
        }
        this.textView.destroy();
      }
      this.textView = new TextLogView({
        model: model
      });
      this.children.push(this.textView);

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
