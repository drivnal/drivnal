define([
  'jquery',
  'underscore',
  'backbone',
  'ace',
  'aceModeAbap',
  'aceModeActionscript',
  'aceModeAda',
  'aceModeAsciidoc',
  'aceModeAssemblyX86',
  'aceModeAutohotkey',
  'aceModeBatchfile',
  'aceModeCcpp',
  'aceModeClojure',
  'aceModeCobol',
  'aceModeCoffee',
  'aceModeColdfusion',
  'aceModeCsharp',
  'aceModeCss',
  'aceModeD',
  'aceModeDart',
  'aceModeDiff',
  'aceModeDjango',
  'aceModeDot',
  'aceModeErlang',
  'aceModeForth',
  'aceModeFtl',
  'aceModeGlsl',
  'aceModeGolang',
  'aceModeGroovy',
  'aceModeHaml',
  'aceModeHaskell',
  'aceModeHaxe',
  'aceModeHtml',
  'aceModeHtmlRuby',
  'aceModeIni',
  'aceModeJava',
  'aceModeJavascript',
  'aceModeJson',
  'aceModeJsp',
  'aceModeJsx',
  'aceModeJulia',
  'aceModeLatex',
  'aceModeLess',
  'aceModeLisp',
  'aceModeLivescript',
  'aceModeLsl',
  'aceModeLua',
  'aceModeLuapage',
  'aceModeLucene',
  'aceModeMakefile',
  'aceModeMarkdown',
  'aceModeMatlab',
  'aceModeMysql',
  'aceModeObjectivec',
  'aceModeOcaml',
  'aceModePascal',
  'aceModePerl',
  'aceModePhp',
  'aceModePlainText',
  'aceModePowershell',
  'aceModeProlog',
  'aceModeProperties',
  'aceModePython',
  'aceModeR',
  'aceModeRhtml',
  'aceModeRuby',
  'aceModeRust',
  'aceModeSass',
  'aceModeScala',
  'aceModeScheme',
  'aceModeScss',
  'aceModeSh',
  'aceModeSql',
  'aceModeSvg',
  'aceModeTcl',
  'aceModeTex',
  'aceModeText',
  'aceModeToml',
  'aceModeTwig',
  'aceModeTypescript',
  'aceModeVbscript',
  'aceModeVelocity',
  'aceModeVerilog',
  'aceModeXml',
  'aceModeYaml',
  'aceThemeAmbiance',
  'aceThemeChrome',
  'aceThemeGithub',
  'aceThemeMonokai',
  'aceThemeTwilight',
  'text!templates/backup/text.html'
], function($, _, Backbone, ace, aceModeAbap, aceModeActionscript, aceModeAda,
    aceModeAsciidoc, aceModeAssemblyX86, aceModeAutohotkey, aceModeBatchfile,
    aceModeCcpp, aceModeClojure, aceModeCobol, aceModeCoffee,
    aceModeColdfusion, aceModeCsharp, aceModeCss, aceModeD, aceModeDart,
    aceModeDiff, aceModeDjango, aceModeDot, aceModeErlang, aceModeForth,
    aceModeFtl, aceModeGlsl, aceModeGolang, aceModeGroovy, aceModeHaml,
    aceModeHaskell, aceModeHaxe, aceModeHtml, aceModeHtmlRuby, aceModeIni,
    aceModeJava, aceModeJavascript, aceModeJson, aceModeJsp, aceModeJsx,
    aceModeJulia, aceModeLatex, aceModeLess, aceModeLisp, aceModeLivescript,
    aceModeLsl, aceModeLua, aceModeLuapage, aceModeLucene, aceModeMakefile,
    aceModeMarkdown, aceModeMatlab, aceModeMysql, aceModeObjectivec,
    aceModeOcaml, aceModePascal, aceModePerl, aceModePhp, aceModePlainText,
    aceModePowershell, aceModeProlog, aceModeProperties, aceModePython,
    aceModeR, aceModeRhtml, aceModeRuby, aceModeRust, aceModeSass,
    aceModeScala, aceModeScheme, aceModeScss, aceModeSh, aceModeSql,
    aceModeSvg, aceModeTcl, aceModeTex, aceModeText, aceModeToml, aceModeTwig,
    aceModeTypescript, aceModeVbscript, aceModeVelocity, aceModeVerilog,
    aceModeXml, aceModeYaml, aceThemeAmbiance, aceThemeChrome, aceThemeGithub,
    aceThemeMonokai, aceThemeTwilight, textTemplate) {
  'use strict';
  var TextView = Backbone.View.extend({
    className: 'text-viewer-box',
    type: null,
    events: {
      'mouseover .change-theme, .close-viewer': 'addIconWhite',
      'mouseout .change-theme, .close-viewer': 'removeIconWhite',
      'click .change-theme': 'onChangeTheme',
      'click .close-viewer': 'onClickClose'
    },
    template: _.template(textTemplate),
    render: function() {
      if (this.type) {
        this.$el.addClass(this.type);
      }
      this.$el.html(this.template(this.model.toJSON()));

      this.$('.change-theme').tooltip({
        title: 'Toggle theme'
      });

      if (this.$('.editor').length) {
        this.editor = ace.edit(this.$('.editor')[0]);
        this.editor.setTheme('ace/theme/chrome');
        this.editor.setReadOnly(true);
        this.editor.getSession().setMode(
          'ace/mode/' + this.model.get('syntax'));
      }

      this.$el.fadeIn(400);
      return this;
    },
    addIconWhite: function(evt) {
      this.$(evt.target).addClass('icon-white');
    },
    removeIconWhite: function(evt) {
      this.$(evt.target).removeClass('icon-white');
    },
    onChangeTheme: function() {
      if (!this.editor) {
        return;
      }
      if (this.editor.getTheme() === 'ace/theme/chrome') {
        this.editor.setTheme('ace/theme/twilight');
      }
      else {
        this.editor.setTheme('ace/theme/chrome');
      }
    },
    onClickClose: function() {
      this.$('.close-viewer').roll(400);
      this.$el.fadeOut(400, function() {
        this.remove();
      }.bind(this));
    }
  });

  return TextView;
});
