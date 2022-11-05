<template>
  <ion-content>
      <ion-list>
          <ion-radio-group name="auto" @ionChange="segmentChanged($event)" >
              <ion-list-header>
                  <ion-label>Manger Avec quoi ?</ion-label>
              </ion-list-header>
              <ion-item v-for="(G,index) in Garniture" :key="index">
                  <ion-label>{{G}}</ion-label>
                  <ion-radio :value="G"></ion-radio>
              </ion-item>
          </ion-radio-group>
      </ion-list>
  </ion-content>
</template>

<script>
import { defineComponent } from "@vue/runtime-core"
import {IonContent,IonList,IonLabel,IonListHeader,IonItem,IonRadio,IonRadioGroup, popoverController} from '@ionic/vue'
export default defineComponent ({
name:"GarNiture",
components:{IonContent,IonList,IonLabel,IonListHeader,IonItem,IonRadio,IonRadioGroup},
props:['Garniture'],
methods:{
    segmentChanged(e){
        popoverController.dismiss({res:e.detail.value})
    }
}
})
</script>

<style>

</style>