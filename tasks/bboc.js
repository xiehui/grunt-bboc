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
    var path = require('path');
    var util = require('./lib/util')();
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerTask('bboc', 'building based on covention', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dir: [
                {
                    src: 'lib',
                    dest: 'lib'
                },
                {
                    src: 'src',
                    dest: ''
                }
            ],
            dest: 'dest'
        });

        if (!(grunt.option('version'))) {
            grunt.option('version', grunt.template.today('yyyymmddHHMM'));
        }

        var isExtend = function(abspath) {
            var extendpatterns = options.extend || [];
            var len = extendpatterns.length, i;
            for (i = 0; i < len; i++) {
                if(grunt.file.isMatch(extendpatterns[i], abspath))
                    return true;
            }
            return false;
        };

        // collect file map
        var filemap = {
            js : [],
            html : [],
            other : []
        };
        options.dir.forEach(function(dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                if(isExtend(abspath)) return;
                var extname = path.extname(filename);
                if(extname === '.js') {
                    filemap.js.push({
                        rootpath: rootdir,
                        subpath: subdir,
                        name: filename,
                        subdest: dir.dest || ''
                    });
                } else if (extname === '.html') {
                    filemap.html.push({
                        rootpath: rootdir,
                        subpath: subdir,
                        name: filename,
                        subdest: dir.dest || ''
                    });
                } else {
                    filemap.other.push({
                        rootpath: rootdir,
                        subpath: subdir,
                        name: filename,
                        subdest: dir.dest || ''
                    });
                }
            });
        });

        var mapper = require('./lib/srcdestmapper')();

        // process js files
        var jsprocessor = require('./lib/jsprocessor')(grunt, options.dest, mapper);

        filemap.js.forEach(function(f) {
            jsprocessor.process(f.rootpath, f.subpath, f.name, f.subdest);
        });
        if (grunt.config('concat')) {
            grunt.loadNpmTasks('grunt-contrib-concat');
            grunt.task.run('concat');
        }
        if (grunt.config('uglify')) {
            grunt.loadNpmTasks('grunt-contrib-uglify');
            grunt.task.run('uglify');
        }

        // process other file to copy
        var copies = [];
        filemap.other.forEach(function(f) {
            var srcfile = util.unixifyPath(path.join(f.rootpath, f.subpath, f.name));
            var destfile = util.unixifyPath(path.join(options.dest, f.subdest, f.subpath, f.name));
            copies.push({src: [srcfile], dest: destfile});
            mapper.addItem(srcfile, destfile);
        });
        grunt.config('copy.main.files', copies);
        if (grunt.config('copy')) {
            grunt.loadNpmTasks('grunt-contrib-copy');
            grunt.task.run('copy');
        }

        //process html files
        var htmlprocessor = require('./lib/htmlprocessor')(grunt, options.dest, mapper);
        filemap.html.forEach(function(f) {
            htmlprocessor.process(f.rootpath, f.subpath, f.name, f.subdest);
        });

    });

};
