Small crud app to try out a few different technologies across the full stack. 

Users can perform a variety of editing actions 
 * up/down voting 
 * deleting and reporting comments to be investigated by moderators 
 * Sort/filter

[Live demo](https://www.youtube.com/watch?v=M-Rp_Aa4aSA&list=PLhdEaT6EIivpelbIn9ePcGxBykXnvmzGl&index=2)

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
* jackson 
* mongo		   
* morphia (java entity to mongo mapping) 		
* Wildfly

## Deployment
Gradle to build the war and [gradle-ssh-plugin](https://gradle-ssh-plugin.github.io/) for deployment into wildfly. 
