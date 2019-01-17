<template lang="html">
  <div id="new-project" v-bind:style="{ background: backgroundColor }">
    <!-- title of the form -->
    <h3>{{ titleForm }}</h3>
    <form v-if="!submitted">
      <label>Nome</label>
      <!-- the name of the project -->
      <input v-on:keyup="isProjectExists(); " v-model="project.name" type="text" placeholder="Nome" required>
      <!-- error message if the project exists-->
      <span class="error" v-if="projectExists">* progetto già esistente</span>
      <label>Descrizione</label>
      <!-- the description of the project -->
      <textarea v-model="project.description" placeholder="Descrizione" required></textarea>
      <span class="error" v-if="invalidData">* Compilare tutti i campi</span>
      <!-- post the data of the form -->
      <button id="submit" class="btn btn-primary" v-on:click.prevent="post">Add project</button>
    </form>
    <button v-if="submitted" id="submit" type="button" class="btn btn-primary" v-on:click="reload">Create an other project</button>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
export default {
  data(){
    return{
      project:{
        name: "",
        description: ""
      },
      submitted: false,
      titleForm: "Add a new Project",
      backgroundColor: "#ddd",
      projectExists: false,
      projects: [],
      invalidData: false

    }
  },
  created(){

  },
  methods: {
    post: function(){
      //if the project not exists && project.name not empty && project.description not empty
      if(!this.projectExists && this.project.name != "" && this.project.description != ""){
        this.invalidData = false;
        //the id of the current user
        var userId = auth.currentUser.uid;
        //form display: none
        this.submitted = true;
        //the new title of the form
        this.titleForm = "Project " + this.project.name + " has been created";
        //the new background color of the div
        this.backgroundColor = "lightgreen";
        //key of the new project
        var newProjectKey = database.ref().child("posts").push().key;
        //create the new project in firebase database
        database.ref("users/"+ userId + "/projects/" + newProjectKey).set({
          //the name of the project
          name: this.project.name,
          //the description of the project
          description: this.project.description
        });
      }
      else{
        //invalid data
        this.invalidData = true;
      }
    },
    //check if the project exists in the firebase database related to the current user
    isProjectExists: function(){
      //get all projects of the user from firebase
      this.getProjects();
      //the project doesn't exists
      this.projectExists = false;
      for(let key in this.projects){
        //check if the project already exists
        if(this.project.name == this.projects[key].name)
          //the project exists
          this.projectExists = true;
      }//for
    },
    reload: function(){
      this.submitted = false;
      this.titleForm = "Add a new projects";
      this.backgroundColor = "#ddd";
      this.project.name = "";
      this.project.description = "";
    },
    //get all projects created by the current user
    getProjects: function(){
      //the id of the current user
      if(auth.currentUser.uid != null)
        var userId = auth.currentUser.uid;
      //get all the projects registered in the database with the id of the current user
      this.$http.get("https://todolist-project99.firebaseio.com/users/" + userId + "/projects.json").then( (data) => {
        return data.json();
      }).then( (data) => {
        for(let key in data)
          //assign the element of the array data to the local array projects
          this.projects.push(data[key]);
      });
    }//getProjects
  }//methods
}
</script>

<style lang="css" scoped>
.error{
  color: red;
  font-size: 12px;
}
#submit{
  margin: auto;
  margin-top: 20px;
  display: block;
  width: 200px;
  border-radius: 20px!important;

}
h1{
  text-align: center;
}
#new-project{
  padding: 20px 30px;
  width: 100%;
  max-width: 500px;
  margin: auto;
  box-sizing: border-box;
  background: #eee;
}
input[type="text"], textarea{
  display: block;
  width: 100%;
  padding: 8px;
}

label{
  display: block;
  margin: 20px 0 10px;
}
</style>
