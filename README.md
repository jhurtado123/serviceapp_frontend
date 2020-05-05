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
Create and app with react that connects the community of neighbours by helping each other with his knowledge.
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

**Ad edit** - As a user I want to edit the ad details.

**Ad delete** - As a user I want to delete an ad.
 
**Hire Ad** - As a user I want to be able to hire an Ad.
 
**Chat** - AS a User I want to be able to chat with other users to negotiate the conditions of the ad.

**Notifications** - AS a User I want to be able to see the notifications of my user.
 
**Buy Tokens** - As a User I want to be able to buy more tokens.
 
**Rewards Page** - As a User I want to see my own level and the next rewards I will have and the statistics of my user.
​
​
## Backlog
​
List of other features outside of the MVPs scope:

Chat

A complete system of Rewards and Levels for the users.

## ROUTES:
​
### Endpoints Auth
​
​
|Method| Path      				| description      | Body                     |
|------| -----------------| -----------------| ------------------------ |
| GET  | `/whoami` 				| who am i         |                          |
| POST | `/signup` 				| signup a user    | `{ username, password }` |
| POST | `/login`  				| login a user     | `{ username, password }` |
| GET  | `/logout` 				| logout session   |                          |

​
##VIEWS
​
| View(Component) 	| Path             | Description              |
| ------------------| -----------------| ------------------------ |
|	Home	      			| `/`              | home                     |
| Signup		        | `/signup`        | signup page 	   					|
| Login		          | `/login`         | login page 	   					|
| AdList				    | `/ads`           | list of ads              |
| AdCreate          | `/ad/create`     | create and ad page       |
| AdDetail				  | `/ad/:id`        | detail of an ad       		|
| AdEdit            | `/ad/:id/edit`   | edit and ad              |
| Favourites        | `/favourites`    | list of favourite ads    |
| Profile		        | `/profile/:id`   | user profile 	   				|
| ProfileEdit       |`/profile/edit`   | edit user profile        |
| ChatList				  | `/chats`         | chat list       		      |	
| Chat	            | `/chat/:id`	     | chat page          		  |   
| Rewards           | `/rewards`    	 | rewards page 				    |
| Notifications     | `/Notifications` | notifications page       |

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
