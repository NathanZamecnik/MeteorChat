/*
Chatrooms collection contains all the various rooms that users
make.
*/
Chatrooms = new Meteor.Collection('chatrooms');

if(Meteor.isClient) {
 //this will allow the user to subscribe to a channel of messages
 Meteor.autosubscribe(function() {
 	Meteor.subscribe('chatrooms');
 });

//Return all Chatrooms for now as private chats have not been implemented
 Template.chatmanager.chatrooms = function() {
    return Chatrooms.find({});
  }

 Template.chatmanager.events({
  	'click input.chatroom_submit' :  function() {
  		var newchat_name = document.getElementById('newchat_input').value;
  		if(newchat_name === "") return;

  		if(Chatrooms.find({'chan':newchat_name}).count() === 0) {
	  		Chatrooms.insert({'chan':newchat_name});
	  		document.getElementById('newchat_input').value = "";
	  		Users.update({'_id' : Session.get('userid')},{'name':Session.get('username'),'chatroom':newchat_name}, function() {
		      	Session.set('current_room',newchat_name);
		      	document.getElementById("newchat_select").value = newchat_name;
	  		});
      	}

      	else {
      		//would be better to implement this as a validation item
      		alert("That room already exists!");
      	}
  	},

  	//this is the event when someone enters a room
  	'change select.chatroom_select ' : function() {
      var e = document.getElementById("newchat_select");
      var chatroom = e.options[e.selectedIndex].value;
      var previousroom = Session.get('current_room',chatroom);
      //Update the chatroom field from the user collection
      //NOTE THAT UPSERTS ARE NOT AVAILABLE IN METEOR YET
      //Validate this content as well
      Users.update({'_id' : Session.get('userid')},{'name':Session.get('username'),'chatroom':chatroom}, function() {
      	var msg = Session.get('username') + " has entered the room";
		Chatroom.insert({'chatroom':Session.get('current_room'), 'message':msg, 'user':GLOBAL_SYSTEMNAME})
      });

      Session.set('current_room',chatroom);
      if((Users.find({'chatroom':previousroom}).count() === 0)&& GLOBAL_DEFAULTCHATROOM !== previousroom) {
      	//get rid of the room as it is empty.  But not if it is General Chat
      	Chatrooms.remove({'chan':previousroom},function() {
      		console.log("Destroying: " + previousroom);
      	});
      }
    },

    //'click a.namechange' : function() {
    	//hide the chat and show the name entry screen
	//	serviceUser();  
    //},

    //Do this async
    'click a.logout' : function() {
		Users.remove({_id:Session.get('userid')},function() {
				document.getElementById('chatroomview').style.display = 'none';
	    		document.getElementById('userview').style.display = 'block';   
		});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //clear the db and then load the new defaults
    Chatrooms.remove({});
    Chatrooms.insert({'chan':GLOBAL_DEFAULTCHATROOM});
    Session.set('current_room',GLOBAL_DEFAULTCHATROOM);
    console.log('Created channel: '+ GLOBAL_DEFAULTCHATROOM);
  });

  //publish the chatrooms and only return the name, hiding
  //any other document data
  Meteor.publish('chatrooms', function(chan) {
  	return Chatrooms.find({},{'chan':1})
  });
}