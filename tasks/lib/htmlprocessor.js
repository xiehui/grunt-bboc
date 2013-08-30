/**
 * User: Hui Xie
 * Date: 13-8-21
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');
var util = require('./util')();

module.exports = function (grunt, dirs, dest, mapper) {
    var exports = {};

    var getReplaceFlie = function(srcfile, destpath) {
        var replaceflie = mapper.getDestFile(srcfile);
        return util.unixifyPath(path.relative(destpath, replaceflie));
    };

    var regexps = [
        {
            pattern: /<script.+src=['"]([^"']+)["']/gm,
            filterOut: function(srcfile, destpath, jsSet) {
                var replacefile = getReplaceFlie(srcfile, destpath);
                if (jsSet.indexOf(replacefile) === -1) {
                    jsSet.push(replacefile);
                    return replacefile + '?ver=' + grunt.option('version');
                }
                return false;
            }
        },
        {
            pattern: /<link[^\>]+href=['"]([^"']+)["']/gm,
            filterOut: getReplaceFlie
        },
        {
            pattern: /<img[^\>]+src=['"]([^"']+)["']/gm,
            filterOut: getReplaceFlie
        },
        {
            pattern: /<a[^\>]+href=['"]([^"']+)["']/gm,
            filterOut: getReplaceFlie
        }
    ];

    var parse = function (content, srchtml, desthtml) {
        var srcpath = path.dirname(srchtml);
        var destpath = path.dirname(desthtml);
        var jsSet = [];
        regexps.forEach(function (reg) {
            content = content.replace(reg.pattern, function (match, src) {
                var srcfile = util.unixifyPath(path.relative(process.cwd(), path.resolve(srcpath, src)));
                var destfile = reg.filterOut(srcfile, destpath, jsSet);
                return destfile ? match.replace(src, destfile) : '';
            });
        });
        return content;
    };

    exports.process = function () {
        var copies = grunt.config('copy.main.files');
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                var content, destfile = util.unixifyPath(path.join(dest, dir.dest || '', subdir || '', filename));
                if (path.extname(filename) === '.html') {
                    content = grunt.file.read(abspath);
                    content = parse(content, abspath, destfile);
                    grunt.file.write(destfile, content);
                    grunt.log.writeln('write html file : ' + destfile);
                } else {
                    copies.push({src: [abspath], dest: path.dirname(destfile)});

                }
                mapper.addItem(abspath, destfile);
            });
        });

    };
    return exports;
};