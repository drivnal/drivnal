define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/backup/object.html'
], function($, _, Backbone, objectTemplate) {
  'use strict';
  var ObjectView = Backbone.View.extend({
    tagName: 'tr',
    className: 'object-row',
    template: _.template(objectTemplate),
    events: {
      'click .select-col': 'onClickCheckbox',
      'mousedown': 'onMouseDown'
    },
    initialize: function() {
      this.selected = null;
      this.dragging = false;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    getSelect: function() {
      return this.selected;
    },
    setSelect: function(state) {
      if (state === 'full') {
        if (this.getSelect() === 'half') {
          this.$('.select').addClass('selected');
        }
        else if (this.getSelect() === null) {
          this.$el.addClass('selected');
          this.$('.select').addClass('selected');
        }
        this.selected = 'full';
      }
      else if (state === 'half') {
        if (this.getSelect() === 'full') {
          this.$('.select').removeClass('selected');
        }
        else if (this.getSelect() === null) {
          this.$el.addClass('selected');
        }
        this.selected = 'half';
      }
      else {
        this.$el.removeClass('selected');
        this.$('.select').removeClass('selected');
        this.selected = null;
      }
    },
    onClick: function(evt) {
      if ($(evt.target).parent().hasClass('dir-name')) {
        this.trigger('open', this);
      }
      else if ($(evt.target).parent().hasClass('text-name')) {
        this.trigger('view', this);
      }
      else {
        var key = null;
        if (evt.shiftKey) {
          key = 'shift';
        }
        else if (evt.ctrlKey) {
          key = 'ctrl';
        }
        this.trigger('select', this, key);
      }
    },
    onClickCheckbox: function() {
      this.trigger('select', this, 'ctrl');
    },
    onMouseDown: function(evt) {
      if (evt.button !== 0) {
        return;
      }

      if ($(evt.target).hasClass('select-col') ||
          $(evt.target).parents().hasClass('select-col')) {
        return false;
      }

      var mouseStartX = evt.clientX + window.scrollX;
      var mouseStartY = evt.clientY + window.scrollY;

      $(document).bind('mousemove.object', function(evt) {
        var mouseX = evt.clientX + window.scrollX;
        var mouseY = evt.clientY + window.scrollY;

        if (mouseX < mouseStartX + 5 && mouseX > mouseStartX - 5 &&
            mouseY < mouseStartY + 5 && mouseY > mouseStartY - 5) {
          return;
        }

        this.dragging = true;
        $(document).unbind('mousemove.object');
        this.trigger('drag', this);
      }.bind(this));

      $(document).one('mouseup.object', function(evt) {
        if (this.dragging) {
          this.dragging = false;
        }
        else {
          $(document).unbind('mousemove.object');
          this.onClick(evt);
        }
      }.bind(this));
    }
  });

  return ObjectView;
});
