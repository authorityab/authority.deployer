var socket = io();

socket.on('setStatus', function(data) {
	console.log('status received in client: ' + JSON.stringify(data));
	
	var list = $('ul li');
	//ul.remove('li');
	
	var d = JSON.parse(data);
	
	
	for (var i = 0; i < list.length; i++) {
		var listItem = $(list[i]);
		for (var y = 0; y < d.projects.length; y++) {
			var project = d.projects[y];
			if (listItem.data('id') == project.id) {
				listItem.attr('class', project.status == 1 ? "success" : "error");
			}
		}
//		ul.append('<li data-id="' + project.id + '" class="' + project.status == 1 ? "success" : "error" + '">' + project.name + '</li>');
	}
});

socket.on('test', function(input) {
	console.log('test received in client: ' + input);
});


var button = document.getElementById('test');

button.addEventListener('click', function() {
	socket.emit('send', 'testing');
});