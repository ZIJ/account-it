(function(){

	var baseUrl = 'http://localhost:3000/';

	var newRoom = {
		name: 'New Room',
		operations: [{
			name: 'Operation 1',
			amount: 100,
			contributions: [{
				person: 'Loh',
				paidAmount: 100,
				ownsAmount: 0
			},{
				person: 'Pidr',
				paidAmount: 0,
				ownsAmount: 0
			}]
		},{
			name: 'Operation 2',
			amount: 100,
			contributions: [{
				person: 'Loh',
				paidAmount: 10,
				ownsAmount: 0
			},{
				person: 'TNK',
				paidAmount: 50,
				ownsAmount: 0
			}]
		}]
	};

	this.api = {
		root: function(){
			$.ajax({
				url: baseUrl,
				method: 'GET'
			}).done(function(response){
				console.log(response);
			});
		},

		all: function(){
			$.ajax({
				url: baseUrl + 'roomIds',
				method: 'GET',
			}).done(function(response){
				console.log(response);
			});
		},

		room: function(id){
			$.ajax({
				url: baseUrl + 'room/' + id,
				method: 'GET'
			}).done(function(response){
				console.log(response);
			});	
		},

		create: function(){
			$.ajax({
				url: baseUrl + 'room',
				method: 'PUT',
				data: newRoom
			}).done(function(response){
				console.log(response);
			});
		},

		update: function(id, room){
			$.ajax({
				url: baseUrl + 'room/' + id,
				method: 'POST',
				data: room
			}).done(function(response){
				console.log(response);
			});
		},

		del: function(id){
			$.ajax({
				url: baseUrl + 'room/' + id,
				method: 'DELETE'
			}).done(function(response){
				console.log(response);
			});	
		}
	}

}());