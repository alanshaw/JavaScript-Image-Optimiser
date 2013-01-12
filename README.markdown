What is JSIO? [![Build Status](https://travis-ci.org/alanshaw/JavaScript-Image-Optimiser.png)](https://travis-ci.org/alanshaw/JavaScript-Image-Optimiser)
=============

JSIO is a tiny library that allows you to make fewer requests to your server by packaging all your site image data in a JavaScript file in [data uri format](http://en.wikipedia.org/wiki/Data_URI_scheme). The idea is that a Gzipped JavaScript file containing all your image data is likely to be smaller than the sum of each image file and its associated HTTP request and header traffic.

Huh?
----

Each background-image you place in your CSS stylesheets and each `<img>` element you place in your HTML file causes your browser to issue a request to download the file from the web server. Each request requires a new HTTP connection to be setup, and HTTP headers to be sent down the wire before the file even starts to be transferred. With a lot of images this starts to become a problem, as a lot of unnecessary time and bandwidth is wasted performing these basic operations over and over again. JSIO helps to ease the burden of opening all these connections by placing all your image data in one file.


How does it work?
=================

Simple. The JSIO script sends a request to the server to fetch a JavaScript file that contains image data. The data is loaded into the jsio.resources object - the keys are the filenames of images and the values are their data uri representation. For example:

```javascript
jsio.resources = {'superman.jpg': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU...'};
```

Check this out:

```html
<img src="img/jsio.gif#superman.jpg"/>
```

This is an image element that will display the image &quot;jsio.gif&quot;. The file &quot;jsio.gif&quot; is a placeholder that signals to the library that the image by the name of &quot;img/superman.jpg&quot; has been encoded as a data URI and can be found in the jsio.resources JavaScript object.

JSIO looks for these placeholders, and replaces them with data uri's that are in the jsio.resources object.

```html
<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBhISEBU..."/>
```

You can see JSIO in action on the [test page](http://alanshaw.github.com/JavaScript-Image-Optimiser/test.html).

What's the catch?
=================

Glad you asked. The elephant in the room is of course IE. IE < 9 has a 32KB limit on data uri's and IE < 8 doesn't support data uri's at all. [Data uri's are supported in most other browsers](http://en.wikipedia.org/wiki/Data_URI_scheme#Web_browser_support). Also, somewhat obviously, JavaScript must be enabled.

How can I use it on my website?
===============================

- Clone the latest [JSIO code](https://github.com/alanshaw/JavaScript-Image-Optimiser/)
- Link to the JSIO library _at the bottom_ of your document: `<script src="js/jsio.js" data-res-url="/js/jsio-resources.js"></script>`
- Place the placeholder image (jsio.gif) in your website image directory
- [Use this tool to generate your resources file](http://alanshaw.github.com/JavaScript-Image-Optimiser/to-data-url.html). There is also a [grunt task](https://npmjs.org/package/grunt-jsio) that'll do this for you.
- Place the resources file at "/js/jsio-resources.js"
- Start using JSIO URLs in your `<img>` elements and background-image CSS declarations

[Advanced usage](https://github.com/alanshaw/JavaScript-Image-Optimiser/blob/master/doc/advanced-usage.md)

What's new in this version?
===========================

See the [changelog](https://github.com/alanshaw/JavaScript-Image-Optimiser/blob/master/CHANGELOG)

I have a question/suggestion/problem...
=======================================

Please [contact me](http://freestyle-developments.co.uk/contact) or [add an issue on GitHub](https://github.com/alanshaw/JavaScript-Image-Optimiser/issues)

...or check the [frequently asked questions](https://github.com/alanshaw/JavaScript-Image-Optimiser/blob/master/doc/faq.md)