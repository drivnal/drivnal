define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/backups'
], function($, _, Backbone, BackupsView) {
  'use strict';
  var BackupRouter = Backbone.Router.extend({
    routes: {
      '': 'backups'
    },
    initialize: function(data) {
      this.data = data;
    },
    backups: function() {
      $('header .links').removeClass('active');
      $('header .backups-link').addClass('active');

      if (this.data.view) {
        this.data.view.remove();
      }
      this.data.view = new BackupsView();
      $(this.data.element).fadeOut(400, function() {
        $(this.data.element).html(this.data.view.render().el);
        $(this.data.element).fadeIn(400);
      }.bind(this));
    }
  });

  return BackupRouter;
});
