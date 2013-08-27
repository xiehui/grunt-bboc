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

    var regexps = [{
        pattern: /<script.+src=['"]([^"']+)["']/gm,
        filterOut: function(m) {
           return m;
        }
    }];

    var parse = function(content) {
//        var lines = content.replace(/\r\n/g,'\n').split(/\n/);
//        lines.forEach(function(line) {
//             regexps.forEach(function(reg) {
//
//             });
//        });
        regexps.forEach(function(reg) {
            content = content.replace(reg.pattern, function(match, src) {
                var line = match.replace(reg.filterOut(src));
                return line;
            });
        });
        return content;
    };

    exports.process = function() {
        dirs.forEach(function (dir) {
            grunt.file.recurse(dir.src, function (abspath, rootdir, subdir, filename) {
                var content;
                if (path.extname(filename) == '.html') {
                    content = grunt.file.read(abspath);
                    content = parse(content);
                    grunt.file.write(path.join(dest, dir.dest || '.', subdir, filename), content);
                    grunt.log.info('write html file : '+ path.join(dest, dir.dest || '.', subdir, filename));
                } else {
                    copies.push(abspath);
                }
            });
        });

    };
    return exports;
};