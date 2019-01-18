<template lang="html">
  <div id="home">
    <h2>Projects</h2>
    <div class="element" v-for="project in projects">
      <button data-toggle="modal" v-bind:data-target="'#elDetails'+project.id"   class="project btn btn-primary">
        {{ project.name }}</br>
        Click to open it
      </button>
      <!-- Modal -->
      <div class="modal fade" v-bind:id="'elDetails'+project.id" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Dettagli</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ project.description }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-primary btn" v-on:click="openProject(project.id)" data-dismiss="modal" >Open</button>
              <button class="btn-secondary btn" v-on:click="removeProject(project.id)" data-dismiss="modal" >Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- redirect in the create project page -->
    <button id="new" class="project btn" v-on:click="add">
      Add a new project</br>
      <img id="image" src="https://github.com/Aspiga99/toDoList/blob/master/assets/images/Add.png?raw=true" alt="" >
    </button>
    <div id="overlay" v-if="loading">
      <div id="loadingDiv">
        <img id="loadingGif" src="https://github.com/Aspiga99/toDoList/blob/master/assets/images/loading.gif?raw=true"/>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
const loadingImage = new Image();
loadingImage.src = "https://github.com/Aspiga99/toDoList/blob/master/assets/images/loading.gif?raw=true";


export default {
  data(){
    return{
      projects: [],
      loading: false,
      addImage: null,
      loadingImage: null
    }
  },
  created(){
    this.$parent.todolist = false;
    // the id of the current user
    var user = auth.currentUser;
    this.loading = true;
    this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/projects.json").then((data) => {
      return data.json();
    }).then((data) => {
      for(let key in data){
        data[key].id = key;
        this.projects.push(data[key]);
      }
      this.loading = false;
    });


  },
  methods: {
    add: function(){
      this.$router.push("/addProject");
    },
    openProject: function(el){
      this.$parent.todolist = true;
      this.$router.push("/project/" + el);
    },
    // remove the element from the to do list and updated the list
    removeProject: function(id){
      // the id of the current user
      var userId = auth.currentUser.uid;
      // remove the element from firebase database
      database.ref('users/' + userId + "/projects/" + id).remove().then( () => {
        // update the to do list
        this.updateProjects();
      });
    },
    updateProjects: function(){
      // the id of the current user
      var userId = auth.currentUser.uid;
      //initializing array elements
      // projects array
      var projects = [];
      //get projects of the current user from firebase
      this.loading = true;
      this.$http.get("https://todolist-project99.firebaseio.com/users/" + userId + "/projects.json").then(function(data){
        return data.json();
      }).then(function(data){
        for(let key in data){
          data[key].id = key;
          projects.push(data[key]);
        }
        this.projects = projects;
      });
      this.loading = false;
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

#loadingGif{
  width: 80px;
}

h2{
  margin-left: 20px;
}
#image{
  width: 20px;
  height: 20px;
}
#home{
  margin-left: 20px;
}


.project{
  margin: 0 20px;
  margin-top: 10px;
  width: 170px!important;
  height: 170px!important;
  max-width: 200px!important;
  border-radius: 2.5rem!important;
}
.element{
  display: inline-block;
  margin-top: 10px;
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
}
.btn{
}
#new{
  border: 1.5px dotted black;
  background-color: white!important;
}
</style>
