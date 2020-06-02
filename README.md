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
## VIEWS
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


# MANUAL
Serkens is an app for offering and hiring services from other neighbours of your city. These services are little jobs such as fix a pipe, paint a house, etc. 

When you open Serkens, you first see the homepage. But if you don’t login, you could not do many things. To Login or Register, you have to access the burger menu.

## Login page

Username field, Password field and button of login. You can’t leave any field empty to continue.

A test user to Login: username: Cristina and password: 1234


## Register

In this page, you have to complete all the fields to create an account. The fields are Name, Username, Password and Postal Code. The postal code is to localize your position and to get your city.

## Homepage

In the homepage, you have a Burger menu, Search Bar, Filter Button, Most Popular Categories, Bests Ads, Recently Viewed and the Bottom Menu.

### Burger Menu:

-   Number of Serkens (is the coin of the app)

-   Profile image and username

-   Button to go to edit your profile and the button of logout.

-   Link to My Appointments

-   Link to My Ads

-   Link to My Chats

-   Link to My Rewards

-   Link to My Favourites Ads

-   Link to My Notifications

-   Link to Buy Serkens

-   Link to Backoffice (Exclusive for Role Admin users user: jose, password: admin)

### Search Bar
To search ads

###   Filter button
Shows a container to filter the ads by Price, Distance, Category and the option to order by distance or price.

### Most Popular Categories: 
Slider of the categories with more ads published.

### Best Ads: 
Slider of the best rated ads

### Recently Viewed: 
Slider of the last ads the user has seen.


### Bottom Menu:
-   Home icon: Link to Home page

-   Calendar icon: Link to My appointments

-   + icon: Link to Create and ad

-   Notification icon: Link to Notification

-   Chat icon: Link to Chats.


## Profile

The profile page is divided in three sections: Header Profile, Ads and Reviews. Furthermore, it includes the Burger Menu and the bottom Menu such as the Home page.


###   Header Profile:
-   Name of the user

-   Level

-   Profile Image

-   Serkens that the user has

-   The next reward in serkens and the points that you need to level up.


### Ads:
List of the ads that this user has published with a Link to the ad page.

### Reviews:
List of the reviews that other users made about this user.

## Ad page

-   < button: Link to the previous page

-   Image: Is the image of the Ad. If the user doesn’t upload any image, the ad has the category default image.

-   Star button: to add the ad to your Favourites.

-   Info of the owner.

-   Chat button: to start a Chat with the Owner.If you are the owner, is a button to edit the ad.

-   Info of the Ad: Title, Price, Location, Descriptión.

-   Button off Map: Opens a Map To see the position of the ad.

-   Category of the ad.

-   Tags of the Ad.

-   Related Ads by category.

## Ads page

The ad list page shows the list of the user ads. The page included a Burger Menu and a Search bar.

-   Search Bar: to search in the user list of ads.

-   List: with a button to edit and delete the ad.

## Category Page

The Category page includes two sections. Furthermore, the Burger Menu, The Search Bar, Filter Button and the Bottom Menu.

-   List: a list of all the ads of the category.

-   Map: a map with the position of the user and the position of the ads. If you click on the ad, it is linked to the ad page.

## Chats Page

The Chats page includes a list of all the Chats. Furthermore, the Burger Menu, The Search Bar, Filter Button and the Bottom Menu.

-   List of chats: with the title of the Ad,the name of the owner and the number of the message.

## Chat page

The Chat page is divided in header and the chat.

### Header:

-   < Button: Link to the previous page.

-   Name of the Ad and Price in Serkens.

-   Negotiate Price Button: When the user clicks, appears a Pop up to renegotiate the price of the Service. In this Pop up, the user has the number serkens, he owns. The price and a bar to change the price and a button to propose a change of the price. This option is available for the user who offers the service and for the user who wants to hire the service. When a user does it, the other user has to accept it.

-   Deal Button: When the user clicks, appears a Pop up to select a Date and make a deal. When a user does it, the other user has to accept it.


### Chat: 
Where all the messages are displayed with the time. The user can send a message and a photo to inform about the service.
Chat messages are send in real time using a socket connection.
In chat page both users can renegotiate the final ad price in serkens and agree one date and hour to make the appointment.

## Notifications page

The notifications page is divided in three sections: Header, Search bar and list of notifications.

-   Header: with a button to go to the previous page and the Name of the page.

-   Search bar: to search in the list of notifications.

-   Notification List: List of the notifications with name of the notifications, Link to see the notification and the date. There are three types of notification: Reward, Chat and the service is ended.

## Appointments page

The appointment page is divided in three sections: Header, Search bar and list of appointments.

-   Header: with a button to go to the previous page and the Name of the page.

-   Search bar: to search in the list of notifications.

-   Appointment List: List of the appointment with name of the ad, link to see the ad and the date.

## Appointment page

The appointment page included a header, the information of the appointment and three buttons.

-   Header: with a button to go to the previous page and the Name of the page.

-   Map: with the location of the appointment

-   Information of the appointment: Name of the ad, username, location and date.

-   Button to Link to the Ad.

-   Button to Link to the Chat.

-   Button to cancel the Appointment.


## Favourites Ads page

The favourites ad list page shows the list of the user favourite ads. The page included a Header and a Search bar.

-   Header: with a button to go to the previous page and the Name of the page.

-   Search Bar: to search in the user favourite ads list.

-   List: with image of the ad, name of the ad, profile image of the owner and price.

## Rewards page

The rewards page has the same header of the Profile page and the List of Rewards.

-   List: the reward with the name of the reward, points, progress bar, and what needs the user to get the reward.

## Buy Serkens page

The Buy Serkens page with info about the serkens

-   Header: with a button to go to the previous page and the Name of the page.

-   Info about the serkens.

-   Bar to select the number of serkens the user wants.

-   Button to continue.

## Back office

The back office is only available to the role admin users. In the back office, the admin user can modify the Users, Ads, Categories, Levels, Mediations and Configuration. It works like a mongo Compass, you have all the information and you can edit or delete.

