<template lang="html">
  <div id="new-todo" class="container" v-bind:style="{ background: backgroundC }">
    <h3>{{ message }}</h3>
    <form v-if="!submitted">
      <label>Title</label>
      <input v-model="todo.title" type="text" placeholder="Title" required>
      <label>Dettagli</label>
      <textarea v-model="todo.details" placeholder="Details" required></textarea>
      <span class="error" v-if="invalidData">* Compilare tutti i campi</span>
      <button id="submit" class="btn btn-primary" v-on:click.prevent="post">Add todo</button>
    </form>
    <button v-if="submitted" id="submit" type="button" class="btn btn-primary" v-on:click="reload">Create an other todo</button>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
export default {
  data(){
    return{
      todo:{
        title: "",
        details: "",
        type: "todo"
      },
      submitted: false,
      message: "Add a new Todo",
      backgroundC: "#ddd",
      invalidData: false
    }
  },
  methods: {
    post: function(){
      if(this.todo.title != "" && this.todo.details != ""){
        this.invalidData = false;
        var userId = auth.currentUser.uid;
        console.log("users/"+ userId + "/projects/" + this.$parent.projectKey + "/posts");
        database.ref("users/"+ userId + "/projects/" + this.$parent.projectKey + "/posts").set({
          //name of the todo
          title: this.todo.title,
          //description of the todo
          details: this.todo.details,
          //the type of the todo
          type: this.todo.type
        }).catch( (error) => {
          console.log(error.message);
        }).then( () => {
          this.submitted = true;
          this.message = "The todo has been created!!";
          this.backgroundC = "lightgreen";
        });
      }
      else {
        this.invalidData = true;
      }
    },
    reload: function(){
      this.submitted = false;
      this.message = "Add a new Todo";
      this.backgroundC = "#ddd";
      this.todo.title = "";
      this.todo.details = "";

    },
    //get the project and verify if is created by the current user
    verifyProjectValidation: function(projectId){
      var user = auth.currentUser;
      this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/projects/" + projectId).then(function(data){
        return data.json();
      }).then(function(data){
        if(data == null)
          this.$router.push("/projects");
      });
    }
  },
  created(){
    this.$parent.todolist = true;
    this.$parent.projectKey = this.$route.params.id;
    this.verifyProjectValidation(this.$parent.projectKey);
    this.submitted = false;
  }
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
.container{
  max-width: 500px!important;
}
#new-todo{
  padding: 20px 30px;
  width: 100%;
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
h3{
  text-align: center;
}
</style>
