<template lang="html">
  <div id="register-from">
    <form v-if="!userCreated">
      <h4>Registrati</h4>
      <input type="text" id="name" max-length="50" v-model="user.name" placeholder="inserisci nome" v-on:keyup="checkIfEmptyFields()" required>
      <input type="text" max-length="50" v-model="user.surname" placeholder="inserisci cognome" v-on:keyup="checkIfEmptyFields()" required>
      <input type="text" max-length="50" v-on:keyup="validEmail = checkEmail(user.email); checkIfEmptyFields()" v-model="user.email" placeholder="inserisci indirizzo email" required>
      <span class="errorMessage" v-if="!validEmail">* inserire un indirizzo email valido</span>
      <span class="errorMessage" v-if="userExists">* indirizzo email già esistente</span>
      <input  id="input-password" type="password" v-on:keyup="validPassword = analysePassword(user.password); checkIfEmptyFields(); equalPassword = checkIfEqualString(user.password, passwordReEntered);"  v-model="user.password" placeholder="inserisci password" required>
      <span class="errorMessage" v-if="!validPassword">* La password deve essere di almeno 6 caratteri e contenere almeno 1 carattere Maiuscolo, 1 carattere minuscolo e 1 numero</br></span>
      <input type="password" v-on:keyup="equalPassword = checkIfEqualString(user.password, passwordReEntered); checkIfEmptyFields()" v-model="passwordReEntered" placeholder="reinserisci password" required>
      <span class="errorMessage" v-if="!equalPassword">* le password inserite non corrispondono</br></span>
      <span class="errorMessage" v-if="emptyFields">* compilare tutti i campi</span>

      <button id="registerButton" v-on:click.prevent="createUser" class="btn btn-primary">
        Registrati
        <img id="loadingGif" v-if="creatingUser" src="https://github.com/Aspiga99/toDoList/blob/master/assets/images/loading.gif?raw=true"/>
      </button>
    </form>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
export default {
  props:["testing"],
  data(){
    return{
      user:{
        email: "",
        password: "",
        name: "",
        surname: ""
      },
      passwordReEntered: "",
      validPassword: false,
      equalPassword: true,
      userExists: false,
      validEmail: false,
      userCreated: false,
      emptyFields: true,
      creatingUser: false,
      validData: false
    }
  },
  updated(){

  },
  created(){
    this.analysePassword(this.user.password);
    if(!this.testing){
      this.$nextTick( () => {
        this.checkIfEmptyFields();
      });
    }
    this.userExists = false;
  },
  methods: {
    // check is the email is valid or not
    checkEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var validEmail = re.test(email);
      return validEmail;
    },
    // create the user user in firebase
    createUser: function(){
        if(this.validPassword && this.equalPassword && this.validEmail && !this.emptyFields){
          this.validData = true;
          this.creatingUser = true;
          if(!this.testing){
            auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then( (user) => {
              if(user){ //the user has been created
                // the user is created
                this.userCreated = true;
                //there aren't empty fields
                this.emptyFields = false;
                // the user not exists
                this.userExists = false;
                auth.onAuthStateChanged( (user) =>{
                  if(user){
                    this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/information.json").then( (data) => {
                      return data.json();
                    }).then( (data) => {
                      if(data == null){
                        console.log("aaa");
                        database.ref('users/' + user.uid + "/information").set({
                          email: this.user.email,
                          name: this.user.name,
                          surname: this.user.surname
                        });
                      }
                      this.creatingUser = false;
                    });
                  }
                });
                alert("Il tuo account è stato creato! \n Ora puoi creare i tuoi progetti nella home");

              }
            }, (err) => {
              this.creatingUser = false;
              // the hasn't beed created
              this.userCreated = false;
              // the user already exists
              this.userExists = true;
              console.log(err.message);
            });
          }
          else {
            console.log("test... dati validi e utente creato");
          }
        }
        else {
          if(this.testing){
            this.validData = false;
          }
          else {
            this.validData = false;
            this.userCreated = false;
            this.validPassword = this.analysePassword(this.user.password);
            this.validEmail = this.checkEmail(this.user.email);
            this.checkIfEmptyFields();
            alert("dati non validi");
          }
        }
    },
    // check if the password is valid
    analysePassword: function(password){
      if(password != undefined && password != null){
        var re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
        var check = re.test(password);
        return check;
      }
      else {
        return false;
      }
    },
    //check if the string has the min length
    checklengthString: function(s, minlength){
      if(s != undefined && s != null && minlength > 0){
        if(s.length < minlength){
          // the string is short
          return true;
        }
        else {
          // the string length is good
          return false;
        }
      }
      else
        return false;
    },
    //check if s1 and s2 are equal
    checkIfEqualString: function(s1, s2){
      if(s1 != undefined && s1 != null && s2 != undefined && s2 != null){
        if(s1 === s2)
          return true;
        else
          return false
      }
      else {
        return false;
      }
    },
    checkIfEmptyFields: function(){
      if(this.user.name == "" || this.user.surname == "" || this.user.email == "" || this.user.password == "" || this.passwordReEntered == ""){
        this.emptyFields = true;
        document.getElementById("registerButton").disabled = true;
      }
      else{
        this.emptyFields = false;
        document.getElementById("registerButton").disabled = false;
      }
    }
  }
}
</script>

<style lang="css" scoped>
#loadingGif{
  width: 20px;
  height: 20px;
}

.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px!important;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.33;
  border-radius: 25px!important;
}
#info-password{
  height: 44px;
  float: right;
}
.errorMessage{
  color: red;
  font-size: 12px;
}
h4{
  text-align: center;
}

input[type="text"], input[type="password"]{
  padding: 8px;
  margin: auto;
  margin-top: 20px;
  display: block;
  width: 100%;
}

#registerButton{
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
</style>
