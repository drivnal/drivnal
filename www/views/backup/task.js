define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/item',
  'text!templates/backup/task.html'
], function($, _, Backbone, ItemView, taskTemplate) {
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
    }
  });

  return TaskView;
});
