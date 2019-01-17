<template lang="html">
    <div class="container">
      <img style="display: none;" src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
      <div class="row">
          <div class="col-md-6" >
            <div class="card">
              <div class="card-body">
                <h2 class="card-title">{{ name }}</h2>
                <table class="table table-user-information">
                  <tbody>
                    <!-- name of the current user -->
                    <tr>
                      <td>
                        Nome
                        <input type="text" name="" v-bind:value="name" disabled>
                      </td>
                    </tr>
                    <!-- surname of the current user -->
                    <tr v-if="surname != null || surname != undefined">
                      <td>
                        Cognome
                        <input type="text" name="" v-bind:value="surname" disabled>
                      </td>
                    </tr>
                    <!-- email of the current user -->
                    <tr>
                      <td>
                        Email
                        <input type="text" name="" v-bind:value="email" disabled>
                      </td>
                    </tr>
                    <tr v-if="!loggedWithGoogle">
                      <!-- delete user button -->
                      <td>
                        <button type="button" data-toggle="modal" data-target="#removeUserModal" class="btn btn-secondary" >Rimuovi account</button>
                      </td>
                    </tr>
                    <!-- Modal -->
                    <div class="modal fade" id="removeUserModal" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="modalTitle">Rimuovi account</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            Inserira la password per confermare l'operazione
                            <input type="password" name="" @keyup="validPasswordConfirm = true" v-model="passwordConfirm">
                            <span v-if="!validPasswordConfirm" class="errorMessage">* Password errata</span>
                            <span v-if="passwordNotValid" class="errorMessage">* inserire password</span>
                          </div>
                          <div class="modal-footer">
                            <button class="btn-primary btn" @click="deleteUser()">
                              Conferma
                              <img id="loadingGif" v-if="removingUser" src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
                            </button>
                            <button class="btn-secondary btn" data-dismiss="modal" >Annulla</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="!loggedWithGoogle">
            <div class="card">
              <div class="card-body">
                <h3>Cambia la tua password</h3>
                <table class="table table-user-information">
                  <tbody>
                    <!-- old password of the current user -->
                    <tr>
                      <td>
                        <input
                        icon="password-icon"
                        name="oldPassword"
                        type="password"
                        placeholder=" Enter old password"
                        v-model="oldPassword"
                        @keyup="wrongPassword = false; checkIfEmptyFields()"
                        focus
                        />
                        <span v-if="wrongPassword" class="errorMessage"> * Wrong password</span>
                      </td>
                    </tr>
                    <!-- new password of the current user -->
                    <tr>
                        <td>
                            <input type="password" placeholder=" Enter new password" v-model="newPassword" v-on:keyup="validPassword = analysePassword(newPassword); equalPassword = checkIfEqualString(newPassword, newPasswordReEntered); checkIfEmptyFields()">
                            <span class="errorMessage" v-if="!validPassword">* La password deve essere di almeno 6 caratteri e contenere almeno 1 carattere Maiuscolo, 1 carattere minuscolo e 1 numero</br></span>
                        </td>
                    </tr>
                    <!-- confirm new password of the current user  -->
                    <tr>
                        <td>
                            <input type="password" placeholder=" Re-enter new password" v-model="newPasswordReEntered" @keyup="equalPassword = checkIfEqualString(newPassword, newPasswordReEntered); checkIfEmptyFields()">
                            <span v-if="!equalPassword"  class="errorMessage"> * Le due password inserite non corrispondono</br></span>
                            <span v-if="emptyFields" style="color: red">* compilari tutti i campi</span>

                        </td>
                    </tr>
                  </tbody>
                </table>
              <div>
                <!-- set new password button -->
                <button id="changeButton" @click="setNewPassword" class="btn btn-primary ml-2" disabled>
                  Cambia password
                  <img id="loadingGif" v-if="changingPassword" src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
                </button>
                <span v-if="passwordChanged" style="color: green"> Password changed!</span>
                <span v-if="passwordChangeFailed" style="color: red"> Password not changed!</span>

              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- loading image -->
      <div id="overlay" v-if="loading">
        <div id="loadingDiv">
          <img  src="https://github.com/Aspiga99/toDoList/blob/master/loading.gif?raw=true"/>
        </div>
      </div>
    </div>
</template>

<script>
import { auth, database, firebase } from "../config/firebase_config.js"
export default {
  data(){
    return{
      name: "name",
      surname: "surname",
      email: "example@example.com",
      oldPassword: "",
      newPassword: "",
      newPasswordReEntered: "",
      wrongPassword: false,
      equalPassword: true,
      validPassword: false,
      passwordChanged: false,
      passwordChangeFailed: false,
      changingPassword: false,
      emptyFields: true,
      loading: false,
      loggedWithGoogle: false,
      passwordConfirm: "",
      validPasswordConfirm: true,
      passwordNotValid: true,
      removingUser: false
    }
  },
  created(){
    //this page don't need to see todolist tab
    this.$parent.todolist = false;
    this.passwordChanged = false;
    this.loggedWithGoogle = this.$parent.loggedWithGoogle;
    //the current user
    var user = auth.currentUser;
    //the page is loading user informations
    this.loading = true;
    //user informations
    this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/information.json").then(function(data){
      return data.json();
    }).then( (data) => {
      this.name = data.name;
      this.surname = data.surname;
      this.email = data.email;
      this.loading = false;
    }).catch( (error) => {
      console.log(error.message);
      this.loading = false;
    });

  },
  methods: {
    //set the new password for the current user
    setNewPassword: function(){
      this.changingPassword = true;
      this.passwordChangeFailed = false;
      this.passwordChanged = false;
      if(this.validPassword && this.equalPassword){
        //the password is valid
        var user = auth.currentUser;
        //old credentials of the current user
        var credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.oldPassword
        );
        //reauthintication of the current user
        user.reauthenticateAndRetrieveDataWithCredential(credentials).then( () => {
          // User re-authenticated.
          user.updatePassword(this.newPassword).then( () => {
            // Update successful.
            this.passwordChanged = true;
            this.passwordChangeFailed = false;
            //reset input fields
            this.oldPassword = "";
            this.newPassword = "";
            this.newPasswordReEntered = "";
            this.changingPassword = false;
          }).catch( (error) => {
            // An error happened due to password update
            console.log(error.message);
            this.passwordChangeFailed = true;
            this.changingPassword = false;
            this.passwordChanged = false;
          });
        }).catch( (error) => {
          // An error happened due to user authentication
          console.log(error.message);
          if(error.code == "auth/wrong-password")
            this.wrongPassword = true;
          this.passwordChangeFailed = true;
          this.passwordChanged = false;
          this.changingPassword = false;
        });
      }
      else {
        this.changingPassword = false;
        alert("dati non validi. Controllare gli errori");
      }

    },
    // hide the message error
    clearMessageError: function(error){
      if(error == "wrongPassword")
          this.wrongPassword = false;
      this.passwordChanged = false;
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
    //check if the password is a valid password
    checkPasswordValidation: function(password){
      if(password != undefined && password != null){
        var re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
        var check = re.test(password);
        return check;
      }
      else {
        return false;
      }
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
    //check if there are empty fields of the form
    checkIfEmptyFields: function(){
      //check if there is one empty input field
      if(this.oldPassword == "" || this.newPassword == "" || this.newPasswordReEntered == ""){
        //there are empty fields
        this.emptyFields = true;
        //disable the change button
        document.getElementById("changeButton").disabled = true;
      }
      else {
        //there aren't empty fields
        this.emptyFields = false;
        //enable the change button
        document.getElementById("changeButton").disabled = false;
      }
    },
    deleteUser: function(){
      if(this.passwordConfirm != ""){
        this.removingUser = true;
        this.passwordNotValid = false;
        var user = auth.currentUser;
        //old credentials of the current user
        var credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.passwordConfirm
        );
        //reauthintication of the current user
        user.reauthenticateAndRetrieveDataWithCredential(credentials).then( () => {
          //re-authentication successful
          //delete user informations from realtime database of firebase
          let userRef = database.ref('users/' + user.uid);
          userRef.remove();
          $("#removeUserModal").modal("hide");
          user.delete().then( () => {
            // User deleted.
            alert("user deleted correctly");
            this.removingUser = false;
          }).catch( (error) => {
            // An error happened.
            this.removingUser = false;
            console.log(error.message);
          });
        }).catch( (error) => {
          if(error.code == "auth/wrong-password")
            this.validPasswordConfirm = false;
          this.removingUser = false;
          console.log(error.message + " code: " + error.code);
        });
      }
      else {
        this.passwordNotValid = true;
      }
    }
  }
}
</script>

<style lang="css" scoped>
#overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  cursor: pointer;
}


#loadingDiv{
  width: 80px;
  max-width: 80px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}

 #loadingDiv > img{
  width: 80px;
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

.errorMessage{
  color: red;
  font-size: 12px;
}

</style>
