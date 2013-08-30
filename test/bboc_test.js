'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.bboc = {
    setUp: function (done) {
        // setup here if necessary

        done();
    },
//    default_options: function (test) {
//        test.expect(1);
//
//        var actual = grunt.file.read('tmp/default_options');
//        var expected = grunt.file.read('test/expected/default_options');
//        test.equal(actual, expected, 'should describe what the default behavior is.');
//
//        test.done();
//    },
//    custom_options: function (test) {
//        test.expect(1);
//
//        var actual = grunt.file.read('tmp/custom_options');
//        var expected = grunt.file.read('test/expected/custom_options');
//        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');
//
//        test.done();
//    },
    js_processor: function (test) {
//        test.expect(1);
        var mapper = require('../tasks/lib/srcdestmapper')();
        var jsprocessor = require('../tasks/lib/jsprocessor')(grunt, [
            {
                src: 'test/fixtures/project/lib/js',
                dest: 'js/lib'
            }
        ], 'test/fixtures/project/dest', mapper);
        jsprocessor.process();
        grunt.log.writeln("concat property :" + grunt.config.get('concat'));
        test.done();
    },
    html_processor: function (test) {
        var mapper = require('../tasks/lib/srcdestmapper')();
        mapper.addItem('test/fixtures/project/lib/js/banner/banner.js', 'test/fixtures/project/js/lib/banner.min.js');
        mapper.addItem('test/fixtures/project/lib/js/banner/banner2.js', 'test/fixtures/project/js/lib/banner.min.js');
        mapper.addItem('test/fixtures/project/lib/js/banner/banner3.js', 'test/fixtures/project/js/lib/banner.min.js');
        var htmlprocessor = require('../tasks/lib/htmlprocessor')(grunt, [
            {
                src: 'test/fixtures/project/src/html',
                dest: 'html'
            }
        ], 'test/fixtures/project/dest', mapper);
        htmlprocessor.process();
        test.done();
    }
};
