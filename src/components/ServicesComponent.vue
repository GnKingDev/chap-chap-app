<template>
 <div class="container1 ion-margin">
  <img src="../images/livraison.jpg" alt="Notebook" style="width:100%;">
  <div class="content">
    <h6>Service de Livraison et transport</h6>
     <p> Vous voulez une livraison de vos bagages et produits contacter notre equipe
          </p>
    <span class="fa fa-phone"></span> +224 629-82-13-08
  </div>
</div>
</template>

<script scoped>
import { defineComponent } from "@vue/runtime-core";
import {IonButton} from '@ionic/vue'
export default defineComponent ({
 name:"HotelComponent",
 components:{},
})
</script>

<style>
.checked{
  color: orange;
}
.container1{
  position: relative;
  max-width: 800px; /* Maximum width */
  margin: 0 auto; /* Center it */
}

.container1 .content {
  position: absolute; /* Position the background text */
  bottom: 0; /* At the bottom. Use top:0 to append it to the top */
  background: rgb(0, 0, 0); /* Fallback color */
  background: rgba(0, 0, 0, 0.5); /* Black background with 0.5 opacity */
  color: #f1f1f1; /* Grey text */
  width: 100%; /* Full width */
  padding: 5px; /* Some padding */
}
.container{
    position: relative;
  text-align: center;
  color: white;
}

</style>