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
        grunt.option('version', grunt.template.today('yymmddHHMM'));
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
        test.expect(2);
        var mapper = require('../tasks/lib/srcdestmapper')();
        var jsprocessor = require('../tasks/lib/jsprocessor')(grunt, 'test/fixtures/project/dest', mapper);
        jsprocessor.process('test/fixtures/project/lib', 'js/banner', 'banner.js', 'lib');
        jsprocessor.process('test/fixtures/project/lib', 'js/banner', 'banner2.js', 'lib');
        jsprocessor.process('test/fixtures/project/lib', 'js/banner', 'banner3.js', 'lib');
        grunt.log.writeln("concat property :" + grunt.config.get('concat'));
        test.deepEqual(grunt.config('concat.banner_0'), {
            src: 'test/fixtures/project/lib/js/banner/*.js',
            dest: 'test/fixtures/project/dest/lib/js/banner.js'
        }, 'concat is ok');
        test.deepEqual(grunt.config('uglify.banner_0.files'), {
            'test/fixtures/project/dest/lib/js/banner.min.js': ['test/fixtures/project/dest/lib/js/banner.js']
        }, 'uglify is ok');
        test.done();
    },
    html_processor: function (test) {
//        test.expect(1);
        var mapper = require('../tasks/lib/srcdestmapper')();
        mapper.addItem('test/fixtures/project/lib/js/banner/banner.js', 'test/fixtures/project/dest/lib/js/banner.min.js');
        mapper.addItem('test/fixtures/project/lib/js/banner/banner2.js', 'test/fixtures/project/dest/lib/js/banner.min.js');
        mapper.addItem('test/fixtures/project/lib/js/banner/banner3.js', 'test/fixtures/project/dest/lib/js/banner.min.js');
        var htmlprocessor = require('../tasks/lib/htmlprocessor')(grunt, 'test/fixtures/project/dest', mapper);
        htmlprocessor.process('test/fixtures/project/src', 'html', 'bboc.html', '');
        test.done();
    }
};
