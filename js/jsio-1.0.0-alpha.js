/**
 * JSIO v1.0.0 Alpha
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
	
	if(!w.jsio) w.jsio = {};
	
	var scripts = d.getElementsByTagName('script'),
		jsioScript = scripts[scripts.length - 1],
		qs = '?' + jsioScript.src.replace(/^[^\?]+\??/, '');
	
	function getQueryString(key, dflt) {
		
		if(!dflt) dflt = '';
		
		var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
			match = regex.exec(qs);
		
		return match ? match[1] : dflt;
	}
	
	var resScript = d.createElement('script');
	
	resScript.onload = function() {
		
		// CSS background images
		for(var i = 0, ilen = d.styleSheets.length; i < ilen; ++i) {
			
			var styleSheet = d.styleSheets[i];
			
			for(var j = 0, jlen = styleSheet.cssRules.length; j < jlen; ++j) {
				
				var rule = styleSheet.cssRules[j],
					bgImageStyle = rule.style.getPropertyValue('background-image');
				
				if(bgImageStyle) {
					
					var regex = /url\(.*?jsio\.gif#(.*?)['"]?\)/gmi,
						match,
						dataUriBgImageStyle = bgImageStyle;
					
					while(match = regex.exec(bgImageStyle)) {
						
						if(jsio.resources[match[1]]) { // TODO: AND !(IE8 && resource > 32kb)
							dataUriBgImageStyle = dataUriBgImageStyle.replace(match[0], 'url(' + jsio.resources[match[1]] + ')');
						} else {
							dataUriBgImageStyle = dataUriBgImageStyle.replace(match[0], 'url(' + match[1] + ')');
						}
					}
					
					if(dataUriBgImageStyle != bgImageStyle) {
						rule.style.setProperty('background-image', dataUriBgImageStyle, '');
					}
				}
			}
		}
		
		// <img> elements
		var images = d.getElementsByTagName('img');
		
		for(var i = 0, ilen = images.length; i < ilen; ++i) {
			
			var regex = /jsio\.gif#(.*)/gmi, match;
			
			if(match = regex.exec(images[i].src)) {
				
				if(jsio.resources[match[1]]) { // TODO: AND !(IE8 && resource > 32kb)
					images[i].src = jsio.resources[match[1]];
				} else {
					images[i].src = match[1];
				}
			}
		}
	};
	
	jsioScript.parentNode.appendChild(resScript, jsioScript);
	resScript.src = getQueryString('resUrl', '/js/jsio-resources.js');
	
})(window, document);