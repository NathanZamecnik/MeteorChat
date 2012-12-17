Chatroom = new Meteor.Collection('chatroom');
/*
{
	chatroomname : string,
	users : [array],
	message -> point to messages collection?
}
*/
if(Meteor.isClient) {	
		//$(".chatmessagewrapper").scrollTop($(".chatmessagewrapper")[0].scrollHeight);

	Meteor.autosubscribe(function() {
		Meteor.subscribe('chatroom');
	});

	Template.chatroom.helpers({
		'currentroom':	function() {
			console.log(Session.get('current_room'));
			return Session.get('current_room'); 
		},

		'messages': function() {
			return Chatroom.find({'chatroom':Session.get('current_room')});
		}
	});

	Template.chatroom.chatusers = function() {
		//return all users in the current users room
		//this is the lazy method right now
		console.log(Session.get('current_room'));
		return Users.find({'chatroom':Session.get('current_room')});
	}

	Template.chatroom.events({
		'keypress input.chatinput' : function(e) {
			//only fire when the return key is pressed
			if(e.keyCode === 13) {
				var msg = document.getElementById('chatinputfield').value;
				console.log(Session.get('current_room') + msg);

				if(msg === '/clear') {
					Chatroom.remove({'chatroom':Session.get('current_room')},function() {
					document.getElementById('chatinputfield').value = '';
					window.scrollTo(0, document.body.scrollHeight);
					})
				}

				else {
				Chatroom.insert({'chatroom':Session.get('current_room'), 'message':msg, 'user':Session.get('username')}, function() {
					document.getElementById('chatinputfield').value = '';
					window.scrollTo(0, document.body.scrollHeight);
					})
				}
			}
		}
	});
}

if(Meteor.isServer) {
	 Meteor.startup(function () {
    //clear the db and then load the new defaults
    Chatroom.remove({});
    console.log('Cleared out old messages');
  	});

	Meteor.publish('chatroomusers', function(chan) {
	//look at the current_room session
	//
  	return Chatroom.find({'chatroomname':Session.get('current_room')},{'users':1});
  });

	Meteor.publish('chatroom', function() {
		return Chatroom.find({});
	});
}