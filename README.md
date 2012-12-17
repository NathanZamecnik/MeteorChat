#The basic structure is:#

##Chatapp: Controls the entire app, the root node of the application##
##Newuser: Controls a user creating their name - new securuty is being used, just whatever name they want##
##Chatmanager: Controls creating a channel, switching channels and logging out of the system##
##Chatroom: Controls the chatroom the user is currently subscribed to.##
##Settings: Configuration driver data can be added here##

##DB Collections:##
##Users: A container of users that are logged in##
##Chatrooms: A list of all chatrooms in the system##
##Chatroom: The chatroom currently being used##

###This is a very basic and prototypical structure.  The next phase is to create a more proper DB schema for better performace.  Currently the system would have a hard time under a large load as no keys have been set and the Chatroom collection can grow very rapidly as it contains all the messages.###