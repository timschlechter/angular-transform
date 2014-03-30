module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '<%= pkg.banner %>',
                sourceMap: 'dist/<%= pkg.name %>.min.js.map',
                sourceMappingURL: '<%= pkg.name %>.min.js.map'
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [
                        'src/*.js'
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.*'],
                tasks: ['build'],
                options: {
                    spawn: false,
                },
            },
        }
    });

    grunt.registerTask('build', ['uglify']);
};
