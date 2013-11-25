define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/textLog',
  'views/backup/textLog',
  'views/backup/item',
  'text!templates/backup/snapshot.html'
], function($, _, Backbone, TextLogModel, TextLogView, ItemView,
    snapshotTemplate) {
  'use strict';
  var SnapshotView = ItemView.extend({
    template: _.template(snapshotTemplate),
    onLogView: function() {
      this.$('.view-log').removeClass('icon-list-alt');
      this.$('.view-log').addClass('icon-time');

      var model = new TextLogModel({
        id: this.model.get('id'),
        volume: this.model.get('volume'),
        type: 'snapshot',
        title: 'Snapshot Log',
        subText: window.formatTime(this.model.get('id'))
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

  return SnapshotView;
});
