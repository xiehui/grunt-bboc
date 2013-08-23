/**
 * User: Hui Xie
 * Date: 13-8-21
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */

module.exports = (grunt, dirs, dest) {
    var exports = {};
//    var lines = content.replace(/\r\n/g, '\n').split(/\n/);

    var regexps = [{
        pattern: /<script.+src=['"]([^"']+)["']/gm,
        filterOut: function(m) {

        }
    }];
    return exports;
};