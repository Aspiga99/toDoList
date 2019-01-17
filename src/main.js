import Vue from 'vue'
import App from './App.vue'
import VueResource from "vue-resource"
import router from "./routes.js"
import firebase from "firebase"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axios from "axios"
import VueAxios from "vue-axios"
import imagePreloader from 'vue-image-preloader'


library.add(faUser)
library.add(faInfo)
library.add(faQuestion)

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(imagePreloader)



Vue.prototype.config = {
  apiKey: "AIzaSyDDGL2p9NRK2XKro8U_8iz1pzIdm3qEJCE",
  authDomain: "todolist-project99.firebaseapp.com",
  databaseURL: "https://todolist-project99.firebaseio.com",
  projectId: "todolist-project99",
  storageBucket: "todolist-project99.appspot.com",
  messagingSenderId: "997829562670"
};

// const config = {
//   apiKey: "AIzaSyDDGL2p9NRK2XKro8U_8iz1pzIdm3qEJCE",
//   authDomain: "todolist-project99.firebaseapp.com",
//   databaseURL: "https://todolist-project99.firebaseio.com",
//   projectId: "todolist-project99",
//   storageBucket: "todolist-project99.appspot.com",
//   messagingSenderId: "997829562670"
// };
// firebase.initializeApp(config)

Vue.directive("sub",{
  bind(el, binding, vnode){
    if(binding.value == true){
      el.style.background = "lightgreen";
    } else{
      el.style.background = "#ddd";
    }
  }
});

Vue.directive("disable",{
  bid(el, binding, vnode){

  }
});

let app = "";

firebase.auth().onAuthStateChanged( () => {
  if ( !app ) {
    app = new Vue({
      data:{
        todolist: false,
        projectKey: "",
        loggedWithGoogle: false
      },
      router,
      render: h => h(App),
    }).$mount("#app");
  }
});
