const firebaseConfig = {
    apiKey: "AIzaSyA7zSb5TZ-qTWOrTCsSszweKE-bPpoRfHU",
    authDomain: "organizer-4160c.firebaseapp.com",
    projectId: "organizer-4160c",
    storageBucket: "organizer-4160c.appspot.com",
    messagingSenderId: "718342037107",
    appId: "1:718342037107:web:fe878075c6d74b5bec1406",
    databaseURL:  "https://organizer-4160c-default-rtdb.firebaseio.com/",
    measurementId: "G-PR274B2S8G"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE); //setting firebase persistence to none as we are creating our own persistence layer with session cookies

var userFullNameFormate = /^([A-Za-z.\s_-])/;    
var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/; 

// xxxxxxxxxx Working For Sign Up Form xxxxxxxxxx
// xxxxxxxxxx Full Name Validation xxxxxxxxxx
function checkUserFullName(){
  var userSurname = document.getElementById("userFullName").value;
  var flag = false;
  if(userSurname === ""){
      flag = true;
  }
  if(flag){
      document.getElementById("userFullNameError").style.display = "block";
  }else{
      document.getElementById("userFullNameError").style.display = "none";
  }
}
// xxxxxxxxxx User Surname Validation xxxxxxxxxx
function checkUserSurname(){
  var userSurname = document.getElementById("userSurname").value;
  var flag = false;
  if(userSurname === ""){
      flag = true;
  }
  if(flag){
      document.getElementById("userSurnameError").style.display = "block";
  }else{
      document.getElementById("userSurnameError").style.display = "none";
  }
}
// xxxxxxxxxx Email Validation xxxxxxxxxx
function checkUserEmail(){
  var userEmail = document.getElementById("userEmail");
  var flag;
  if(userEmail.value.match(userEmailFormate)){
      flag = false;
  }else{
      flag = true;
  }
  if(flag){
      document.getElementById("userEmailError").style.display = "block";
  }else{
      document.getElementById("userEmailError").style.display = "none";
  }
}
// xxxxxxxxxx Password Validation xxxxxxxxxx
function checkUserPassword(){
  var userPassword = document.getElementById("userPassword");
  var flag;
  if(userPassword.value.match(userPasswordFormate)){
      flag = false;
  }else{
      flag = true;
  }    
  if(flag){
      document.getElementById("userPasswordError").style.display = "block";
  }else{
      document.getElementById("userPasswordError").style.display = "none";
  }
}

// xxxxxxxxxx Submitting and Creating new user in firebase authentication xxxxxxxxxx
function signUp(){
  var userFullName = document.getElementById("userFullName").value;
  var userSurname = document.getElementById("userSurname").value;
  var userEmail = document.getElementById("userEmail").value;
  var userPassword = document.getElementById("userPassword").value;     

  var checkUserFullNameValid = userFullName.match(userFullNameFormate);
  var checkUserEmailValid = userEmail.match(userEmailFormate);
  var checkUserPasswordValid = userPassword.match(userPasswordFormate);

  if(checkUserFullNameValid == null){
      return checkUserFullName();
  }else if(userSurname === ""){
      return checkUserSurname();
  }else if(checkUserEmailValid == null){
      return checkUserEmail();
  }else if(checkUserPasswordValid == null){
      return checkUserPassword();
  }else{
      firebase.auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(({ user }) => {
        return user.getIdToken().then((idToken) => {
          return fetch("/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
          });
        });
      })
      .then(() => {
        return firebase.auth().signOut();
      })
      .then(() => {
        Swal.fire("Account created successfully!")
        window.location.assign("/dashboard");
      }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          Swal.fire({
              type: 'error',
              title: 'Error',
              text: "Error",
          })
      });
  }
}
// xxxxxxxxxx Working For Sign In Form xxxxxxxxxx
// xxxxxxxxxx Sign In Email Validation xxxxxxxxxx
function checkUserSIEmail(){
  var userSIEmail = document.getElementById("userSIEmail");
  var flag;
  if(userSIEmail.value.match(userEmailFormate)){
      flag = false;
  }else{
      flag = true;
  }
  if(flag){
      document.getElementById("userSIEmailError").style.display = "block";
  }else{
      document.getElementById("userSIEmailError").style.display = "none";
  }
}
// xxxxxxxxxx Sign In Password Validation xxxxxxxxxx
function checkUserSIPassword(){
  var userSIPassword = document.getElementById("userSIPassword");
  var flag;
  if(userSIPassword.value.match(userPasswordFormate)){
      flag = false;
  }else{
      flag = true;
  }    
  if(flag){
      document.getElementById("userSIPasswordError").style.display = "block";
  }else{
      document.getElementById("userSIPasswordError").style.display = "none";
  }
}
// xxxxxxxxxx Check email or password exist in firebase authentication xxxxxxxxxx    
function signIn(){
  var userSIEmail = document.getElementById("userSIEmail").value;
  var userSIPassword = document.getElementById("userSIPassword").value;  

  var checkUserEmailValid = userSIEmail.match(userEmailFormate);
  var checkUserPasswordValid = userSIPassword.match(userPasswordFormate);

  if(checkUserEmailValid == null){
      return checkUserSIEmail();
  }else if(checkUserPasswordValid == null){
      return checkUserSIPassword();
  }else{
      firebase
        .auth()
        .signInWithEmailAndPassword(userSIEmail, userSIPassword)
        .then(({ user }) => {
            return user.getIdToken().then((idToken) => {
              return fetch("/sessionLogin", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({ idToken }),
              });
            });
          })
          .then(() => {
            return firebase.auth().signOut();
          })
          .then(() => {
            Swal.fire({
              type: 'successfull',
              title: 'Succesfully signed in', 
            })
            window.location.assign("/dashboard");
          }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          Swal.fire({
              type: 'error',
              title: 'Error',
              text: "Error"
          })
      });
  }
}

// xxxxxxxxxx Working For Sign Out xxxxxxxxxx
function signOut(){
  firebase.auth().signOut().then(function() {
      signedIn = false;
      // Sign-out successful.
      Swal.fire({
          type: 'successfull',
          title: 'Signed Out', 
      }).then((value) => {
          setTimeout(function(){
              window.location.replace("/");
          }, 1000)
      });
  }).catch(function(error) {
      // An error happened.
      let errorMessage = error.message;
      Swal.fire({
          type: 'error',
          title: 'Error',
          text: "Error",
      })
  });
}
