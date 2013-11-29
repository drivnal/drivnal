define([
  'jquery',
  'underscore',
  'backbone',
  'models/backup/textLog',
  'views/backup/item',
  'text!templates/backup/snapshot.html'
], function($, _, Backbone, TextLogModel, ItemView, snapshotTemplate) {
  'use strict';
  var SnapshotView = ItemView.extend({
    template: _.template(snapshotTemplate),
    onLogView: function() {
      var model = new TextLogModel({
        id: this.model.get('id'),
        volume: this.model.get('volume'),
        type: 'snapshot',
        title: 'Snapshot Log',
        subText: window.formatTime(this.model.get('id'))
      });
      this.openLog(model);
    }
  });

  return SnapshotView;
});
