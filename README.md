CRUD web app to practice front/backend development 

[Live demo](https://www.youtube.com/watch?v=M-Rp_Aa4aSA&list=PLhdEaT6EIivpelbIn9ePcGxBykXnvmzGl&index=2)

Users can perform a variety of editing actions 
 * up/down voting 
 * deleting and reporting comments to be investigated by moderators 
 * Sort/filter the way the comment feed is displayed

Websockets are used to receive real time notifications for any new comment activity.

## Technologies 

### Workflow tools
- gulp
- gradle

### Frontend
* react
* Immutable js
* ES6
* node js (EventEmitter)
* jquery
* bootstrap
* moment js
* [react-selectize](https://github.com/furqanZafar/react-selectize)
* animate css

### Backend
* Java EE 7 websockets		  
* JSR 353 Java API for Processing JSON		
* jackson 
* mongo		   
* morphia (java entity to mongo mapping) 		
* Wildfly

## Deployment
Gradle to build the war and [gradle-ssh-plugin](https://gradle-ssh-plugin.github.io/) to automatically deploy to wildfly running on a ubuntu server located on my home network. 
