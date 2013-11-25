define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/textLog',
  'views/backup/textLog',
  'views/backup/item',
  'text!templates/backup/task.html'
], function($, _, Backbone, TextLogModel, TextLogView, ItemView,
    taskTemplate) {
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
      this.$('.view-log').removeClass('icon-list-alt');
      this.$('.view-log').addClass('icon-time');

      var model = new TextLogModel({
        id: this.model.get('id'),
        volume: this.model.get('volume'),
        type: 'task',
        title: 'Task Log',
        subText: this.model.get('id')
      });

      var textView = new TextLogView({
        model: model
      });
      this.addView(textView);
      textView.model.fetch({
        error: function() {
          this.$('.view-log').removeClass('icon-time');
          this.$('.view-log').addClass('icon-list-alt');
        }.bind(this),
        success: function() {
          this.$('.view-log').removeClass('icon-time');
          this.$('.view-log').addClass('icon-list-alt');
          this.$el.parent().parent().parent().parent().parent().prepend(
            textView.render().el);
          this.trigger('updateSize');
        }.bind(this)
      });
    }
  });

  return TaskView;
});
