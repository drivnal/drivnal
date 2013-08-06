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
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/google-analytics/google-analytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jquery-ui/jquery-ui.min',
            less: 'vendor/less/less.min',
            text: 'vendor/require-text/text',
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
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/google-analytics/google-analytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jquery-ui/jquery-ui.min',
            less: 'vendor/less/less.min',
            text: 'vendor/require-text/text',
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
            backbone: 'vendor/backbone/backbone.min',
            bootstrap: 'vendor/bootstrap/bootstrap.min',
            d3: 'vendor/d3/d3.min',
            googleAnalytics: 'vendor/google-analytics/google-analytics.min',
            jquery: 'vendor/jquery/jquery.min',
            jqueryUi: 'vendor/jquery-ui/jquery-ui.min',
            less: 'vendor/less/less.min',
            text: 'vendor/require-text/text',
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
        'https://raw.github.com/twitter/bootstrap/master/' +
          'docs/assets/js/bootstrap.js',
      'vendor/bootstrap/bootstrap.min.js':
        'https://raw.github.com/twitter/bootstrap/master/' +
          'docs/assets/js/bootstrap.min.js',
      'vendor/d3/d3.js':
        'https://raw.github.com/mbostock/d3/master/d3.js',
      'vendor/d3/d3.min.js':
        'https://raw.github.com/mbostock/d3/master/d3.min.js',
      'vendor/google-analytics/google-analytics.min.js':
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
      'vendor/require-text/text.js':
        'https://raw.github.com/requirejs/text/master/text.js',
      'vendor/underscore/underscore.js':
        'https://raw.github.com/amdjs/underscore/master/underscore.js',
      'vendor/underscore/underscore.min.js':
        'https://raw.github.com/amdjs/underscore/master/underscore-min.js',

      'styles/bootstrap.less':
        'https://raw.github.com/twitter/bootstrap/master/' +
          'docs/assets/css/bootstrap.css',

      'img/glyphicons-halflings-white.png':
        'https://raw.github.com/twitter/bootstrap/master/docs/assets' +
          '/img/glyphicons-halflings-white.png',
      'img/glyphicons-halflings.png':
        'https://raw.github.com/twitter/bootstrap/master/docs/assets' +
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
