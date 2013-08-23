/**
 * User: Hui Xie
 * Date: 13-8-20
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');

module.exports = function (grunt, dirs, dest) {
    var copies = [];
    var concat = {};
    var uglify = {};
    var tree = {};
    var exports = {};

    var routeNode = function (rootNode, paths) {
        var path;
        if (paths && paths.length > 0) {
            path = paths.shift();
            if (!rootNode.hasOwnProperty(path)) {
                rootNode.path = {};
            }
            routeNode(rootNode.path, paths);
        }
        return rootNode;
    };

    var addLeaf = function (fullpath, destfile) {
        var paths = fullpath.split('/');
        var filename = paths.pop();
        var node = routeNode(tree, paths);
        if (node.hasOwnProperty(destfile)) {
            node.destfile.push(filename);
        } else {
            node.destfile = [filename];
        }
    };

    var parse = function () {
        var presdirs = [];
        var index = 0;
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                if (path.extname(filename) == '.js') {
                    if (presdirs.indexOf(subdir) === -1) {
                        presdirs.push(dir.src);
                        var jobname = subdir.substr(subdir.lastIndexOf('/') + 1);
                        var destjs, destminjs;
                        destjs = path.join(dest, dir.dest || '.', subdir + '.js');
                        destminjs = path.join(dest, dir.dest || '.', subdir + '.min.js');
//                        if (dir.dest) {
//                            destjs = [dest, dir.dest, subdir + '.js'].join('/');
//                            destminjs = [dest, dir.dest, subdir + '.min.js'].join('/');
//                        } else {
//                            destjs = [dest, subdir + '.js'].join('/');
//                            destminjs = [dest, subdir + '.min.js'].join('/');
//                        }
                        concat[jobname + '_' + index] = {
//                            src: [rootdir, subdir, '*.js'].join('/')
                            src: path.join(rootdir, subdir, '*.js')
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
        });
    };

    exports.process = function () {
        parse();
    };

    return exports;
};