/*jshint strict:false */
var wget = function(files) {
  var dir;
  var cmds = {};

  for (var file in files) {
    dir = file.split('/');
    dir = dir.slice(0, dir.length - 1).join('/');

    cmds[file] = {
      cmd: 'mkdir -p ' + dir + '; wget -O ' + file + ' ' + files[file]
    };
  }

  return cmds;
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        quotmark: 'single',
        regexp: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        browser: true,
        maxlen: 79,
        globals: {
          module: true,
          define: true,
          require: true
        }
      },
      all: [
        'collections/**/*.js',
        'demo/*.js',
        'init/*.js',
        'models/**/*.js',
        'routers/*.js',
        'views/**/*.js',
        '*.js',
      ]
    },

    clean: {
      dist: ['dist']
    },

    requirejs: {
      test: {
        options: {
          name: 'main',
          optimize: 'uglify2',
          out: 'dist/js/main.js',
          mainConfigFile: 'main.js',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          uglify2: {
            mangle: false
          },
          paths: {
            ace: 'vendor/ace/ace',
            aceModeAbap: 'vendor/ace/mode-abap',
            aceModeActionscript: 'vendor/ace/mode-actionscript',
            aceModeAda: 'vendor/ace/mode-ada',
            aceModeAsciidoc: 'vendor/ace/mode-asciidoc',
            aceModeAssemblyX86: 'vendor/ace/mode-assembly_x86',
            aceModeAutohotkey: 'vendor/ace/mode-autohotkey',
            aceModeBatchfile: 'vendor/ace/mode-batchfile',
            aceModeCcpp: 'vendor/ace/mode-c_cpp',
            aceModeClojure: 'vendor/ace/mode-clojure',
            aceModeCobol: 'vendor/ace/mode-cobol',
            aceModeCoffee: 'vendor/ace/mode-coffee',
            aceModeColdfusion: 'vendor/ace/mode-coldfusion',
            aceModeCsharp: 'vendor/ace/mode-csharp',
            aceModeCss: 'vendor/ace/mode-css',
            aceModeD: 'vendor/ace/mode-d',
            aceModeDart: 'vendor/ace/mode-dart',
            aceModeDiff: 'vendor/ace/mode-diff',
            aceModeDjango: 'vendor/ace/mode-django',
            aceModeDot: 'vendor/ace/mode-dot',
            aceModeErlang: 'vendor/ace/mode-erlang',
            aceModeForth: 'vendor/ace/mode-forth',
            aceModeFtl: 'vendor/ace/mode-ftl',
            aceModeGlsl: 'vendor/ace/mode-glsl',
            aceModeGolang: 'vendor/ace/mode-golang',
            aceModeGroovy: 'vendor/ace/mode-groovy',
            aceModeHaml: 'vendor/ace/mode-haml',
            aceModeHaskell: 'vendor/ace/mode-haskell',
            aceModeHaxe: 'vendor/ace/mode-haxe',
            aceModeHtml: 'vendor/ace/mode-html',
            aceModeHtmlRuby: 'vendor/ace/mode-html_ruby',
            aceModeIni: 'vendor/ace/mode-ini',
            aceModeJava: 'vendor/ace/mode-java',
            aceModeJavascript: 'vendor/ace/mode-javascript',
            aceModeJson: 'vendor/ace/mode-json',
            aceModeJsp: 'vendor/ace/mode-jsp',
            aceModeJsx: 'vendor/ace/mode-jsx',
            aceModeJulia: 'vendor/ace/mode-julia',
            aceModeLatex: 'vendor/ace/mode-latex',
            aceModeLess: 'vendor/ace/mode-less',
            aceModeLisp: 'vendor/ace/mode-lisp',
            aceModeLivescript: 'vendor/ace/mode-livescript',
            aceModeLsl: 'vendor/ace/mode-lsl',
            aceModeLua: 'vendor/ace/mode-lua',
            aceModeLuapage: 'vendor/ace/mode-luapage',
            aceModeLucene: 'vendor/ace/mode-lucene',
            aceModeMakefile: 'vendor/ace/mode-makefile',
            aceModeMarkdown: 'vendor/ace/mode-markdown',
            aceModeMatlab: 'vendor/ace/mode-matlab',
            aceModeMysql: 'vendor/ace/mode-mysql',
            aceModeObjectivec: 'vendor/ace/mode-objectivec',
            aceModeOcaml: 'vendor/ace/mode-ocaml',
            aceModePascal: 'vendor/ace/mode-pascal',
            aceModePerl: 'vendor/ace/mode-perl',
            aceModePhp: 'vendor/ace/mode-php',
            aceModePlainText: 'vendor/ace/mode-plain_text',
            aceModePowershell: 'vendor/ace/mode-powershell',
            aceModeProlog: 'vendor/ace/mode-prolog',
            aceModeProperties: 'vendor/ace/mode-properties',
            aceModePython: 'vendor/ace/mode-python',
            aceModeR: 'vendor/ace/mode-r',
            aceModeRhtml: 'vendor/ace/mode-rhtml',
            aceModeRuby: 'vendor/ace/mode-ruby',
            aceModeRust: 'vendor/ace/mode-rust',
            aceModeSass: 'vendor/ace/mode-sass',
            aceModeScala: 'vendor/ace/mode-scala',
            aceModeScheme: 'vendor/ace/mode-scheme',
            aceModeScss: 'vendor/ace/mode-scss',
            aceModeSh: 'vendor/ace/mode-sh',
            aceModeSql: 'vendor/ace/mode-sql',
            aceModeSvg: 'vendor/ace/mode-svg',
            aceModeTcl: 'vendor/ace/mode-tcl',
            aceModeTex: 'vendor/ace/mode-tex',
            aceModeText: 'vendor/ace/mode-text',
            aceModeToml: 'vendor/ace/mode-toml',
            aceModeTwig: 'vendor/ace/mode-twig',
            aceModeTypescript: 'vendor/ace/mode-typescript',
            aceModeVbscript: 'vendor/ace/mode-vbscript',
            aceModeVelocity: 'vendor/ace/mode-velocity',
            aceModeVerilog: 'vendor/ace/mode-verilog',
            aceModeXml: 'vendor/ace/mode-xml',
            aceModeXquery: 'vendor/ace/mode-xquery',
            aceModeYaml: 'vendor/ace/mode-yaml',
            aceThemeAmbiance: 'vendor/ace/theme-ambiance',
            aceThemeChrome: 'vendor/ace/theme-chrome',
            aceThemeGithub: 'vendor/ace/theme-github',
            aceThemeMonokai: 'vendor/ace/theme-monokai',
            aceThemeTwilight: 'vendor/ace/theme-twilight',
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/googleAnalytics/googleAnalytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jqueryUi/jqueryUi.min',
            less: 'vendor/less/less.min',
            text: 'vendor/requireText/text',
            underscore: 'vendor/underscore/underscore.min',
            initialize: 'init/production'
          }
        }
      },
      demo: {
        options: {
          name: 'main',
          optimize: 'uglify2',
          out: 'dist/js/main.js',
          mainConfigFile: 'main.js',
          generateSourceMaps: false,
          preserveLicenseComments: true,
          uglify2: {
            mangle: false
          },
          paths: {
            ace: 'vendor/ace/ace',
            aceModeAbap: 'vendor/ace/mode-abap',
            aceModeActionscript: 'vendor/ace/mode-actionscript',
            aceModeAda: 'vendor/ace/mode-ada',
            aceModeAsciidoc: 'vendor/ace/mode-asciidoc',
            aceModeAssemblyX86: 'vendor/ace/mode-assembly_x86',
            aceModeAutohotkey: 'vendor/ace/mode-autohotkey',
            aceModeBatchfile: 'vendor/ace/mode-batchfile',
            aceModeCcpp: 'vendor/ace/mode-c_cpp',
            aceModeClojure: 'vendor/ace/mode-clojure',
            aceModeCobol: 'vendor/ace/mode-cobol',
            aceModeCoffee: 'vendor/ace/mode-coffee',
            aceModeColdfusion: 'vendor/ace/mode-coldfusion',
            aceModeCsharp: 'vendor/ace/mode-csharp',
            aceModeCss: 'vendor/ace/mode-css',
            aceModeD: 'vendor/ace/mode-d',
            aceModeDart: 'vendor/ace/mode-dart',
            aceModeDiff: 'vendor/ace/mode-diff',
            aceModeDjango: 'vendor/ace/mode-django',
            aceModeDot: 'vendor/ace/mode-dot',
            aceModeErlang: 'vendor/ace/mode-erlang',
            aceModeForth: 'vendor/ace/mode-forth',
            aceModeFtl: 'vendor/ace/mode-ftl',
            aceModeGlsl: 'vendor/ace/mode-glsl',
            aceModeGolang: 'vendor/ace/mode-golang',
            aceModeGroovy: 'vendor/ace/mode-groovy',
            aceModeHaml: 'vendor/ace/mode-haml',
            aceModeHaskell: 'vendor/ace/mode-haskell',
            aceModeHaxe: 'vendor/ace/mode-haxe',
            aceModeHtml: 'vendor/ace/mode-html',
            aceModeHtmlRuby: 'vendor/ace/mode-html_ruby',
            aceModeIni: 'vendor/ace/mode-ini',
            aceModeJava: 'vendor/ace/mode-java',
            aceModeJavascript: 'vendor/ace/mode-javascript',
            aceModeJson: 'vendor/ace/mode-json',
            aceModeJsp: 'vendor/ace/mode-jsp',
            aceModeJsx: 'vendor/ace/mode-jsx',
            aceModeJulia: 'vendor/ace/mode-julia',
            aceModeLatex: 'vendor/ace/mode-latex',
            aceModeLess: 'vendor/ace/mode-less',
            aceModeLisp: 'vendor/ace/mode-lisp',
            aceModeLivescript: 'vendor/ace/mode-livescript',
            aceModeLsl: 'vendor/ace/mode-lsl',
            aceModeLua: 'vendor/ace/mode-lua',
            aceModeLuapage: 'vendor/ace/mode-luapage',
            aceModeLucene: 'vendor/ace/mode-lucene',
            aceModeMakefile: 'vendor/ace/mode-makefile',
            aceModeMarkdown: 'vendor/ace/mode-markdown',
            aceModeMatlab: 'vendor/ace/mode-matlab',
            aceModeMysql: 'vendor/ace/mode-mysql',
            aceModeObjectivec: 'vendor/ace/mode-objectivec',
            aceModeOcaml: 'vendor/ace/mode-ocaml',
            aceModePascal: 'vendor/ace/mode-pascal',
            aceModePerl: 'vendor/ace/mode-perl',
            aceModePhp: 'vendor/ace/mode-php',
            aceModePlainText: 'vendor/ace/mode-plain_text',
            aceModePowershell: 'vendor/ace/mode-powershell',
            aceModeProlog: 'vendor/ace/mode-prolog',
            aceModeProperties: 'vendor/ace/mode-properties',
            aceModePython: 'vendor/ace/mode-python',
            aceModeR: 'vendor/ace/mode-r',
            aceModeRhtml: 'vendor/ace/mode-rhtml',
            aceModeRuby: 'vendor/ace/mode-ruby',
            aceModeRust: 'vendor/ace/mode-rust',
            aceModeSass: 'vendor/ace/mode-sass',
            aceModeScala: 'vendor/ace/mode-scala',
            aceModeScheme: 'vendor/ace/mode-scheme',
            aceModeScss: 'vendor/ace/mode-scss',
            aceModeSh: 'vendor/ace/mode-sh',
            aceModeSql: 'vendor/ace/mode-sql',
            aceModeSvg: 'vendor/ace/mode-svg',
            aceModeTcl: 'vendor/ace/mode-tcl',
            aceModeTex: 'vendor/ace/mode-tex',
            aceModeText: 'vendor/ace/mode-text',
            aceModeToml: 'vendor/ace/mode-toml',
            aceModeTwig: 'vendor/ace/mode-twig',
            aceModeTypescript: 'vendor/ace/mode-typescript',
            aceModeVbscript: 'vendor/ace/mode-vbscript',
            aceModeVelocity: 'vendor/ace/mode-velocity',
            aceModeVerilog: 'vendor/ace/mode-verilog',
            aceModeXml: 'vendor/ace/mode-xml',
            aceModeXquery: 'vendor/ace/mode-xquery',
            aceModeYaml: 'vendor/ace/mode-yaml',
            aceThemeAmbiance: 'vendor/ace/theme-ambiance',
            aceThemeChrome: 'vendor/ace/theme-chrome',
            aceThemeGithub: 'vendor/ace/theme-github',
            aceThemeMonokai: 'vendor/ace/theme-monokai',
            aceThemeTwilight: 'vendor/ace/theme-twilight',
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/googleAnalytics/googleAnalytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jqueryUi/jqueryUi.min',
            less: 'vendor/less/less.min',
            text: 'vendor/requireText/text',
            underscore: 'vendor/underscore/underscore.min',
            initialize: 'init/demo'
          }
        }
      },
      production: {
        options: {
          name: 'main',
          optimize: 'uglify2',
          out: 'dist/js/main.js',
          mainConfigFile: 'main.js',
          generateSourceMaps: false,
          preserveLicenseComments: true,
          uglify2: {
            mangle: false
          },
          paths: {
            ace: 'vendor/ace/ace',
            aceModeAbap: 'vendor/ace/mode-abap',
            aceModeActionscript: 'vendor/ace/mode-actionscript',
            aceModeAda: 'vendor/ace/mode-ada',
            aceModeAsciidoc: 'vendor/ace/mode-asciidoc',
            aceModeAssemblyX86: 'vendor/ace/mode-assembly_x86',
            aceModeAutohotkey: 'vendor/ace/mode-autohotkey',
            aceModeBatchfile: 'vendor/ace/mode-batchfile',
            aceModeCcpp: 'vendor/ace/mode-c_cpp',
            aceModeClojure: 'vendor/ace/mode-clojure',
            aceModeCobol: 'vendor/ace/mode-cobol',
            aceModeCoffee: 'vendor/ace/mode-coffee',
            aceModeColdfusion: 'vendor/ace/mode-coldfusion',
            aceModeCsharp: 'vendor/ace/mode-csharp',
            aceModeCss: 'vendor/ace/mode-css',
            aceModeD: 'vendor/ace/mode-d',
            aceModeDart: 'vendor/ace/mode-dart',
            aceModeDiff: 'vendor/ace/mode-diff',
            aceModeDjango: 'vendor/ace/mode-django',
            aceModeDot: 'vendor/ace/mode-dot',
            aceModeErlang: 'vendor/ace/mode-erlang',
            aceModeForth: 'vendor/ace/mode-forth',
            aceModeFtl: 'vendor/ace/mode-ftl',
            aceModeGlsl: 'vendor/ace/mode-glsl',
            aceModeGolang: 'vendor/ace/mode-golang',
            aceModeGroovy: 'vendor/ace/mode-groovy',
            aceModeHaml: 'vendor/ace/mode-haml',
            aceModeHaskell: 'vendor/ace/mode-haskell',
            aceModeHaxe: 'vendor/ace/mode-haxe',
            aceModeHtml: 'vendor/ace/mode-html',
            aceModeHtmlRuby: 'vendor/ace/mode-html_ruby',
            aceModeIni: 'vendor/ace/mode-ini',
            aceModeJava: 'vendor/ace/mode-java',
            aceModeJavascript: 'vendor/ace/mode-javascript',
            aceModeJson: 'vendor/ace/mode-json',
            aceModeJsp: 'vendor/ace/mode-jsp',
            aceModeJsx: 'vendor/ace/mode-jsx',
            aceModeJulia: 'vendor/ace/mode-julia',
            aceModeLatex: 'vendor/ace/mode-latex',
            aceModeLess: 'vendor/ace/mode-less',
            aceModeLisp: 'vendor/ace/mode-lisp',
            aceModeLivescript: 'vendor/ace/mode-livescript',
            aceModeLsl: 'vendor/ace/mode-lsl',
            aceModeLua: 'vendor/ace/mode-lua',
            aceModeLuapage: 'vendor/ace/mode-luapage',
            aceModeLucene: 'vendor/ace/mode-lucene',
            aceModeMakefile: 'vendor/ace/mode-makefile',
            aceModeMarkdown: 'vendor/ace/mode-markdown',
            aceModeMatlab: 'vendor/ace/mode-matlab',
            aceModeMysql: 'vendor/ace/mode-mysql',
            aceModeObjectivec: 'vendor/ace/mode-objectivec',
            aceModeOcaml: 'vendor/ace/mode-ocaml',
            aceModePascal: 'vendor/ace/mode-pascal',
            aceModePerl: 'vendor/ace/mode-perl',
            aceModePhp: 'vendor/ace/mode-php',
            aceModePlainText: 'vendor/ace/mode-plain_text',
            aceModePowershell: 'vendor/ace/mode-powershell',
            aceModeProlog: 'vendor/ace/mode-prolog',
            aceModeProperties: 'vendor/ace/mode-properties',
            aceModePython: 'vendor/ace/mode-python',
            aceModeR: 'vendor/ace/mode-r',
            aceModeRhtml: 'vendor/ace/mode-rhtml',
            aceModeRuby: 'vendor/ace/mode-ruby',
            aceModeRust: 'vendor/ace/mode-rust',
            aceModeSass: 'vendor/ace/mode-sass',
            aceModeScala: 'vendor/ace/mode-scala',
            aceModeScheme: 'vendor/ace/mode-scheme',
            aceModeScss: 'vendor/ace/mode-scss',
            aceModeSh: 'vendor/ace/mode-sh',
            aceModeSql: 'vendor/ace/mode-sql',
            aceModeSvg: 'vendor/ace/mode-svg',
            aceModeTcl: 'vendor/ace/mode-tcl',
            aceModeTex: 'vendor/ace/mode-tex',
            aceModeText: 'vendor/ace/mode-text',
            aceModeToml: 'vendor/ace/mode-toml',
            aceModeTwig: 'vendor/ace/mode-twig',
            aceModeTypescript: 'vendor/ace/mode-typescript',
            aceModeVbscript: 'vendor/ace/mode-vbscript',
            aceModeVelocity: 'vendor/ace/mode-velocity',
            aceModeVerilog: 'vendor/ace/mode-verilog',
            aceModeXml: 'vendor/ace/mode-xml',
            aceModeXquery: 'vendor/ace/mode-xquery',
            aceModeYaml: 'vendor/ace/mode-yaml',
            aceThemeAmbiance: 'vendor/ace/theme-ambiance',
            aceThemeChrome: 'vendor/ace/theme-chrome',
            aceThemeGithub: 'vendor/ace/theme-github',
            aceThemeMonokai: 'vendor/ace/theme-monokai',
            aceThemeTwilight: 'vendor/ace/theme-twilight',
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/googleAnalytics/googleAnalytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jqueryUi/jqueryUi.min',
            less: 'vendor/less/less.min',
            text: 'vendor/requireText/text',
            underscore: 'vendor/underscore/underscore.min',
            initialize: 'init/production'
          }
        }
      }
    },

    less: {
      compile: {
        options: {
          paths: ['styles']
        },
        files: {
          'dist/css/main.css': 'styles/main.less'
        }
      }
    },

    copy: {
      dist: {
        files: {
          'dist/js/require.min.js': 'vendor/require/require.min.js',
          'dist/js/worker-coffee.js': 'vendor/ace/worker-coffee.js',
          'dist/js/worker-css.js': 'vendor/ace/worker-css.js',
          'dist/js/worker-javascript.js': 'vendor/ace/worker-javascript.js',
          'dist/js/worker-json.js': 'vendor/ace/worker-json.js',
          'dist/js/worker-lua.js': 'vendor/ace/worker-lua.js',
          'dist/js/worker-php.js': 'vendor/ace/worker-php.js',
          'dist/js/worker-xquery.js': 'vendor/ace/worker-xquery.js',
          'dist/favicon.ico': 'img/favicon.ico',
          'dist/robots.txt': 'root/robots.txt',
          'dist/index.html': 'root/index.html'
        }
      }
    },

    exec: wget({
      'vendor/backbone/backbone.js':
        'https://raw.github.com/amdjs/backbone/master/backbone.js',
      'vendor/backbone/backbone.min.js':
        'https://raw.github.com/amdjs/backbone/master/backbone-min.js',

      'vendor/bootstrap/bootstrap.js':
        'https://raw.github.com/twbs/bootstrap/master/' +
          'docs/assets/js/bootstrap.js',
      'vendor/bootstrap/bootstrap.min.js':
        'https://raw.github.com/twbs/bootstrap/master/' +
          'docs/assets/js/bootstrap.min.js',

      'vendor/d3/d3.js':
        'https://raw.github.com/mbostock/d3/master/d3.js',
      'vendor/d3/d3.min.js':
        'https://raw.github.com/mbostock/d3/master/d3.min.js',

      'vendor/googleAnalytics/googleAnalytics.min.js':
        'https://www.google-analytics.com/ga.js',

      'vendor/jquery/jquery.js':
        'http://code.jquery.com/jquery.js',
      'vendor/jquery/jquery.min.js':
        'http://code.jquery.com/jquery.min.js',

      // TODO
      // http://jqueryui.com/download/
      // #!components=1111111110000000100011111111111111
      // 'vendor/jquery-ui/jquery-ui.js':
      //   'http://code.jquery.com/ui/1.10.3/jquery-ui.js',
      // 'vendor/jquery-ui/jquery-ui.min.js':
      //   'http://code.jquery.com/ui/1.10.3/jquery-ui.min.js',

      'vendor/less/less.js':
        'https://raw.github.com/cloudhead/less.js/master/dist/less-1.4.2.js',
      'vendor/less/less.min.js':
        'https://raw.github.com/cloudhead/less.js/' +
          'master/dist/less-1.4.2.min.js',

      'vendor/require/require.js':
        'https://raw.github.com/jrburke/requirejs/master/require.js',
      'vendor/require/require.min.js':
        'http://requirejs.org/docs/release/2.1.8/minified/require.js',

      'vendor/requireText/text.js':
        'https://raw.github.com/requirejs/text/master/text.js',

      'vendor/underscore/underscore.js':
        'https://raw.github.com/amdjs/underscore/master/underscore.js',
      'vendor/underscore/underscore.min.js':
        'https://raw.github.com/amdjs/underscore/master/underscore-min.js',

      'styles/bootstrap.less':
        'https://raw.github.com/twbs/bootstrap/master/' +
          'docs/assets/css/bootstrap.css',

      'img/glyphicons-halflings-white.png':
        'https://raw.github.com/twbs/bootstrap/master/docs/assets' +
          '/img/glyphicons-halflings-white.png',
      'img/glyphicons-halflings.png':
        'https://raw.github.com/twbs/bootstrap/master/docs/assets' +
          '/img/glyphicons-halflings.png'
    })
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['jshint', 'clean', 'requirejs:production',
    'less', 'copy']);

  grunt.registerTask('test', ['jshint', 'clean', 'requirejs:test', 'less',
    'copy']);

  grunt.registerTask('demo', ['jshint', 'clean', 'requirejs:demo', 'less',
    'copy']);

  grunt.registerTask('lint', ['jshint']);

  grunt.registerTask('update', ['exec']);
};
