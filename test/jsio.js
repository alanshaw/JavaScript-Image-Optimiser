(function() {
	
	"use strict";
	
	var fs = require('fs');
	var vm = require('vm');
	
	var js = fs.readFileSync('src/jsio.js');
	
	/**
	 * Create a mock document object that'll allow JSIO initialisation to complete successfully (without auto loading a
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
	
	function runInContext(initContext) {
		
		var context = vm.createContext(initContext);
		
		vm.runInContext(js, context);
		
		return context;
	}
	
	module.exports = {
		
		testJsioNamespaceDefined: function(test) {
			
			var context = runInContext({document: mockDocument()});
			
			test.expect(1);
			
			test.notEqual(context.jsio, null, 'Should contain JSIO namespace');
			
			test.done();
		},
		
		testProcessFunctionExported: function(test) {
			
			var context = runInContext({document: mockDocument()});
			
			test.expect(1);
			
			test.notEqual(context.jsio.process, null, 'Process function should be exported');
			
			test.done();
		},
		
		testAutoProcess: function(test) {
			
			var resScript = null;
			var resUrl = 'path/to/resources.js';
			
			var document = {
			
				getElementsByTagName: function(tagName) {
					
					// For when JSIO tries to get it's <script> tag
					if(tagName == 'script') {
						return [{
							getAttribute: function(name) {
								if(name == 'data-res-url') {
									// Return the res url when getting the "data-res-url"
									return resUrl;
								}
								return null;
							},
							parentNode: {
								appendChild: function(child){}
							}
						}];
					}
					
					return [];
				},
				
				createElement: function(tagName) {
					
					var el = {
						getElementsByTagName: function() {
							return [];
						}
					};
					
					// For when JSIO creates a script tag to get the jsio resources file
					if(tagName == 'script') {
						// Store the element so we can interrogate it later
						resScript = el;
					}
					
					return el;
				}
			};
			
			runInContext({document: document});
			
			test.expect(3);
			
			test.notEqual(resScript, null, 'Resources script element should have been stored for interrogation');
			
			test.strictEqual(resScript.src, resUrl, 'Resources script element should have expected src');
			
			test.notEqual(resScript.onload, undefined, 'An onload function should have been registered with the resources script');
			
			test.done();
		},
		
		testIe7AutoProcess: function(test) {
			
			var resScript = null;
			var resUrl = 'path/to/resources.js';
			var getElementsByTagNameCount = 0;
			
			var document = {
			
				getElementsByTagName: function(tagName) {
					
					// For when JSIO tries to get it's <script> tag
					if(tagName == 'script') {
						return [{
							getAttribute: function(name) {
								if(name == 'data-res-url') {
									// Return the res url when getting the "data-res-url"
									return resUrl;
								}
								return null;
							}
						}];
					}
					
					return [];
				},
				
				createElement: function(tagName) {
					
					var el = {
						getElementsByTagName: function() {
							return [];
						}
					};
					
					// For when JSIO creates a script tag to get the jsio resources file
					if(tagName == 'script') {
						
						// Store the element so we can interrogate it later
						resScript = el;
						
					} else if(tagName == 'div') {
						
						return {
							getElementsByTagName: function() {
								
								getElementsByTagNameCount++;
								
								// Return a list of 1 element so we can bump the ie variable up to 7
								if(getElementsByTagNameCount < 4) return [true];
								
								return [];
							}
						};
					}
					
					return el;
				},
				
				styleSheets: []
			};
			
			var context = runInContext({document: document});
			
			test.expect(2);
			
			test.strictEqual(resScript, null, 'No resources script element should have been created');
			
			test.notEqual(context.jsio.resources, undefined, 'A dummy jsio.resources object should have been created');
			
			test.done();
		},
		
		testIe8AutoProcess: function(test) {
			
			var resScript = null;
			var resUrl = 'path/to/resources.js';
			var getElementsByTagNameCount = 0;
			
			var document = {
			
				getElementsByTagName: function(tagName) {
					
					// For when JSIO tries to get it's <script> tag
					if(tagName == 'script') {
						return [{
							getAttribute: function(name) {
								if(name == 'data-res-url') {
									// Return the res url when getting the "data-res-url"
									return resUrl;
								}
								return null;
							},
							parentNode: {
								appendChild: function(child){}
							}
						}];
					}
					
					return [];
				},
				
				createElement: function(tagName) {
					
					var el = {
						getElementsByTagName: function() {
							return [];
						}
					};
					
					// For when JSIO creates a script tag to get the jsio resources file
					if(tagName == 'script') {
						
						// Store the element so we can interrogate it later
						resScript = el;
						
					} else if(tagName == 'div') {
						
						return {
							getElementsByTagName: function() {
								
								getElementsByTagNameCount++;
								
								// Return a list of 1 element so we can bump the ie variable up to 8
								if(getElementsByTagNameCount < 5) return [true];
								
								return [];
							}
						};
					}
					
					return el;
				}
			};
			
			runInContext({document: document});
			
			test.expect(3);
			
			test.notEqual(resScript, null, 'Resources script element should have been stored for interrogation');
			
			test.strictEqual(resScript.src, resUrl, 'Resources script element should have expected src');
			
			test.notEqual(resScript.onreadystatechange, undefined, 'An onreadystatechange function should have been registered with the resources script');
			
			test.done();
		}
	};
}());