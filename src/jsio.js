(function(w, d) {
	
	// Init ///////////////////////////////////////////////////////////////////
	
	// Setup the JSIO namespace
	w.jsio = w.jsio || {};
	
	var scripts = d.getElementsByTagName('script'),
		jsioScript = scripts[scripts.length - 1],
		// Check for IE thanks to https://gist.github.com/527683
		ie = (function(){
		
			var undef, v = 3, div = d.createElement('div');
			
			// the while loop is used without an associated block: {}
			// so, only the condition within the () is executed.
		
			// semicolons arent allowed within the condition,
			//   so a comma is used to stand in for one
			// basically allowing the two separate statements 
			//   to be evaluated sequentially.
			
			while (
				div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
				div.getElementsByTagName('i')[0]
			);
			
			// each time it's evaluated, v gets incremented and
			//   tossed into the DOM as a conditional comment
			// the i element is then a child of the div.
			
			// the return value of the getEBTN call is used as 
			//   the final condition expression
			// if there is an i element (the IE conditional
			//   succeeded), then getEBTN's return is truthy
			// and the loop continues until there is no 
			//   more i elements.
			
			// In other words:  ** MAGIC**
			
			return v > 4 ? v : undef;
			
		}());
	
	// Function ///////////////////////////////////////////////////////////////
	
	function processCssBackgroundImages(resources) {
		
		// CSS background images
		for(var i = 0, ilen = d.styleSheets.length; i < ilen; ++i) {
			
			var styleSheet = d.styleSheets[i],
				// Allows access to the non-standard list of CSS rules in IE
				cssRules = ie < 9 ? 'rules' : 'cssRules';
			
			for(var j = 0, jlen = styleSheet[cssRules].length; j < jlen; ++j) {
				
				var rule = styleSheet[cssRules][j],
					bgImageStyle = rule.style.backgroundImage;
				
				if(bgImageStyle) {
					
					var regex = /url\(['"]?(.*?)jsio\.gif#(.*?)['"]?\)/gmi,
						matches = regex.exec(bgImageStyle),
						dataUriBgImageStyle = bgImageStyle;
					
					while(matches) {
						
						var fullMatch = matches[0],
							path = matches[1], 
							filename = matches[2];
						
						if(resources[filename]) {
							
							// IE < 8 does not support data uri and IE8 has a 32KB limit
							if(ie < 8 || (ie == 8 && resources[filename].length * 2 > 32000)) {
								
								dataUriBgImageStyle = dataUriBgImageStyle.replace(fullMatch, 'url("' + path + filename + '")');
								
							} else {
								
								dataUriBgImageStyle = dataUriBgImageStyle.replace(fullMatch, 'url(' + resources[filename] + ')');
							}
							
						} else {
							
							dataUriBgImageStyle = dataUriBgImageStyle.replace(fullMatch, 'url("' + path + filename + '")');
						}
						
						matches = regex.exec(bgImageStyle);
					}
					
					if(dataUriBgImageStyle != bgImageStyle) {
						rule.style.backgroundImage = dataUriBgImageStyle;
					}
				}
			}
			
			// IE doesn't re-parse stylesheet data when manipulating existing rules
			if(ie) styleSheet.addRule('jsio', 'jsio');
		}
	}
	
	function processImageElements(resources) {
		
		var images = d.getElementsByTagName('img');
		
		for(var i = 0, ilen = images.length; i < ilen; ++i) {
			
			var image = images[i],
				regex = /(.*?)jsio\.gif#(.*)/gmi, 
				matches = regex.exec(image.src);
			
			if(matches) {
				
				var filename = matches[2], 
					src;
				
				if(resources[filename]) {
					
					// IE < 8 does not support data uri and IE8 has a 32KB limit
					if(ie < 8 || (ie == 8 && resources[filename].length * 2 > 32000)) {
						
						src = matches[1] + filename;
						
					} else {
						
						src = resources[filename];
					}
					
				} else {
					
					src = filename;
				}
				
				image.src = src;
			}
		}
	}
	
	// Main ///////////////////////////////////////////////////////////////////
	
	function process(resources) {
		
		resources = resources || w.jsio.resources;
		
		// Fail fast for invalid resource files or 404 (in IE's case)
		if(!resources) return;
		
		processCssBackgroundImages(resources);
		
		processImageElements(resources);
	}
	
	// Expose the process function so that it can be called when new image elements and style rules are added
	w.jsio.process = process;
	
	var resUrl = jsioScript.getAttribute('data-res-url');
	
	// Don't process jsio URLs if no resources file specified, assume user will call "process"
	if(!resUrl) return;
	
	// IE 7 and below can't display data uri encoded images - don't even bother to download the resources file
	if(ie < 8) {
		
		w.jsio.resources = {};
		
		process();
		
	} else {
		
		var resScript = d.createElement('script');
		
		// IE < 9 does not fire onload callback on script elements
		if(ie < 9) {
			
			resScript.onreadystatechange = function() {
				
				var state = this.readyState;
				
				if(state == 'loaded' || state == 'complete') {
					process();
				}
			};
			
		} else {
			
			resScript.onload = function() {
				process();
			}
		}
		
		jsioScript.parentNode.appendChild(resScript);
		resScript.src = resUrl;
	}
	
})(this, document);