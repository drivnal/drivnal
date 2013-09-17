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
  'aceModeXquery',
  'aceModeYaml',
  'aceThemeAmbiance',
  'aceThemeChrome',
  'aceThemeGithub',
  'aceThemeMonokai',
  'aceThemeTwilight',
  'text!templates/backup/text.html'
], function($, _, Backbone, Ace, AceModeAbap, AceModeActionscript, AceModeAda,
    AceModeAsciidoc, AceModeAssemblyX86, AceModeAutohotkey, AceModeBatchfile,
    AceModeCcpp, AceModeClojure, AceModeCobol, AceModeCoffee,
    AceModeColdfusion, AceModeCsharp, AceModeCss, AceModeD, AceModeDart,
    AceModeDiff, AceModeDjango, AceModeDot, AceModeErlang, AceModeForth,
    AceModeFtl, AceModeGlsl, AceModeGolang, AceModeGroovy, AceModeHaml,
    AceModeHaskell, AceModeHaxe, AceModeHtml, AceModeHtmlRuby, AceModeIni,
    AceModeJava, AceModeJavascript, AceModeJson, AceModeJsp, AceModeJsx,
    AceModeJulia, AceModeLatex, AceModeLess, AceModeLisp, AceModeLivescript,
    AceModeLsl, AceModeLua, AceModeLuapage, AceModeLucene, AceModeMakefile,
    AceModeMarkdown, AceModeMatlab, AceModeMysql, AceModeObjectivec,
    AceModeOcaml, AceModePascal, AceModePerl, AceModePhp, AceModePlainText,
    AceModePowershell, AceModeProlog, AceModeProperties, AceModePython,
    AceModeR, AceModeRhtml, AceModeRuby, AceModeRust, AceModeSass,
    AceModeScala, AceModeScheme, AceModeScss, AceModeSh, AceModeSql,
    AceModeSvg, AceModeTcl, AceModeTex, AceModeText, AceModeToml, AceModeTwig,
    AceModeTypescript, AceModeVbscript, AceModeVelocity, AceModeVerilog,
    AceModeXml, aceModeXquery, AceModeYaml, AceThemeAmbiance, AceThemeChrome,
    AceThemeGithub, AceThemeMonokai, AceThemeTwilight, textTemplate) {
  'use strict';
  var theme = 'ace/theme/chrome';

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
        title: 'Change theme'
      });

      if (this.$('.editor').length) {
        this.editor = Ace.edit(this.$('.editor')[0]);
        this.editor.setTheme(theme);
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
        theme = 'ace/theme/twilight';
        this.editor.setTheme(theme);
      }
      else {
        theme = 'ace/theme/chrome';
        this.editor.setTheme(theme);
      }
    },
    onClickClose: function() {
      this.$('.close-viewer').roll(400);
      this.$el.fadeOut(400, function() {
        this.destroy();
      }.bind(this));
    }
  });

  return TextView;
});
