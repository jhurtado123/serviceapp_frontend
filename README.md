# serviceapp_frontend

# serviceapp_api

## Instructions how to start
​
create `.env` file like the example `.env.sample`
​
start with `npm run start-dev`
​
## Description
​
It's an app for posting ads or/and hiring neighbours of your City to do little jobs like fixing a pipe. The user will pay with tokens. It has a reward system.
​
## Motivation
​
Connect the community of neighbours by helping each other with his knowledge.
​
## User Stories
​
**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
 
**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
 
**Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
 
**Sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
 
**Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
 
**Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
 
**Ad list** - As a user I want to see all the ads available so that I can choose which ones I want to hire.
 
**Ad create** - As a user I want to create an ad so that I can offer my services to others.
 
**Ad detail** - As a user I want to see the ad details and been able to contact the Publisher
 
**Hire Ad** - As a user I want to be able to hire an Ad.
 
**Chat** - AS a User I want to be able to chat with other users to negotiate the conditions of the ad.
 
**Buy Tokens** - As a User I want to be able to buy more tokens.
 
**Rewards Page** - As a User I want to see my own level and the next rewards I will have and the statistics of my user.
​
​
## Backlog
​
List of other features outside of the MVPs scope
​
A complete system of Rewards and Levels for the users.
​
## ROUTES:
​
### Endpoints Auth
​
​
| Method | Path      				| description      | Body                     |
| :----: | -----------------| -----------------| ------------------------ |
|  GET   | `/whoami` 				| who am i         |                          |
|  POST  | `/signup` 				| signup a user    | `{ username, password }` |
|  POST  | `/login`  				| login a user     | `{ username, password }` |
|  GET   | `/logout` 				| logout session   |                          |
|	 GET	 | `/home` 					| homepage         | 				                  |
|  GET   | `/search` 				| search page      | 	`{filters }`            |
|  GET   | `/ad/:id` 				| ad details       |          		        		|
|  GET   | `/chats`  				| chat list        |          		            |	
|  GET   | `/chat/:id`			| chat page        |          		            |   
|  GET   | `/profile/:id`		| users profile    |  				   					    |
|  GET   | `/profile/edit` 	| edit user profile|                          |
|  PUT   | `/profile/edit`  | edit user profile| {userData}               |
|  PUT   | `/ad/:id/edit`   | edit ad   			 | {adData}                 |
|  PUT   | `/ad/:id/edit`   | edit ad          | {adData}                 |
|  GET   | `/rewards`       | rewards page   	 |  				                |
​
​
## Models
​
User model
​
```javascript
{
	username: String,
	password: String,
	name: String,
	role: Array,
	profile_image: String,
	description: String,
	level: Number,
	address: String,
	review: {
		content: String,
		rating: Number (1-5),
		userid: ObjectId<User>,
	}
}
```
​
Ad model
​
```javascript
{
	owner: ObjectId<User>,
	name: String,
	description: String,
	coords: { 
		lat: Number,
		lng: Number,
	}
	price: Number,
	tags: Array,
	category: Array,
	image: String,
	deletedad: DateTime,
	Appointment: {
		date: DateTime
		saler: ObjectId<User>
		buyer: ObjectId<User>
		status: String
	} 
}
```
​
Wallet model
​
```javascript
{
	owner: ObjectId<User>,
	tokens: Number,
	history: [{ 
		chatid: ObjectId<Chat>,
		tokens: Number,
	}]
}
```
​
Chat model
​
```javascript
{
	adid: ObjectId<Ad>,
	saler: ObjectId<User>,
	buyer: ObjectId<User>,
	pendingtokens: Number,
	description: String,
	Appointment: {
		type: Boolean,
		default: false, 
	}
}
```
​
Message model
​
```javascript
{
	chatid: ObjectId<Chat>,
	senderid: ObjectId<User>,
	content: String,
	type: String,
	isReaded: {
		type: Boolean,
		default: false, 
	}
}
```
​
SupportRequest model
​
```javascript
{
	saler: ObjectId<User>,
	buyer: ObjectId<User>,
}
```
​
## Links
​
### Trello
​
[Trello Link](https://trello.com/b/ELsOwVbZ/service-app)
​
​
### Git
​
The url to your repository and to your deployed project
​
[Repository Link](http://github.com/)
​
[Deploy Link](http://heroku.com/)
​
### Slides
​
[Slides Link](https://docs.google.com/presentation/d/1lnLebQ2o0SofNHN8B77YxNNC8vylQxxiyYbOebgMRSk/edit?usp=sharing)
