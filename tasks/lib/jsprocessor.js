/**
 * User: Hui Xie
 * Date: 13-8-20
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (grunt, dirs, dest) {
    var copies = [];
    var mapping = require('./srcdestmapper')(grunt.template.today('yyyymmddhhMM'));
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
        var index = 0;
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                var jobname, destjs, destminjs;
                if (path.extname(filename) == '.js') {

                    if (presdirs.indexOf(subdir) === -1) {
                        if (hasSubPath([rootdir, subdir].join('/'))) {
                            jobname = path.basename('.js');
                            destjs = abspath;
                            destminjs = path.join(dest, dir.dest || '.', subdir, jobname + '.min.js');
                        } else {
                            presdirs.push(subdir);
                            jobname = subdir.substr(subdir.lastIndexOf('/') + 1);
                            destjs = path.join(dest, dir.dest || '.', subdir + '.js');
                            destminjs = path.join(dest, dir.dest || '.', subdir + '.min.js');
//                        if (dir.dest) {
//                            destjs = [dest, dir.dest, subdir + '.js'].join('/');
//                            destminjs = [dest, dir.dest, subdir + '.min.js'].join('/');
//                        } else {
//                            destjs = [dest, subdir + '.js'].join('/');
//                            destminjs = [dest, subdir + '.min.js'].join('/');
//                        }
//                            concat[jobname + '_' + index] = {
////                            src: [rootdir, subdir, '*.js'].join('/')
//                                src: path.join(rootdir, subdir, '*.js')
//                            };
//                            concat[jobname + '_' + index].dest = destjs;

                            grunt.config('concat.' + jobname + '_' + index + '.src', path.join(rootdir, subdir, '*.js'));
                            grunt.config('concat.' + jobname + '_' + index + '.dest', destjs);
                        }

//                        uglify[jobname + '_' + index] = {
//                            files: {}
//                        };
//                        uglify[jobname + '_' + index].files[destminjs] = [destjs];
                        grunt.config('uglify.' + jobname + '_' + index + '.files', {destminjs : [destjs]});
                        index++;
                    } else {
                        destminjs = path.join(dest, dir.dest || '.', subdir + '.min.js');
                    }
                    mapping.addItem(abspath, destminjs);
                } else {
                    copies.push(abspath);
                }
            });
        });

//        grunt.config('concat', concat);
//        grunt.config('uglify', uglify);


//        grunt.loadNpmTasks('grunt-contrib-uglify');

//        grunt.registerTask('jsprocess', ['concat', 'uglify']);

//        grunt.task.run('concat');
    };

    exports.process = function () {
        parse();
    };

    return exports;
};