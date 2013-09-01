/**
 * User: Hui Xie
 * Date: 13-8-20
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');
var fs = require('fs');
var util = require('./util')();

module.exports = function (grunt, dest, mapper) {

    var presdirs = [];
    var index = 0;
    var exports = {};

    var hasSubPath = function (dir) {
        var filenames = fs.readdirSync(dir);
        var i;
        for (i = 0; i < filenames.length; i++) {
            if (fs.statSync(path.join(dir, filenames[i])).isDirectory()) return true;
        }
        return false;
    };

    exports.process = function (rootdir, subdir, filename, destpath) {
        var jobname, destjs, destfile, uglify, srcpath = [rootdir, subdir || ''].join('/');
        if (presdirs.indexOf(srcpath) === -1) {
            if (hasSubPath([rootdir, subdir || ''].join('/'))) {
                jobname = path.basename(filename, '.js');
                destjs = [srcpath, filename].join('/');
                destfile = util.unixifyPath(path.join(dest, destpath || '', subdir || '', jobname + '.min.js'));
            } else {
                presdirs.push(srcpath);
                jobname = subdir.substr(subdir.lastIndexOf('/') + 1);
                destjs = util.unixifyPath(path.join(dest, destpath || '', subdir + '.js'));
                destfile = util.unixifyPath(path.join(dest, destpath || '', subdir + '.min.js'));

                grunt.config('concat.' + jobname + '_' + index + '.src', util.unixifyPath(path.join(srcpath, '*.js')));
                grunt.config('concat.' + jobname + '_' + index + '.dest', destjs);
            }

            uglify = {};
            uglify[destfile] = [destjs];
            grunt.config('uglify.' + jobname + '_' + index + '.files', uglify);
            index++;
        } else {
            destfile = util.unixifyPath(path.join(dest, destpath || '', subdir + '.min.js'));
        }
        mapper.addItem([srcpath, filename].join('/'), destfile);
    };

    return exports;
};