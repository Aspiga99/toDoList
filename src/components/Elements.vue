<template lang="html">
  <div>
    <div v-for="element in elements" class="element">
      <button data-toggle="modal" v-bind:data-target="'#elementDetails'+element.id" class="elementButton btn btn-primary">
        {{ element.title }}
        <p style="font-size: 12px">Click for details</p>
      </button>
      <!-- Modal with element details -->
      <div class="modal fade" v-bind:id="'elementDetails'+element.id" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Dettagli</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- details of the element -->
              <p>{{ element.details }}</p>
            </div>
            <div class="modal-footer">
              <!-- add the element in the process elements list -->
              <button v-if="type == 'todo'"  v-on:click="changeElementType('process', element)" data-dismiss="modal" class="btn-primary btn">In process</button>
              <!-- add the element in the done elements list -->
              <button v-if="type == 'process'"  v-on:click="changeElementType('done', element)" data-dismiss="modal" class="btn-primary btn">Done</button>
              <!-- remove the element from the to do list -->
              <button class="btn-secondary btn" v-on:click="removeElement(element.id)" data-dismiss="modal" >Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, database } from "../config/firebase_config.js"
export default {
  props: ["elements","type", "project"],
  data(){
    return{
      validType: true,
      emptyElement: false
    }
  },
  methods: {
    // change the element type and update the to do list
    changeElementType: function(type, element){
      if(type == "todo" || type == "process" || type == "done"){
        if(element != null){
          // the id of the current user
          var userId = auth.currentUser.uid;
          // change the type of the element in the firebase database
          database.ref('users/' + userId + "/projects/" + this.project + "/posts/" + element.id).set({
            // details of the element
            details: element.details,
            // the title of the element
            title: element.title,
            // the new type of the element
            type: type
          }).then( () => {
            // update the to do list
            this.$root.$emit("updateList");
          });
        }
        else {
          this.emptyElement = true;
        }
      }
      else {
        this.validType = false;
      }
    },
    // remove the element from the to do list and updated the list
    removeElement: function(id){
      // the id of the current user
      var userId = auth.currentUser.uid;
      // remove the element from firebase database
      database.ref('users/' + userId + "/projects/" + this.project + "/posts/" + id).remove().then( () => {
        // update the to do list
        this.$root.$emit("updateList");
      });
    }
  }

}
</script>

<style lang="css" scoped>

/** class for all element buttons **/
.elementButton{
  width: 100%;
  margin-top: 20px;
  height: 100px;
  border-radius: 30px;
  text-align: center;
  font-size: 25px;
  max-width: 300px;
}

/** the div of a single element **/
.element{
  margin-top: 30px;
  margin-block-start: -10px;
  width: 100%;
  padding: 0 15px;
}


</style>
