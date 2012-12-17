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

  Template.newuser.events({
    'keypress input.newuser' : function(e) {
      if(e.keyCode === 13) {
        var new_user_name = document.getElementById("nameinput").value;

        if(new_user_name === "") return;
        
        //Make sure the username is being used
        if(Users.find({'name':new_user_name}).count() === 0) {
          var userid = Users.insert({'name':new_user_name,'chatroom':GLOBAL_DEFAULTCHATROOM}, function () {
            document.getElementById('chatroomview').style.display = 'block';
            document.getElementById('userview').style.display = 'none';        
          });
          Session.set("username",new_user_name);
          Session.set('userid',userid);
          Session.set('current_room',GLOBAL_DEFAULTCHATROOM);
        }

        else {
          alert('Username already exists!');
        }
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