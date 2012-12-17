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

 Template.roomcreate.chatrooms = function() {
    return Chatrooms.find({});
  }

 Template.roomcreate.events({
  	'click input.chatroom_submit' :  function() {
  		var newchat_name = document.getElementById('newchat_input').value;
  		//validate this content 
  		//Does the chatroom already exist?
  		//Are the characters legal and encoded?
  		console.log(newchat_name);
  		Chatrooms.insert({'chan':newchat_name});
  		document.getElementById('newchat_input').value = "";
  		Users.update({'_id' : Session.get('userid')},{'name':Session.get('username'),'chatroom':newchat_name});
      	Session.set('current_room',newchat_name);
  	},

  	//this is the event when someone enters a room
  	'change select.chatroom_select ' : function() {
      var e = document.getElementById("newchat_select");
      var chatroom = e.options[e.selectedIndex].value;
      //Update the chatroom field from the user collection
      //NOTE THAT UPSERTS ARE NOT AVAILABLE IN METEOR YET
      //Validate this content as well
      Users.update({'_id' : Session.get('userid')},{'name':Session.get('username'),'chatroom':chatroom});
      Session.set('current_room',chatroom);
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