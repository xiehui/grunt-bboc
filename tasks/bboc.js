/*
 * grunt-bboc
 * https://github.com/xiehui/grunt-bboc
 *
 * Copyright (c) 2013 xiehui
 * Licensed under the MIT license.
 *
 *  + lib
 *  |   |
 *  |   + js
 *  |   |
 *  |   + css
 *  |
 *  + src
 *  |    |
 *  |    + js
 *  |    |
 *  |    + css
 *  |    |
 *  |    - html
 *  |
 *  + dest
 *       |
 *       + lib
 *       |
 *       + js
 *       |
 *       + css
 *       |
 *       - html
 *
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerTask('bboc', 'building based on covention', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = {
            js: {
                dir: [
                    {
                        src: 'lib/js'
                    },
                    {
                        src: 'src/js',
                        dest: 'js'
                    }
                ]
            },
            html: {
                dir: [
                    {
                        src: 'src/html',
                        dest: 'html'
                    }
                ]
            },
            dest: 'dest'
        };

        if (grunt.option('version')) {
            grunt.option('version', grunt.template.today('yyyymmddHHMM'));
        }

        grunt.config('copy.main.files', []);

        var mapper = require('./lib/srcdestmapper')();

        var jsprocessor = require('./lib/jsprocessor')(grunt, options.js.dir, options.dest, mapper);
        jsprocessor.process();

        var htmlprocessor = require('./lib/htmlprocessor')(grunt, options.html.dir, options.dest, mapper);
        htmlprocessor.process();

        if (grunt.config('concat')) {
            grunt.loadNpmTasks('grunt-contrib-concat');
            grunt.task.run('concat');
        }
        if (grunt.config('uglify')) {
            grunt.loadNpmTasks('grunt-contrib-uglify');
            grunt.task.run('uglify');
        }
        if (grunt.config('copy')) {
            grunt.loadNpmTasks('grunt-contrib-copy');
            grunt.task.run('copy');
        }

    });

};
