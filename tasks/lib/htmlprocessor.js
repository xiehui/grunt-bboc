/**
 * User: Hui Xie
 * Date: 13-8-21
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');

module.exports = function(grunt, dirs, dest, mapper) {
    var copies = [];
    var exports = {};

    var win32 = process.platform === 'win32';

    // Normalize \\ paths to / paths.
    var unixifyPath = function(filepath) {
        if (win32) {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

    var regexps = [{
        pattern: /<script.+src=['"]([^"']+)["']/gm,
        filterOut: function(srcfile, destpath) {
           var destjs = mapper.getDestFile(srcfile);
           return unixifyPath(path.relative(destpath, destjs));
        }
    }];

    var parse = function(content, srchtml, desthtml) {
        var srcpath = path.dirname(srchtml);
        var destpath = path.dirname(desthtml);
        regexps.forEach(function(reg) {
            content = content.replace(reg.pattern, function(match, src) {
                var srcfile = unixifyPath(path.relative(process.cwd(), path.resolve(srcpath, src)));
                var line = match.replace(src, reg.filterOut(srcfile, destpath));
                return line;
            });
        });
        return content;
    };

    exports.process = function() {
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                var content, desthtml = path.join(dest, dir.dest || '', subdir || '', filename);
                if (path.extname(filename) == '.html') {
                    content = grunt.file.read(abspath);
                    content = parse(content, abspath, desthtml);
                    grunt.file.write(desthtml, content);
                    grunt.log.writeln('write html file : '+ desthtml);
                } else {
                    copies.push(abspath);
                }
            });
        });

    };
    return exports;
};