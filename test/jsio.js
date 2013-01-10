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
		},
		
		testProcessCssBackgroundImages: function(test) {
			
			var document = mockDocument();
			
			// Create mock CSS data to process
			document.styleSheets = [{
				cssRules: [{
					style: {
						backgroundImage: 'url(path/to/images/jsio.gif#foo.jpg)'
					}
				}, {
					style: {
						backgroundImage: 'url("jsio.gif#bar.gif")'
					}
				}]
			}, {
				cssRules: [{
					style: {
						backgroundImage: "url('some/path/to/jsio.gif#not-found.png')"
					}
				}]
			}];
			
			var resources = {
				'foo.jpg': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU...',
				'bar.gif': 'data:image/gif;base64,R0lGODlhqQGpAfcAABMVFhQVFhUVFhUWFhQWFhYWFhcX...'
			};
			
			var context = runInContext({document: document});
			
			context.jsio.process(resources);
			
			test.expect(3);
			
			test.equal(
				document.styleSheets[0].cssRules[0].style.backgroundImage,
				'url(' + resources['foo.jpg'] + ')',
				'Should have replace backgroundImage URL for foo.jpg with data URL from JSIO resources'
			);
			
			test.equal(
				document.styleSheets[0].cssRules[1].style.backgroundImage,
				'url(' + resources['bar.gif'] + ')',
				'Should have replace backgroundImage URL for bar.gif with data URL from JSIO resources'
			);
			
			test.equal(
				document.styleSheets[1].cssRules[0].style.backgroundImage,
				"url('some/path/to/not-found.png')",
				'Should have replace backgroundImage URL for not-found.png with image URL since it was not present in JSIO resources file'
			);
			
			test.done();
		},
		
		testProcessImageElements: function(test) {
			
			var document = mockDocument();
			
			document.styleSheets = [];
			
			var imageElements =[{
				src: 'path/to/images/jsio.gif#foo.jpg'
			}, {
				src: 'path/to/images/jsio.gif#bar.gif'
			}, {
				src: 'path/to/images/jsio.gif#not-found.png'
			}];
			
			document.getElementsByTagName = function(tagName) {
				
				// For when JSIO tries to get it's <script> tag
				if(tagName == 'script') {
					return [{
						getAttribute: function() {
							return null;
						}
					}];
					
				} else if(tagName == 'img') {
					return imageElements;
				}
				
				return [];
			};
			
			var resources = {
				'foo.jpg': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU...',
				'bar.gif': 'data:image/gif;base64,R0lGODlhqQGpAfcAABMVFhQVFhUVFhUWFhQWFhYWFhcX...'
			};
			
			var context = runInContext({document: document});
			
			context.jsio.process(resources);
			
			test.expect(3);
			
			test.equal(
				imageElements[0].src,
				resources['foo.jpg'],
				'Should have replace image src for foo.jpg with data URL from JSIO resources'
			);
			
			test.equal(
				imageElements[1].src,
				resources['bar.gif'],
				'Should have replace image src for bar.gif with data URL from JSIO resources'
			);
			
			test.equal(
				imageElements[2].src,
				'path/to/images/not-found.png',
				'Should have replace image src for not-found.png with image URL since it was not present in JSIO resources file'
			);
			
			test.done();
		}
	};
}());