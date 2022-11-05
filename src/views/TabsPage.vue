<template>
  <ion-page>
    <ion-tabs >
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom"  >
        <ion-tab-button tab="tab1" href="/tabs/tab1">
        <ion-icon :icon="home"></ion-icon>
          <ion-label >Acceuil</ion-label>
        </ion-tab-button>


         <ion-tab-button tab="tab2" href="/tabs/tab2/All" >
         <ion-icon :icon="restaurant"></ion-icon>
          <ion-label >Resto</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="tab3" href="/tabs/tab3" >
         <ion-icon :icon="cart"></ion-icon>
          <ion-label >Panier</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="tab5" href="/tabs/tab5/All" >
         <ion-icon :icon="flash"></ion-icon>
          <ion-label >Chap</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="tab4" href="/tabs/tab4" >
         <ion-icon :icon="person"></ion-icon>
          <ion-label >Moi</ion-label>
        </ion-tab-button>


      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, } from '@ionic/vue';
import { cart,restaurant,home,person,flash } from 'ionicons/icons';
 
export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton,  IonPage, IonRouterOutlet ,IonIcon},
 data(){
     return {
       person,
      restaurant,
      cart,
      home,
      flash,
      c1:null,
    

      
    }
 },

  
 
 
 })

</script>
<style lang="scss" scoped>

  
  
  


</style>
