module.exports = function(grunt){

    //configuration
    grunt.initConfig({
        //pass in options to plugins, refrences to files etc
        concat : {
            docs : {
                src : [ 'src/index.html'],
                dest : 'dist/index.html'
            },
            js : {
                src : [ 'src/js/*.js'],
                dest : 'dist/js/light-table.js'
            },
            css : {
                src : [ 'src/css/*.css'],
                dest : 'dist/css/style.css'
            }
        },
        uglify : {
            build : {
                files : [
                    {
                        src :  'dist/js/light-table.js',
                        dest : 'dist/js/light-table.js',
                    },
                    /* 
                    {
                        src :  'dist/style.css',
                        dest : 'dist/style.css',
                    },
                    */
                ]
            } 
        },
        clean: {
            dist: [ 'dist' ]
        },
 
    });


    //load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
 

    // register tasks
    //grunt.registerTask('concat-js',['concat:js']);
    

    grunt.registerTask('dist',[ 'clean:dist', 'concat','uglify']);

  //  grunt.registerTask('serve', [ 'connect:server', 'watch' ]);

};