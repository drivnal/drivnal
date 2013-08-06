define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/item',
  'text!templates/backup/snapshot.html'
], function($, _, Backbone, ItemView, snapshotTemplate) {
  'use strict';
  var SnapshotView = ItemView.extend({
    template: _.template(snapshotTemplate),
  });

  return SnapshotView;
});
