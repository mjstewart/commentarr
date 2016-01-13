# commentarr
Is a personal project I developed to learn/explore a variety of frontend/backend technologies with the primary focus on creating a production ready application that is intuitive for the user.

[Please checkout my live demo on YouTube](https://github.com/furqanZafar/react-selectize)

## What's the application do?
Comentarr is a single page web application allowing users to create new comments which get displayed in a comment feed.

Users can perform a variety of editing actions 
 * up/down voting 
 * deleting and reporting comments to be investigated by moderators 
 * Sort/filter the way the comment feed is displayed

The client and server communicate using websockets resulting in users receiving real time notifications for any new comment activity.

## Technologies 

### Workflow tools
- nodejs/npm for package management
- gulp
- gradle with a few extra plugins

gulp made development faster through running tasks which transformed javascript ES6 and bundled the output using browserify which was automatically loaded into the browser using browser sync. 

### Front end
* react js
* Immutable js
* javascript ES6
* node js (EventEmitter)
* jquery
* twitter bootstrap
* moment js
* [react-selectize](https://github.com/furqanZafar/react-selectize)
* animate css

### Back end
* Java EE 7 websockets		  
* JSR 353 Java API for Processing JSON		
* jackson (transforming between java entities and json)		
* mongo db		   
* morphia (java entity to mongo document mapping and back) 		
* Wildfly application server

## Deployment
I used gradle to build the war and [gradle-ssh-plug](https://gradle-ssh-plugin.github.io/) to automatically deploy to wildfly running on a ubuntu server located on home network. 

## How it all works
[View my part 2 YouTube video](https://github.com/furqanZafar/react-selectize)

  
