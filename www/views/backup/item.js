define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/backup/item.html'
], function($, _, Backbone, itemTemplate) {
  'use strict';
  var ItemView = Backbone.View.extend({
    tagName: 'li',
    iconTooltip: 'Click again to cancel',
    events: {
      'mouseover': 'onMouseOver',
      'mouseout': 'onMouseOut',
      'mouseover .view-log, .toggle-info, .icon': 'addIconWhite',
      'mouseout .view-log, .toggle-info, .icon': 'removeIconWhite',
      'click .item': 'onClick'
    },
    template: _.template(itemTemplate),
    initialize: function() {
      this.selected = false;
      this.removing = false;
      this.infoOpen = false;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // This is used when data is modified to keep the state of info
      if (this.infoOpen) {
        this.openInfo(true);
      }

      return this;
    },
    getIconType: function() {
      return 'remove';
    },
    getIconClass: function() {
      if (this.getIconType() === 'cancel') {
        return 'icon-stop';
      }
      return 'icon-remove';
    },
    setSelect: function(state) {
      if (state && !this.selected) {
        this.$('.item-box').addClass('selected');
        this.selected = true;
      }
      else if (this.selected) {
        this.$('.item-box').removeClass('selected');
        this.selected = false;
      }
    },
    getSelect: function() {
      return this.selected;
    },
    setRemove: function(state) {
      if (state && !this.removing) {
        this.$('.remove').removeClass('icon-remove');
        this.$('.remove').addClass('icon-plus');
        this.$('.remove').show();
        this.$('.item-box').addClass('item-removing');
        this.removing = true;
      }
      else if (!state && this.removing) {
        this.$('.remove').removeClass('icon-plus');
        this.$('.remove').addClass('icon-remove');
        this.$('.remove').hide();
        this.$('.item-box').removeClass('item-removing');
        this.removing = false;
      }
    },
    getRemove: function() {
      return this.removing;
    },
    onMouseOver: function() {
      if (this.model.get('has_log')) {
        this.$('.view-log').show();
      }
      this.$('.toggle-info').show();
      this.$('.' + this.getIconClass()).show();
    },
    onMouseOut: function() {
      this.$('.view-log').hide();
      this.$('.toggle-info').hide();
      this.$('.icon-stop').hide();
      this.$('.icon-remove').hide();
    },
    addIconWhite: function(evt) {
      this.$(evt.target).addClass('icon-white');
    },
    removeIconWhite: function(evt) {
      this.$(evt.target).removeClass('icon-white');
    },
    onClick: function(evt) {
      if ($(evt.target).hasClass('view-log')) {
        this.trigger('viewLog', this.model.get('id'));
      }
      else if ($(evt.target).hasClass('toggle-info')) {
        this.toggleInfo();
      }
      else if ($(evt.target).hasClass('icon')) {
        if (this.getIconType() === 'remove') {
          this.$('.icon-remove').roll(400);
          var key = null;
          if (evt.shiftKey) {
            key = 'shift';
          }
          this.trigger('remove', this, key);
        }
        else if (this.getIconType() === 'cancel') {
          if (this.$('.tooltip').length) {
            this.$('.' + this.getIconClass()).tooltip('destroy');
            this.onCancel();
          }
          else {
            this.$('.' + this.getIconClass()).tooltip({
              title: this.iconTooltip
            });
            this.$('.' + this.getIconClass()).tooltip('show');
            this.$('.' + this.getIconClass()).one('mouseout', function() {
              $(this).tooltip('destroy');
            });
          }
        }
      }
      else {
        this.trigger('select', this);
      }
    },
    onCancel: function() {
    },
    openInfo: function(noAnimate) {
      this.infoOpen = true;
      this.$('.toggle-info').removeClass('icon-chevron-down');
      this.$('.toggle-info').addClass('icon-chevron-up');
      if (!noAnimate) {
        this.$('.info').slideDown(250);
      }
      else {
        this.$('.info').show();
      }
    },
    closeInfo: function(noAnimate) {
      this.infoOpen = false;
      this.$('.toggle-info').removeClass('icon-chevron-up');
      this.$('.toggle-info').addClass('icon-chevron-down');
      if (!noAnimate) {
        this.$('.info').slideUp(250);
      }
      else {
        this.$('.info').hide();
      }
    },
    toggleInfo: function() {
      if (this.$('.info').is(':visible')) {
        this.closeInfo();
      }
      else {
        this.openInfo();
      }
    }
  });

  return ItemView;
});
