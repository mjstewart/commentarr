# commentarr
Is a personal project I developed to learn/explore a variety of frontend/backend technologies while having enough depth to challenge myself in new workflows and web application architechture.

[Please check out my live demo on YouTube](https://www.youtube.com/watch?v=M-Rp_Aa4aSA&list=PLhdEaT6EIivpelbIn9ePcGxBykXnvmzGl&index=2)

[View part 2 (implementation overview)](https://www.youtube.com/watch?v=QRV2GdkV-tk&index=1&list=PLhdEaT6EIivpelbIn9ePcGxBykXnvmzGl)


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
I used gradle to build the war and [gradle-ssh-plugin](https://gradle-ssh-plugin.github.io/) to automatically deploy to wildfly running on a ubuntu server located on my home network. 

## How it all works
[View my part 2 YouTube video](https://www.youtube.com/watch?v=QRV2GdkV-tk&index=1&list=PLhdEaT6EIivpelbIn9ePcGxBykXnvmzGl)

## Reflections
I now see the benefit of using a redux style architecture to manage state.
