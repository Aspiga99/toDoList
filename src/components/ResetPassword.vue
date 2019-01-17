<template lang="html">
  <div class="container" id="resetDiv">
    <div v-if="!emailSent">
      <p id="msg1" class="h3">Hai dimenticato la password?</p>
      <p id="msg2">Inserisci qua sotto l'indirizzo email utilizzato nella fase di registrazione per la creazione del tuo account.
      Verrà inviato un link all'indirizzo email per creare una nuova password.</p>
      <form>
        <input type="text" name="userEmail" v-on:keyup="validEmail = checkEmail(userEmail)" v-model="userEmail" placeholder="inserire indirizzo email">
        <span class="errorMessage" v-if="!validEmail">* inserire un indirizzo email valido</span>
        <span class="errorMessage" v-if="!userExists">* indirizzo email non trovato</span>
        </br>
        <div class="row">
          <div class="col-sm">
            <button id="send" type="button" class="btn btn-primary submit" name="button" v-on:click.prevent="sendPasswordResetEmail">Invia</button>
          </div>
          <div class="col-sm">
            <button id="back" type="button" class="btn btn-secondary submit" name="button" v-on:click="goToPage('/signIn')">Torna Indietro</button>
          </div>
        </div>

      </form>
    </div>
    <div  v-if="emailSent">
      <h3>Ti è stata inviata un'email con il link per cambiare la password al tuo tuo indirizzo email!</h3>
      <button type="button" class="btn btn-secondary submit" name="button" v-on:click="goToPage('/signIn')">Torna Indietro</button>
    </div>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
export default {
  data(){
    return{
      userEmail : "",
      emailSent: false,
      validEmail: true,
      userExists: true
    }
  },
  methods:{
    // check is the email is valid or not
    checkEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var validEmail = re.test(email);
      return validEmail;
    },
    sendPasswordResetEmail : function(){
      var actionCodeSettings = {
        url: 'https://todolist-project99.firebaseapp.com/resetPassword?userEmail=' + this.userEmail
      };
      if(this.validEmail && this.userEmail != ""){
        auth.sendPasswordResetEmail(
        this.userEmail, actionCodeSettings)
        .then( () =>{
          // Password reset email sent.
          this.emailSent = true;
          this.userExists = true;
        })
        .catch( (error) => {
          // Error occurred. Inspect error.code.
          this.emailSent = false;
          console.log(error);
          if(error.code == "auth/user-not-found"){
            this.userExists = false;
          }
        });
      }
      else {
        this.validEmail = false;
      }
    },
    goToPage: function(page){
      this.$router.push(page);
    }
  }
}
</script>

<style lang="css" scoped>
.errorMessage{
  color: red;
  font-size: 12px;
}
form{
  width: 100%;
  max-width: 350px;
}
#resetDiv{
  width: 50%;
  max-width: 450px;
}
input[type="text"]{
  padding: 8px;
  margin-top: 20px;
  display: block;
  width: 100%;auth
  max-width: 350px;
}

.submit{
  width: 150px;
  border-radius: 10px!important;
}

#back, #send{
  margin-top: 2px;
}
#msg1{
  max-width: 450px;
}

#msg2{
  font-size: 13px;
  max-width: 350px;

}
</style>
