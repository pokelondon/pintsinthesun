module.exports = function(grunt) {
    var port = grunt.option('port') || 8000;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: ["src/snack/public/css"],
                    sourceMap: true,
                    sourceMapFilename: "src/snack/public/main.css.map",
                    sourceMapBasepath: "src/snack/public/",
                    sourceMapURL: "/s/main.css.map"
                },
                files: {
                    "src/snack/public/css/ltIE9.css": "src/snack/public/less/ltIE9.less",
                    "src/snack/public/css/main.css": "src/snack/public/less/main.less"
                }
            },
            production: {
                options: {
                    paths: ["src/snack/public/css"],
                    yuicompress: true
                },
                files: {
                    "src/snack/public/css/main.min.css": "src/snack/public/less/main.less",
                    "src/snack/public/css/ltIE9.min.css":"src/snack/public/less/ltIE9.less"
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["src/assets/css"],
                    sourceMap: true,
                    sourceMapFilename: "src/assets/main.css.map",
                    sourceMapBasepath: "src/assets/",
                    sourceMapURL: "/src/assets/main.css.map"
                },
                files: {
                    "src/assets/css/main.css": "src/assets/less/main.less"
                }
            },
        },
        watch: {
            less: {
                files: [
                    "src/assets/less/*.less"
                ],
                tasks: ['less:development']
            },
            main: {
                files: [
                    'Gruntfile.js',
                    'src/assets/js/*.js',
                    'src/assets/css/*.css',
                    'src/*.html'
                ],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: port,
                    hostname: '0.0.0.0',
                    base: 'src',
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
    grunt.loadNpmTasks('grunt-contrib-less');
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

