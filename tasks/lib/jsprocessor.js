/**
 * User: Hui Xie
 * Date: 13-8-20
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');

module.exports = function (dirs, dest, grunt) {
    var copies = [];
    var concat = {};
    var uglify = {};
    var exports = {};

    var parse = function () {
        var presdirs = [];
        var index = 0, srcdir;
        for (srcdir in dirs) {
            grunt.file.recurse(srcdir, function (abspath, rootdir, subdir, filename) {
                if (path.extname(filename) == '.js') {
                    if (presdirs.indexOf(subdir) === -1) {
                        presdirs.push(subdir);
                        var jobname = subdir.substr(subdir.lastIndexOf('/') + 1);
                        var destjs = [dest, dirs[srcdir], subdir + '.js'].join('/');
                        var destminjs = [dest, dirs[srcdir], subdir + '.min.js'].join('/');
                        concat[jobname + '_' + index] = {
                            src: [rootdir, subdir, '*.js'].join('/')
                        };
                        concat[jobname + '_' + index].dest = destjs;
                        uglify[jobname + '_' + index] = {
                            files: {}
                        };
                        uglify[jobname + '_' + index].files[destminjs] = [destjs];
                        index++;
                    }
                } else {
                    copies.push(abspath);
                }
            });
        }
    };

    exports.process = function () {
        parse();
    };

    return exports;
};

//JsProcessor.prototype.process = function () {
//    this.parse();
//};

//JsProcessor.prototype.parse = function () {
//    var presdirs = [];
//    var index = 0;
//    this.srcdir.forEach(function (dir) {
//        grunt.file.recurse(dir, function (abspath, rootdir, subdir, filename) {
//            if (path.extname(filename) == '.js') {
//                if (presdirs.indexOf(subdir) === -1) {
//                    presdirs.push(subdir);
//                    var destname = subdir.substr(subdir.lastIndexOf('/'));
//                    var dest = [this.dest, subdir, destname + '.js'].join('/');
//                    var destmin = [this.dest, subdir, destname + '.min.js'].join('/');
//                    this.concat[destname + '_' + index] = {
//                        src: [rootdir, subdir, '*.js'].join('/')
//                    };
//                    this.concat[destname + '_' + index].dest = dest;
//                    this.uglify[destname + '_' + index] = {
//                        files: {}
//                    };
//                    this.uglify[destname + '_' + index].files[destmin] = [dest];
//                    index++;
//                }
//            } else {
//                this.copies.push(abspath);
//            }
//        });
//    });
//};