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
