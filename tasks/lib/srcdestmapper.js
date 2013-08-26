/**
 * Created with JetBrains WebStorm.
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
                rootNode.path = {};
            }
            routeNode(rootNode.path, paths);
        }
        return rootNode;
    };

    exports.addItem = function (srcfile, destfile) {
        var paths = srcfile.split('/');
        var filename = paths.pop();
        var node = routeNode(tree, paths);
        if (node.hasOwnProperty(destfile)) {
            node.destfile.push(filename);
        } else {
            node.destfile = [filename];
        }
    };

    return exports;
};