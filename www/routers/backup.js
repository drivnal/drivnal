define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/backups'
], function($, _, Backbone, BackupsView) {
  'use strict';
  var BackupRouter = Backbone.Router.extend({
    routes: {
      '': 'backups',
      '_no_events': 'backupsNoEvents'
    },
    initialize: function(data) {
      this.data = data;
    },
    backups: function() {
      $('header .nav li').removeClass('active');
      $('header .backups').addClass('active');

      if (this.data.view) {
        this.data.view.remove();
      }
      this.data.view = new BackupsView();
      $(this.data.element).fadeOut(400, function() {
        $(this.data.element).html(this.data.view.render().el);
        $(this.data.element).fadeIn(400);
      }.bind(this));
    },
    backupsNoEvents: function() {
      this.backups();
      this.data.view.disableEvents();
    }
  });

  return BackupRouter;
});
