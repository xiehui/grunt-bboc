/**
 * User: Hui Xie
 * Date: 13-8-26
 * Time: 下午5:32
 * To change this template use File | Settings | File Templates.
 */

module.exports = function () {
    var exports = {};
    var tree = {};

    var routeNode = function (rootNode, paths) {
        var path;
        if (paths && paths.length > 0) {
            path = paths.shift();
            if (!rootNode.hasOwnProperty(path)) {
                rootNode[path] = {};
            }
            return routeNode(rootNode[path], paths);
        }
        return rootNode;
    };

    exports.addItem = function (srcfile, destfile) {
        var paths = srcfile.split('/');
        var filename = paths.pop();
        var node = routeNode(tree, paths);
        if (node.hasOwnProperty(destfile)) {
            node[destfile].push(filename);
        } else {
            node[destfile] = [filename];
        }
    };

    exports.getDestFile = function(srcfile) {
        var paths = srcfile.split('/');
        var filename = paths.pop();
        var node = routeNode(tree, paths);
        var destfile;
        for (destfile in node) {
            if (typeof node[destfile] == 'array' && node[destfile].indexOf(filename) !== -1) {
                break;
            }
        }
        return destfile;
    };

    return exports;
};