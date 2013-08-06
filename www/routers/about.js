define([
  'jquery',
  'underscore',
  'backbone',
  'views/about/about'
], function($, _, Backbone, AboutView) {
  'use strict';
  var AboutRouter = Backbone.Router.extend({
    routes: {
      'about': 'about'
    },
    initialize: function(data) {
      this.data = data;
    },
    about: function() {
      $('header .links').removeClass('active');
      $('header .about-link').addClass('active');

      if (this.data.view) {
        this.data.view.remove();
      }
      this.data.view = new AboutView();
      $(this.data.element).fadeOut(400, function() {
        $(this.data.element).html(this.data.view.render().el);
        $(this.data.element).fadeIn(400);
      }.bind(this));
    }
  });

  return AboutRouter;
});
