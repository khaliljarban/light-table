module.exports = function(grunt){

    //configuration
    grunt.initConfig({
        //pass in options to plugins, refrences to files etc
        concat : {
         /*   docs : {
                src : [ 'src/index.html'],
                dest : 'dist/index.html'
            },*/
            js : {
                src : [ 'src/js/light-table.js'],
                dest : 'dist/js/light-table.js'
            },
            css : {
                src : [ 'src/css/style.css'],
                dest : 'dist/css/style.css'
            }
        },
        uglify : {
            build : {
                files : [
                    {
                        src :  'dist/js/light-table.js',
                        dest : 'dist/js/light-table.js',
                    }
                ]
            } 
        },
        cssmin: {
            options: {
              mergeIntoShorthands: false,
              roundingPrecision: -1
            },
            target: {
              files: {
                'dist/css/style.css' : ['dist/css/style.css']
              }
            }
          },
          copy: {
            main: {
              src: 'src/css/demo.css',
              dest: 'dist/css/demo.css',
            },
            demo: {

                expand: true,
                cwd: 'src/',
                filter: 'isFile',
              src: '**.html',
              dest: 'dist/',
            },
          },
        clean: {
            dist: [ 'dist' ]
        },
 
    });


    //load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
 


    grunt.registerTask('dist',[ 'clean:dist', 'concat','uglify','cssmin','copy','copy:demo']);

  //  grunt.registerTask('serve', [ 'connect:server', 'watch' ]);

};