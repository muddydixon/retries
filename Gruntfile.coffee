module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    coffee:
      options:
        bare: true
      all:
        files:
          "lib/retries.js": "src/retries.coffee"

    simplemocha:
      options:
        ui: 'bdd'
        reporter: 'spec'
        timeout: 10000
      all:
        src: [ "test/*_test.coffee" ]

    watch:
      all:
        files: [ "src/*.coffee", "test/*_test.coffee", "Gruntfile.coffee" ]
        tasks: [ "simplemocha", "coffee" ]

    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-simple-mocha')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask 'test', [ 'simplemocha' ]

    grunt.registerTask 'default', [ "coffee" ]
