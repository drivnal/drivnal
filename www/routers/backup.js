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
      $('header .nav li').removeClass('active');
      $('header .backups').addClass('active');

      var curView = this.data.view;
      this.data.view = new BackupsView();
      $(this.data.element).fadeOut(400, function() {
        if (curView) {
          curView = curView.destroy();
        }
        $(this.data.element).html(this.data.view.render().el);
        $(this.data.element).fadeIn(400);
      }.bind(this));
    }
  });

  return BackupRouter;
});
