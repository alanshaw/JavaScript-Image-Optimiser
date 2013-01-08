module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		
		pkg: '<json:package.json>',
		
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
		},
		
		lint: {
			all: ['src/jsio.js', 'test/*.js']
		},
		
		jshint: {
			options: {
				node: true
			}
		},
		
		min: {
			dist: {
				src: ['<banner>', 'src/jsio.js'],
				dest: 'dist/jsio.min.js'
			}
		},
		
		test: {
			files: ['test/*.js']
		}
	});
	
	//grunt.loadNpmTasks('grunt-sample');
	
	// Default task.
	grunt.registerTask('default', 'lint test min');
};