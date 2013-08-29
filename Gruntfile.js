/*
 * grunt-bboc
 * https://github.com/xiehui/grunt-bboc
 *
 * Copyright (c) 2013 xiehui
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    bboc: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

//      concat: {
//          job_1 : {
//              src: 'test/fixtures/project/lib/js/banner/*.js',
//              dest : 'dest/lib/js/banner.js'
//          }
//      }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.config('concat.job_1.src', 'test/fixtures/project/lib/js/banner/*.js');
    grunt.config('concat.job_1.dest', 'dest/lib/js/banner.js');
    grunt.task.run('concat');

  // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bboc', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
