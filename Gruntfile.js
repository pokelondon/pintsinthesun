module.exports = function(grunt) {
    var port = grunt.option('port') || 8000;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            main: {
                files: ['Gruntfile.js', 'src/**'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: port,
                    hostname: 'localhost',
                    base: '.',
                    keepalive: true,
                    debug: true
                }
            }
        },
        notify: {
            watch: {
                options: {
                    message: 'Watching for changes'
                }
            },
            finish: {
                options: {
                    message: 'Build complete'
                }
            }
        },
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-notify');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('serve', ['connect', 'notify:serve']);

};

