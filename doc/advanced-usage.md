Advanced Usage
==============


Manual URL processing
---------------------

If you don't specify a `data-res-url` attribute on your JSIO script element then JSIO will not automatically process your JSIO URLs. You can process URLs manually as follows:

	<img src="img/jsio.gif#foo.jpg" alt="A foo"/>
	<img src="img/jsio.gif#bar.gif" alt="A bar"/>
	<script src="js/jsio.js">
	<script>
		
		var resources = {
			'foo.jpg': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU...',
			'bar.gif': 'data:image/gif;base64,R0lGODlhqQGpAfcAABMVFhQVFhUVFhUWFhQWFhYWFhcX...'
		};
		
		jsio.process(resources);
		
	</script>


JSON resources
--------------

By default, JSIO resources files are JavaScript files which, when run, attach themselves to the `jsio.resources` variable (When you call `jsio.process` with no parameters it assumes you want to use `jsio.resources` as your resources). Using JavaScript for resources files conveniently allows us to get round the cross domain policy by using a pseudo JSONP approach. There is no reason why your resources files can't be JSON. Here is an example using jQuery:

	<img src="img/jsio.gif#foo.jpg" alt="A foo"/>
	<img src="img/jsio.gif#bar.gif" alt="A bar"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="js/jsio.js">
	<script>
		
		jQuery.getJSON(
			'url/to/resources.json',
			function(data) {
				jsio.process(resources);
			}
		);
		
	</script>


Disabling the resource 404 fallback
-----------------------------------

The default behaviour of JSIO is to fallback to the image URL when an image is not found in the JSIO resources file. Technically all it does is remove "jsio.gif#" from your URLs. Consider this:
 
	<img src="img/jsio.gif#foo.jpg" alt="A foo"/>
	<img src="img/jsio.gif#bar.gif" alt="A bar"/>
	<script src="js/jsio.js">
	<script>
		jsio.process({'foo.jpg': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU...'});
	</script>

After processing, the image HTML will look like:

	<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU..." alt="A foo"/>
	<img src="img/bar.gif" alt="A bar"/>

...since `bar.gif` is not in the resources.

This is problematic if you're planning on calling `jsio.process` more than once. This could be for any number of reasons, perhaps you put new content in the DOM, or perhaps you run a bunch of sites under one umbrella company and have one resources file with shared resources and one with site specific resources.

Luckily, you can pass a second parameter to the `jsio.process` function - a boolean, which enables or disables the resource 404 fallback. By default it is enabled, but pass `false` to the function to disable it e.g. `jsio.process(data, false)`.