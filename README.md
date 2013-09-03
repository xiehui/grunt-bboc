# grunt-bboc

> building based on covention

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bboc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bboc');
```

## The "bboc" task

### Overview
基于约定构建项目，即项目结构按约定组织，则可以保证开发场景和线上场景的项目相对独立，开发使用更易于阅读调试的项目结构，发布则是经过合并、混淆、压缩、打上版本戳的
得到优化适合线上项目。

约定的项目结构：
```
|-lib
   |-js
      |-banner
	     |-A.js
	     |-B.js
	    |-alone.js
   |-css
|-src
   |-js
   |-css
   |-html
	   |-example.html
```
构建后用于发布的项目结构：
```
dest
  |-lib	   
     |-js
	    |-banner.min.js
	    |-alone.min.js
  |-html
     |-example.html
```

#### js构建规则
1、目录（lib/js）下有js文件(alone.js),且该目录含有子目录（lib/js/banner）;则这一级目录的js文件将被独立的压缩（alone.min.js）
2、目录（lib/js/banner）下有js文件,且该目录不包含子目录；则这一级目录下的js文件将被合并压缩成一个文件，文件名取目录名（banner.min.js）

#### html替换规则
1、`<script>,<img>,<a>,<link>`等引用文件会自动替换为项目构建后的相关资源文件路径，如js，css，png等

2、对于`<script>`替换，会自动合并多个重复的引用，并添加当前构建的版本戳
如下，原html文件：
```
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="../../lib/js/banner/A.js"></script>
    <script src="../../lib/js/alone.js"></script>
    <script src="../../lib/js/banner/B.js"></script>
</head>
<body>

</body>
```
构建后生成的html文件：
```
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="../lib/js/banner.min.js?v=201308301118"></script>
    <script src="../lib/js/alone.min.js?v=201308301118"></script>
</head>
<body>

</body>
```

In your project's Gruntfile, add a section named `bboc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bboc: {
    options: {
      // Task-specific options go here.
      extend: ['path/**']
    }
  },
})
```

### Options

#### options.dest
Type: `String`
Default value: `dest`

build target directory

#### options.dir
Type: `Array`
Default value: `[
                {
                    src: 'lib',
                    dest: 'lib'
                },
                {
                    src: 'src',
                    dest: ''
                }
            ]`

will process project directory

#### options.extend
Type: `Array`
Default value: `[]`

build target extend the files of match pattern 



### Usage Examples

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  bboc: {
    options: {
      extend: ['**/*.md']
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2013-09-01    v0.1.1    first release
