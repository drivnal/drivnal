define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/backup/volumePath',
  'views/backup/volumeSetting',
  'collections/backup/path',
  'text!templates/backup/volumePathSelect.html'
], function($, _, Backbone, Bootstrap, VolumePathView, VolumeSettingView,
    PathCollection, volumePathSelectTemplate) {
  'use strict';
  var VolumePathSelectView = VolumeSettingView.extend({
    template: _.template(volumePathSelectTemplate),
    events: {
      'click .open-path-select': 'onClickPathSelect',
      'click .path-remove': 'triggerRemove',
      'mouseover .right-icon, .right-icon-two': 'addIconWhite',
      'mouseout .right-icon, .right-icon-two': 'removeIconWhite'
    },
    postInitialize: function(options) {
      this.basePath = options.basePath;
      this.removable = options.removable;
      this.last = options.last;

      this.collection = new PathCollection();
      this.listenTo(this.collection, 'reset', this.onReset);
      this.views = [];
      this.showError = false;
    },
    render: function() {
      this.$el.html(this.template({
        name: this.name,
        title: this.title,
        value: this.value,
        icon: this.icon,
        removable: this.removable
      }));

      this.$('input').tooltip();
      this.$('i').tooltip();

      if (this.getValue()) {
        this.changePath();
      }

      return this;
    },
    updateSize: function() {
      this.trigger('updateSize');
    },
    getFullValue: function() {
      var path = '';
      if (this.basePath) {
        if (this.basePath !== '/') {
          path = this.basePath;
        }
      }
      path += this.$('input').val();
      return path;
    },
    setValue: function(value) {
      this.setErrorMessage();
      if (this.basePath && this.basePath !== '/') {
        value = value.replace(this.basePath, '');
      }
      if (this.basePath && value === '/') {
        value = '';
      }
      if (this.$('input').val() !== value) {
        this.trigger('change', value);
      }
      this.$('input').val(value);
    },
    triggerRemove: function() {
      this.$el.slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          this.trigger('remove');
          this.remove();
        }.bind(this)
      });
    },
    onReset: function(collection) {
      var i;
      var model;
      var volumePathView;

      for (i = 0; i < this.views.length; i++) {
        this.views[i].remove();
      }
      this.views = [];
      for (i = 0; i < collection.models.length; i++) {
        model = collection.models[i];
        if (this.basePath && model.get(
            'path').indexOf(this.basePath) === -1) {
          continue;
        }
        volumePathView = new VolumePathView({model: collection.models[i]});
        this.views.push(volumePathView);
        this.listenTo(volumePathView, 'changePath', this.changePath);
        this.$('.path-list').append(volumePathView.render().el);
      }
    },
    addIconWhite: function(evt) {
      this.$(evt.target).addClass('icon-white');
    },
    removeIconWhite: function(evt) {
      this.$(evt.target).removeClass('icon-white');
    },
    onInputChange: function() {
      if (this.last) {
        this.trigger('newView');
        this.last = false;
        this.$('.path-remove').show();
      }
      else if (!this.isPathSelect() &&
          this.removable && this.$('input').val() === '') {
        this.triggerRemove();
      }
      this.changePath();
    },
    showPathSelect: function(complete) {
      if (this.isPathSelect()) {
        return;
      }
      this.$('.path-remove').show();
      this.$('.setting').addClass('open');

      this.$('.path-select').slideDown({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    hidePathSelect: function(complete) {
      if (!this.isPathSelect()) {
        return;
      }
      this.$('.path-remove').hide();
      this.$('.setting').removeClass('open');

      this.$('.path-select').slideUp({
        duration: 250,
        step: (this.updateSize).bind(this),
        complete: function() {
          this.updateSize();
          if (complete) {
            complete();
          }
        }.bind(this)
      });
    },
    isPathSelect: function() {
      return this.$('.setting').hasClass('open');
    },
    onClickPathSelect: function() {
      if (this.isPathSelect()) {
        if (!this.last && this.removable && this.$('input').val() === '') {
          this.triggerRemove();
          return;
        }

        this.hidePathSelect();
      }
      else {
        this.changePath();
        this.showPathSelect();
      }
    },
    changePath: function(path) {
      if (path === undefined) {
        path = this.getFullValue();
      }
      if (this.basePath && path === null) {
        path = this.basePath;
      }

      if (path !== '' && this.collection.getPath() === path) {
        return;
      }

      var loading = true;
      setTimeout(function() {
        if (loading) {
          this.$('.setting .loading').show();
        }
      }.bind(this), 500);

      this.collection.setPath(path);
      this.collection.fetch({
        reset: true,
        success: function() {
          loading = false;
          this.$('.setting .loading').hide();
          if (this.showError) {
            this.showError = false;
          }
          else {
            if (this.getFullValue() === path) {
              if (path === '') {
                path = '/';
              }
              this.setValue(path);
            }
            else {
              this.setValue(path);
              this.$('input').change();
            }
          }
        }.bind(this),
        error: function(model, response) {
          loading = false;
          this.$('.setting .loading').hide();
          if (response.status === 404) {
            this.showError = true;
            this.setErrorMessage('Invalid Path');
            if (path !== this.basePath && path !== null) {
              this.changePath(null);
            }
          }
          else {
            this.setErrorMessage('Server Error');
          }
        }.bind(this)
      });
    }
  });

  return VolumePathSelectView;
});
