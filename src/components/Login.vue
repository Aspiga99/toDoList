<template lang="html">
  <div id="log-from">
    <img style="display: none;" src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
    <form>
      <h4>Accedi</h4>
      <input id="userEmail" type="text" v-on:keyup="checkIfEmptyFields" placeholder="Email" v-model="user.email" required>
      <input id="userPassword" type="password" v-on:keyup="checkIfEmptyFields" placeholder="Password" v-model="user.password" required>
      <span class="error" v-if="messageNotValidUser">* indirizzo email o password errati</br></span>
      <span class="error" v-if="emptyFields">* Compilare tutti i campi</span>

      <button id="loginButton" v-on:click.prevent="login" class="btn btn-primary">
        Accedi
        <img id="loadingGif" v-if="loading" src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
      </button></br>
      <div id="text">
        <span><b>O</b></span>
      </div>
      <div id="googleBtn">
        <button type="button" class="google-button" @click.prevent="googleLogin">
          <span class="google-button__icon">
            <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg"><path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335"/><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05"/><path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4"/><path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853"/></svg>
          </span>
          <span class="google-button__text">Accedi con Google</span>
        </button>
      </div>
      <div id="resetPassword">
        <a href="/resetPassword">Password dimenticata?</a>
      </div>
    </form>
  </div>
</template>

<script>
import { auth, firebase, database } from "../config/firebase_config.js"
const loadingImage = new Image();
loadingImage.src = "https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true";


export default {
  data(){
    return{
      user:{
        email: "",
        password: ""
      },
      messageNotValidUser: false,
      emptyFields: true,
      validUser: false,
      loading: false
    }
  },
  created(){
    this.$nextTick( () => {
      this.checkIfEmptyFields();
    });
  },
  methods: {
    login: function(){
      // here is the Vue code
      this.loading = true;
      this.$nextTick( () => {
        auth.signInWithEmailAndPassword(this.user.email, this.user.password).then( (user) => {
          console.log("signed in");
          this.messageNotValidUser = false;
          this.validUser = true;
          this.loading = false;
          // this.$router.push("/projects");
        }, (err) => {
          this.messageNotValidUser = true;
          this.valdiUser = false;
          this.loading = false;
          console.log(err.message);
        });
        console.log("check:" + this.validUser);
      });

    },
    checkIfEmptyFields: function(){
      if(this.user.email == "" || this.user.password == ""){
        this.emptyFields = true;
      }
      else {
        this.emptyFields = false;
      }
    },
    goToPage: function(page){
      if(page != undefined && page != null)
        this.$router.push(page);
    },
    googleLogin: function(){
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then( (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        if(user){
          this.$parent.loggedWithGoogle = true;
          user.providerData.forEach( (profile) => {
            this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/information.json").then( (data) => {
              return data.json();
            }).then( (data) => {
              if(data == null){
                database.ref('users/' + user.uid + "/information").set({
                  email: profile.email,
                  name: profile.displayName
                });
              }
            });
          });
        }
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  }
}
</script>

<style lang="css" scoped>
svg{
  vertical-align: initial;
}
#text{
  margin:auto;
  margin-bottom: 5px;
  margin-top: -20px;
  width: 10px;
}
#text > span{
  font-size: 12px;
}
#googleBtn{
  margin: auto;
  width: 200px;
}
.google-button {
  height: 40px;
  border-width: 0;
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0,0,0,0.05);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;

  &:focus,
  &:hover {
    box-shadow: 1px 4px 5px 1px rgba(0,0,0,0.1);
  }

  &:active {
    background-color: #e5e5e5;
    box-shadow: none;
    transition-duration: 10ms;
  }
}

.google-button__icon {
  display: inline-block;
  vertical-align: middle;
  margin: 8px 0 8px 8px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
}


.google-button__text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 24px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto',arial,sans-serif;
}

.error{
  color: red;
  font-size: 12px;
}

h4{
  text-align: center;
}
#loadingGif{
  width: 20px;
  height: 20px;
}

input[type="text"], input[type="password"]{
  padding: 8px;
  margin: auto;
  margin-top: 20px;
  display: block;
  width: 100%;
}

#loginButton{
  margin: auto;
  margin-top: 20px;
  display: block;
  width: 200px;
  border-radius: 20px!important;

}


form{
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
}

#resetPassword{
  margin: auto;
  width: 70%;
}
</style>
