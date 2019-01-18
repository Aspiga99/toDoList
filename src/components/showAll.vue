<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <h3>Project completation</h3>
        <div class="progress">
          <div class="progress-bar bg-success" role="progressbar" v-bind:style="widthBar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"> {{ progressList + "%" }}</div>
        </div>
      </div>
    </div>
    <div class="row" id="main">
      <div id="overlay" v-if="loading">
        <div id="loadingDiv">
          <img id="loadingGif" src="https://github.com/Aspiga99/toDoList/blob/master/assets/images/loading.gif?raw=true"/>
        </div>
      </div>
      <div id="todo" class="col-sm">
        <h2>To do</h2>
        <el-container v-bind:elements="todos" type="todo" v-bind:project="project"></el-container>
      </div>
      <div id="process" class="col-sm">
        <h2>In process</h2>
        <el-container v-bind:elements="processes" type="process" v-bind:project="project"></el-container>
      </div>
      <div id="done" class="col-sm">
        <h2>Done</h2>
        <el-container v-bind:elements="dones" type="done" v-bind:project="project"></el-container>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
import elements from "./Elements.vue"



export default {
  components:{
    "el-container": elements
  },
  data(){
    return{
      project: this.$route.params.id,
      todos: [],
      processes: [],
      dones: [],
      counterElements: 0,
      progressList: 0,
      widthBar : "width: 0",
      projects: [],
      projectCreatedByCurrentUser: false,
      loading: false
    }
  },
  directives: {
    progress: {
      bind: function(el, binding, vnode){
          el.style.width = binding.value + "%";
      },
      updated: function(el, binding, vnode){
          el.style.width = binding.value + "%";
      }
    }
  },
  created(){
    this.projectCreatedByCurrentUser = false;
    // the id of the current project
    this.$parent.projectKey = this.$route.params.id;
    // this is a to do list page
    this.verifyProjectValidation(this.$route.params.id);
    this.$parent.todolist = true;
    this.update();
    this.$root.$on("updateList", () => {
      this.update();
    });
  },
  methods: {
    update: function(){
      // the id of the current user
      var userId = auth.currentUser.uid;
      //initializing array elements
      // elements with the type todo
      var todos = [];
      // elements with the type process
      var processes = [];
      // elements with the type done
      var dones = [];
      //get elements from firebase
      this.loading = true;
      this.$http.get("https://todolist-project99.firebaseio.com/users/" + userId + "/projects/" + this.project + "/posts.json").then(function(data){
        return data.json();
      }).then(function(data){
        for(let key in data){
            data[key].id = key;
            if(data[key].type == "todo")
              todos.push(data[key]);
            else if(data[key].type == "process"){
              processes.push(data[key]);
            }
            else {
              dones.push(data[key]);
            }
        }
        //updated todos
        this.todos = todos;
        //updated processes
        this.processes = processes;
        //updated dones
        this.dones = dones;
        this.loading = false;
        //value of project completation
        this.counterElements = this.dones.length + this.todos.length + this.processes.length;
        if(this.counterElements != 0 && this.dones.length != 0){
          this.progressList = Math.round((this.dones.length * 100) / this.counterElements);
          this.widthBar = "width: " + this.progressList + "%";
        }
        else {
          this.progressList = 0;
          this.widthBar = "width: " + this.progressList + "%";
        }
      });
    },
    //get the project from firebase and verify if is created by the current user
    verifyProjectValidation: function(projectId){
      var user = auth.currentUser;
      this.$http.get("https://todolist-project99.firebaseio.com/users/" + user.uid + "/projects/" + projectId + ".json").then(function(data){
        return data.json();
      }).then(function(data){
        if(data == null)
          this.$router.push("/projects");
      });
    }
  }
}
</script>

<style lang="css" scoped>
#main{
}

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
#todo, #process, #done{
  width: 300px;
  height: auto;
  margin-left: 10px;
  margin-top: 10px;
}
h2{
  background-color: #ddd;
  border-radius: 5px;
  width: 100%;
  margin: auto;
  text-align: center;

}

h3{
  text-align: center;
}

</style>
