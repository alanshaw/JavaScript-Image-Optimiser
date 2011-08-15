/**
 * JSIO
 * 
 * Copyright 2011 Alan Shaw
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations
 * under the License.
 */
(function(w, d) {
	
	// Init ///////////////////////////////////////////////////////////////////
	
	// Setup the JSIO namespace
	if(!w.jsio) w.jsio = {};
	
	var scripts = d.getElementsByTagName('script'),
		jsioScript = scripts[scripts.length - 1],
		qs = '?' + jsioScript.src.replace(/^[^\?]+\??/, ''),
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
	
	function getQueryString(key, dflt) {
		
		if(!dflt) dflt = '';
		
		var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
			match = regex.exec(qs);
		
		return match ? match[1] : dflt;
	}
	
	function processCssBackgroundImages() {
		
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
						match,
						dataUriBgImageStyle = bgImageStyle;
					
					while(match = regex.exec(bgImageStyle)) {
						
						if(jsio.resources[match[2]]) {
							
							// IE < 8 does not support data uri and IE8 has a 32KB limit
							if(ie < 8 || (ie == 8 && jsio.resources[match[2]].length * 2 > 32000)) {
								
								dataUriBgImageStyle = dataUriBgImageStyle.replace(match[0], 'url(' + match[1] + match[2] + ')');
								
							} else {
								
								dataUriBgImageStyle = dataUriBgImageStyle.replace(match[0], 'url(' + jsio.resources[match[2]] + ')');
							}
							
						} else {
							
							dataUriBgImageStyle = dataUriBgImageStyle.replace(match[0], 'url(' + match[1] + match[2] + ')');
						}
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
	
	function processImageElements() {
		
		var images = d.getElementsByTagName('img');
		
		for(var i = 0, ilen = images.length; i < ilen; ++i) {
			
			var regex = /(.*?)jsio\.gif#(.*)/gmi, match;
			
			if(match = regex.exec(images[i].src)) {
				
				if(jsio.resources[match[2]]) {
					
					// IE < 8 does not support data uri and IE8 has a 32KB limit
					if(ie < 8 || (ie == 8 && jsio.resources[match[2]].length * 2 > 32000)) {
						
						images[i].src = match[1] + match[2];
						
					} else {
						
						images[i].src = jsio.resources[match[2]];
					}
					
				} else {
					
					images[i].src = match[2];
				}
			}
		}
	}
	
	// Main ///////////////////////////////////////////////////////////////////
	
	function process() {
		
		// Fail fast for invalid resource files or 404 (in IE's case)
		if(!jsio.resources) return;
		
		processCssBackgroundImages();
		
		processImageElements();
	}
	
	var resScript = d.createElement('script');
	
	// IE < 9 does not fire onload callback on script elements
	if(ie < 9) {
		
		resScript.onreadystatechange = function() {
			
			if(this.readyState == 'loaded' || this.readyState == 'complete') {
				
				process();
			}
		}
		
	} else {
		
		resScript.onload = process;
	}
	
	jsioScript.parentNode.appendChild(resScript, jsioScript);
	resScript.src = getQueryString('resUrl', '/js/jsio-resources.js');
	
})(window, document);