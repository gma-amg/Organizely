# Organizely

Organize your life with Organizely! Plan your day using our simple event planner calendar. Create 1-to-1 video chat meetings with anyone across the globe!

## Index

An index since this readme file got a tad too long.
| Contents |
| ------------- |
| [Technologies Used](https://github.com/gma-amg/Organizely/blob/main/README.md#technologies-used) | 
| [Demo](https://github.com/gma-amg/Organizely/blob/main/README.md#demo) |
| [Features](https://github.com/gma-amg/Organizely/blob/main/README.md#features) |
| [Run Locally](https://github.com/gma-amg/Organizely/blob/main/README.md#run-locally) |
| [Acknowledgements](https://github.com/gma-amg/Organizely/blob/main/README.md#acknowledgements) |
| [Author](https://github.com/gma-amg/Organizely/blob/main/README.md#author) |

## Technologies Used

* WebRTC
* SocketIO
* PeerJS
* NodeJS
* ExpressJS
* Jquery
* Bootstrap
* Firebase






## Demo

https://organizely.herokuapp.com/

Sign in with either your Google account or email and password, and check, create or delete events from your calendar in your dashboard.

![](https://media.giphy.com/media/PHw0KqmhWKH1mlQdiG/giphy.gif)

Create 1-on-1 meeting rooms where you can video call, chat, and screenshare.

![](https://media.giphy.com/media/pxCeJoRC76LhEiiqkn/giphy.gif)



  
## Features

- Video conferencing rooms with screen share and chat functionalities
- Authentication with Firebase Session Cookies
- Event planner calendar

  
## Run Locally

Clone the project

```bash
  git clone https://github.com/gma-amg/Organizely.git
```

Go to the project directory

```bash
  cd Organizely
```

Install dependencies

```bash
  npm i
```

Instal PeerJS globally

```bash
  npm i -g peerjs
  npm i peer -g
```

Run server

```bash
  nodemon server.js
```

Run PeerJS server in separate terminal

```bash
  peerjs --port 3031
```

For Authentication part, you first need to create a new project in [Firebase Console](https://console.firebase.google.com/). Then, create a web app an copy the config variables to add to firebase.js file. Then, create a service account and generate a new private key. Add this json file in place of the empty serviceAccountKey.json file. Then, go to authentication and enable Email/Password and Google sign in. 


![](https://media.giphy.com/media/5elu7pEm5nD9tJIz1x/giphy.gif)


The app is now ready to run locally!

Open browser and go to [localhost:3031](localhost:3031).

  
## Acknowledgements

Couldn't have made this app without all the open source repositories, tutorials and stackoverflow answers. Some special acknowledgements to these resources:

 - [Video Conference App](https://github.com/Somsubhra1/Video-Conference) - [@Somsubhra](https://github.com/Somsubhra1) [@Kinjal](https://github.com/Kinjalrk2k)
 - [Creating your own Chatroom with SocketIO and NodeJS](https://dev.to/ibmdeveloper/creating-your-own-chat-room-with-react-node-and-socket-io-in-the-cloud-part-1-13dg)
 - [Server Side Firebase Authentication](https://www.youtube.com/watch?v=kX8by4eCyG4&ab_channel=MaksimIvanov) - [@Maksim Ivanov](https://github.com/satansdeer)
 - [Black Dashboard Bootstrap Template](https://demos.creative-tim.com/black-dashboard/docs/1.0/getting-started/introduction.html) - [@Creative Tim](https://www.creative-tim.com/)

  
## Author

- [Garima Mazumdar](https://www.github.com/gma-amg)