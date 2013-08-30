/**
 * User: Hui Xie
 * Date: 13-8-20
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');
var fs = require('fs');
var util = require('./util')();

module.exports = function (grunt, dirs, dest, mapper) {

    var exports = {};

    var hasSubPath = function (dir) {
        var filenames = fs.readdirSync(dir);
        var i;
        for (i = 0; i < filenames.length; i++) {
            if (fs.statSync(path.join(dir, filenames[i])).isDirectory()) return true;
        }
        return false;
    };

    var parse = function () {
        var presdirs = [];
        var index = 0, copies = grunt.config('copy.main.files');
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                var jobname, destjs, destfile, uglify;
                if (path.extname(filename) == '.js') {

                    if (presdirs.indexOf(subdir) === -1) {
                        if (hasSubPath([rootdir, subdir || ''].join('/'))) {
                            jobname = path.basename(filename, '.js');
                            destjs = abspath;
                            destfile = util.unixifyPath(path.join(dest, dir.dest || '.', subdir, jobname + '.min.js'));
                        } else {
                            presdirs.push(subdir);
                            jobname = subdir.substr(subdir.lastIndexOf('/') + 1);
                            destjs = util.unixifyPath(path.join(dest, dir.dest || '.', subdir + '.js'));
                            destfile = util.unixifyPath(path.join(dest, dir.dest || '.', subdir + '.min.js'));

                            grunt.config('concat.' + jobname + '_' + index + '.src', util.unixifyPath(path.join(rootdir, subdir, '*.js')));
                            grunt.config('concat.' + jobname + '_' + index + '.dest', destjs);
                        }

                        uglify = {};
                        uglify[destfile] = [destjs];
                        grunt.config('uglify.' + jobname + '_' + index + '.files', uglify);
                        index++;
                    } else {
                        destfile = util.unixifyPath(path.join(dest, dir.dest || '.', subdir + '.min.js'));
                    }
                } else {
                    destfile = util.unixifyPath(path.join(dest, dir.dest || '', subdir || '', filename));
                    copies.push({src: [abspath], dest: path.dirname(copydestfile)});
                }
                mapper.addItem(abspath, destfile);

            });
        });

    };

    exports.process = function () {
        parse();
    };

    return exports;
};