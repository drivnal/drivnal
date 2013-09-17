define([
  'jquery',
  'underscore',
  'backbone',
  'views/backup/objectPath',
  'text!templates/backup/objectList.html'
], function($, _, Backbone, ObjectPathView, objectListTemplate) {
  'use strict';
  var ObjectPathListView = Backbone.View.extend({
    className: 'object-list-path',
    template: _.template(objectListTemplate),
    initialize: function() {
      this.views = [];
    },
    render: function() {
      this.$el.html();
      return this;
    },
    updatePath: function(snapshot, path) {
      var i;
      var paths;
      var objectPathView;

      if (path) {
        paths = [snapshot].concat(path.split('/'));
      }
      else {
        paths = [snapshot];
      }
      for (i = 0; i < this.views.length; i++) {
        this.views[i].destroy();
      }
      this.views = [];
      if (!snapshot) {
        return;
      }
      for (i = 0; i < paths.length; i++) {
        objectPathView = new ObjectPathView({
          path: paths[i],
          fullPath: paths.slice(1, i + 1),
          last: (i + 1 === paths.length)
        });
        this.addView(objectPathView);
        this.listenTo(objectPathView, 'changePath', this.onChangePath);
        this.views.push(objectPathView);
        this.$el.append(objectPathView.render().el);
      }

      this.updateOverflow();
    },
    updateOverflow: function() {
      var i;

      // Only check if there is no overflow
      if (this.el.offsetWidth >= this.el.scrollWidth) {
        // Go back trough views and show+decompress until there is overflow
        for (i = this.views.length - 1; i >= 0; i--) {
          // Once overflow is found undo change to prevent overflow
          this.views[i].show();
          if (this.el.offsetWidth < this.el.scrollWidth) {
            this.views[i].hide();
            break;
          }
          this.views[i].decompress();
          if (this.el.offsetWidth < this.el.scrollWidth) {
            this.views[i].compress();
            break;
          }
        }
      }

      // If no overflow skip
      if (this.el.offsetWidth >= this.el.scrollWidth) {
        return;
      }

      // Attempt to fix overflow by compressing views
      for (i = 0; i < this.views.length - 1; i++) {
        if (this.el.offsetWidth < this.el.scrollWidth) {
          this.views[i].compress();
        }
        else {
          break;
        }
      }

      // If no overflow skip
      if (this.el.offsetWidth >= this.el.scrollWidth) {
        return;
      }

      // Fix overflow by hiding views
      for (i = 0; i < this.views.length - 2; i++) {
        if (this.el.offsetWidth < this.el.scrollWidth) {
          this.views[i].hide();
        }
        else {
          break;
        }
      }
    },
    onResize: function() {
      var id = Math.random();
      this.updateId = id;

      // Prevent excessive calls by waiting until random id stays
      // the same for duration of timeout
      setTimeout(function() {
        // Check lock to prevent two updates at same time
        if (id === this.updateId) {
          this.updateOverflow();
        }
      }.bind(this), 50);
    },
    onChangePath: function(path) {
      this.trigger('changePath', path);
    }
  });

  return ObjectPathListView;
});
