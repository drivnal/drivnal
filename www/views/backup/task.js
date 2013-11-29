define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/textLog',
  'views/backup/item',
  'text!templates/backup/task.html'
], function($, _, Backbone, TextLogModel, ItemView, taskTemplate) {
  'use strict';
  var TaskView = ItemView.extend({
    template: _.template(taskTemplate),
    iconTooltip: 'Click again to cancel task',
    getIconType: function() {
      if (this.model.get('state') === 'pending' ||
          this.model.get('state') === 'aborting') {
        return 'cancel';
      }
      return 'remove';
    },
    onCancel: function() {
      this.model.save({abort: true});
    },
    onLogView: function() {
      var model = new TextLogModel({
        id: this.model.get('id'),
        volume: this.model.get('volume'),
        type: 'task',
        title: 'Task Log',
        subText: this.model.get('id')
      });
      this.openLog(model);
    }
  });

  return TaskView;
});
