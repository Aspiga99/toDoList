import showAll from "./components/showAll.vue";
import newtodo from "./components/NewTodo.vue"
import signin from "./components/Login.vue"
import signup from "./components/Register.vue"
import home from "./components/Home.vue"
import addproject from "./components/addProject.vue"
import logout from "./components/logout.vue"
import profile from "./components/Profile.vue"
import resetPassword from "./components/ResetPassword.vue"
import { auth } from "./config/firebase_config.js"
import Vue from "vue"
import Router from "vue-router"

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/projects",
      name: "home",
      component: home,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: "/",
      redirect: "/projects"
    },
    {
      path: "*",
      redirect: "/projects"
    },
    {
      path: "/project/:id/newEl",
      component: newtodo,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: "/project/:id",
      component: showAll,
      meta:{
        requiresAuth: true
      }

    },
    {
      path: "/signIn",
      name: "SignIn",
      component: signin
    },
    {
      path: "/signUp",
      component: signup
    },
    {
      path: "/addProject",
      component: addproject,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      component: profile,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: "/resetPassword",
      component: resetPassword
    },
    {
      path: "/logout",
      component: logout,
      meta:{
        requiresAuth: true
      }
    }]
});



router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.slice().reverse().find(r => r.meta && r.meta.requiresAuth);
    auth.onAuthStateChanged(function(user){
      if(requiresAuth && !user){
          next("/signIn");
      }
      else if (!requiresAuth && user) {
          next("/projects");
      }
      else {
        next();
      }
    });

});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
      // Start the route progress bar.
      NProgress.start()
  next()
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
});

export default router;
