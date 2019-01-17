<template>
  <div>
    <!-- <nav>-->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark site-header py-1 sticky-top">
      <router-link class="navbar-brand" to="/projects">To Do List</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li v-if="!log" class="navbar-item">
            <router-link to="/signIn" class="nav-link" exact>Accedi</router-link>
          </li>
          <li v-if="!log" class="navbar-item">
            <router-link to="/signUp" class="nav-link" exact>Registrazione</router-link>
          </li>
          <li v-if="log" class="navbar-item">
            <router-link to="/projects" class="nav-link" exact>Home</router-link>
          </li>
          <li v-if="log && !todolistPage" class="navbar-item">
            <router-link to="/addProject" class="nav-link" exact>Add a project</router-link>
          </li>
          <li v-if="log && todolistPage" class="navbar-item">
            <router-link class="nav-link" v-bind:to="pathProject" exact>To do List</router-link>
          </li>
          <li v-if="log && todolistPage" class="navbar-item">
            <router-link  class="nav-link" v-bind:to="pathAddProject" exact>Add a new todo</router-link>
          </li>
        </ul>
        <!-- dropdown menu with profile settings -->
        <ul class="navbar-nav">
          <div class="nav-item dropleft" v-show="log">
            <button class="btn btn-default btn-circle btn-lg" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon icon="user"/>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <router-link class="dropdown-item" to="/profile" style="color: black!important">Profile</router-link>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" to="/logout" style="color: black!important">Logout</router-link>
            </div>
          </div>
        </ul>

      </div>
    </nav>
  </div>
</template>

<script>
import { auth } from "../config/firebase_config.js"
export default {
  props: ["id"],
  data () {
    return {
      log: false,
      todolistPage: false,
      projectId: "",
      pathProject: "",
      pathAddProject: ""
    }
  },
  methods:{
  },
  created() {
    this.$root.$on("updateValue", () =>{
      this.todolistPage = this.$parent.todolist;
      this.projectId = this.$parent.projectKey;
      this.pathProject = "/project/" + this.projectId;
      this.pathAddProject = "/project/" + this.projectId + "/newEl";
    });
    auth.onAuthStateChanged( (user) => {
      if (user) {
        this.log = true;
      }
      else {
        // User is signed out.
        // ...

        this.log = false;
      }
    });
  },
  mounted(){

  }

}
</script>

<style scoped>
.site-header {
  background-color: rgba(0, 0, 0, .85);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.site-header a {
  color: #999;
  transition: ease-in-out color .15s;
}
.site-header a:hover {
  color: #fff;
  text-decoration: none;
}

.btn-group{
  border-top-right-radius: 0!important;
  border-bottom-right-radius: 0!important;
}
.user {
  width: 30px;
  height: 30px;
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
#dropdownMenu{
  background-color: #ddd;
}


li{
  display: inline-block;
  margin: 0 10px;
}
ul{
  list-style-type: none;
  text-align: center;
  margin: 0;
}

nav{
  margin-bottom: 30px;
}

.router-link-active{
  color: white!important;
}

</style>
