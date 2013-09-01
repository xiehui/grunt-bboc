/**
 * User: Hui Xie
 * Date: 13-8-21
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');
var util = require('./util')();

module.exports = function (grunt, dest, mapper) {
    var exports = {};

    var getReplaceFlie = function (srcfile, destpath) {
        var replaceflie = mapper.getDestFile(srcfile);
        if (replaceflie) {
            return util.unixifyPath(path.relative(destpath, replaceflie));
        }
        return true;
    };

    var regexps = [
        {
            pattern: /<script.+src=['"]([^"']+)["']*(?:\/>|>\s*<\/script>)/gm,
            filterOut: function (srcfile, destpath, jsSet) {
                var replacefile = getReplaceFlie(srcfile, destpath);
                if (replacefile === true) {
                    return true;
                }
                if (jsSet.indexOf(replacefile) === -1) {
                    jsSet.push(replacefile);
                    return replacefile + '?v=' + grunt.option('version');
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
                /**
                 * destfile :
                 *      undefined,true  no replace
                 *      false           replace by ''
                 *      string          replace by this string
                 */
                return (destfile === undefined || destfile === true) ? match : (destfile === false ? '' : match.replace(src, destfile));
            });
        });
        return content;
    };

    exports.process = function (rootdir, subdir, filename, destpath) {
        var srcfile = util.unixifyPath(path.join(rootdir, subdir || '', filename));
        var content, destfile = util.unixifyPath(path.join(dest, destpath || '', subdir || '', filename));
        content = grunt.file.read(srcfile);
        content = parse(content, srcfile, destfile);
        grunt.file.write(destfile, content);
        grunt.log.writeln('write html file : ' + destfile);
    };

    return exports;
};