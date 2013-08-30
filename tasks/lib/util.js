/**
 * Created with JetBrains WebStorm.
 * User: Hui Xie
 * Date: 13-8-30
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */

module.exports = function () {
    var exports = {};

    var win32 = process.platform === 'win32';

    // Normalize \\ paths to / paths.
    exports.unixifyPath = function (filepath) {
        if (win32) {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

    return exports;
};