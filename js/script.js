$(function(){
	
	var resources = $('#resources');
	
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		
		var jsioResources = $('#jsio-resources');
		
		resources.change(function(evt) {
			
			var files = evt.target.files,
				flen = files.length,
				unreadFiles = flen,
				prefix = $('#prefix').val(),
				dataUrls = [];
			
			for(var i = 0; i < flen; ++i) {
				readFile(files[i]);
			}
			
			function readFile(file) {
				
				var reader = new FileReader();
				
				reader.onload = function(evt) {
					
					dataUrls.push('"' + prefix + file.name + '":"' + reader.result + '"');
					unreadFiles = unreadFiles - 1;
					
					if(unreadFiles == 0) {
						jsioResources.val('jsio.resources={' + dataUrls.join(',') + '}');
					}
				};
				
				reader.readAsDataURL(file);
			}
		});
		
		$('#select-all').click(function() {
			jsioResources[0].select();
		});
		
	} else {
		
		if(resources.length)
			alert('Can\'t generate JSIO resources file: The File APIs are not fully supported in this browser.');
	}
});
