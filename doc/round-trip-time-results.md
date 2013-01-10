One of the benefits of JSIO is that it can reduce the time it takes to load your web page. Since all your images are packaged up in a JSIO resources file, JSIO has to make only 1 request to retrieve that file. It means you save the round trip time for every image your browser would normally have to download. The round trip time is the time between sending a request and receiving a response. Technically, it includes all time taken to do TCP/IP handshaking, route your HTTP request over the network as well as the time taken for the server to process and begin responding to the request.

The following table shows the load time (in ms) of a website page by Firefox and Chrome. The "normal" column shows the time it took to load the page without JSIO. The "JSIO" column shows the time take to load the same page but using JSIO and JSIO URLs in img element src's.

There we around 60 images on the page. Load time on the normal page was the time it took to fire the window.onload event. Load time on the JSIO page was the time taken to load the JSIO lib, the JSIO resources file, plus the time taken by JSIO to process ALL JSIO URL's on the page.

This was performed in London, on an alleged 10Mbps (downstream) connection to a server in Manchester.

	| Normal | JSIO   |
	+========+========+
	| 2367   | 1024   |
	| 1003   | 951    |
	| 999    | 999    |
	| 914    | 1389   |
	| 1079   | 936    |
	| 1088   | 1029   |
	| 1084   | 967    |
	| 897    | 1001   |
	| 1260   | 1028   |
	| 1013   | 1062   |
	| 1045   | 932    |
	+--------+--------+
	| 1159   | 1029   |

This data shows that using JSIO could decrease your page load time by over 10%.