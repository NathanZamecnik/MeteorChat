/*
Users are created when someone make a name for themselves
*/
Users = new Meteor.Collection('users');

if (Meteor.isClient) {

  Meteor.autosubscribe(function() {
    Meteor.subscribe('users');
  });

  Template.newuser.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
    }

  //run events on both sides
  Template.newuser.events({
    'keypress input.newuser' : function(e) {
      if(e.keyCode === 13) {
      var new_user_name = document.getElementById("nameinput").value;
      //do some validation here on the user name
      //is it OK for 2 users to have the same name?
      //Also, if OK then hide the 
      //console.log('user: ' + new_user_name);
      //add the new user and put them in general chat
      var userid = Users.insert({'name':new_user_name,'chatroom':GLOBAL_DEFAULTCHATROOM}, function () {
        Session.set("username",new_user_name);
        document.getElementById('chatroomview').style.display = 'block';
        document.getElementById('userview').style.display = 'none';        
      });
      Session.set('userid',userid);
      Session.set('current_room',GLOBAL_DEFAULTCHATROOM);
      }
    }
  });
}

if(Meteor.isServer) {
  Meteor.startup(function () {
    //clear the db and then load the new defaults
    Users.remove({});
    console.log('Removed all users');
  });

  Meteor.publish('users', function(){
    return Users.find({});
  })
}