(function() {
	
	"use strict";
	
	var fs = require('fs');
	var vm = require('vm');
	
	var js = fs.readFileSync('src/jsio.js');
	
	/**
	 * Create a mock document object that'll allow JSIO initialisation to complete successfully (without loading a
	 * jsio resources file).
	 */
	function mockDocument() {
		return {
			
			getElementsByTagName: function(tagName) {
				
				// For when JSIO tries to get it's <script> tag
				if(tagName == 'script') {
					return [{
						getAttribute: function() {
							return null;
						}
					}];
				}
				
				return [];
			},
			
			createElement: function() {
				return {
					getElementsByTagName: function() {
						return [];
					}
				};
			}
		};
	}
	
	var context;
	
	module.exports = {
		
		setUp: function(callback) {
			
			context = vm.createContext({
				document: mockDocument()
			});
			
			vm.runInContext(js, context);
			
			callback();
		},
		
		testJsioNamespaceDefined: function(test) {
			
			test.expect(1);
			
			test.notEqual(null, context.jsio, 'Should contain JSIO namespace');
			
			test.done();
		},
		
		testProcessFunctionExported: function(test) {
			
			test.expect(1);
			
			test.notEqual(null, context.jsio.process, 'Process function should be exported');
			
			test.done();
		}
	};
}());