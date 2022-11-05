<template>
  <ion-page>
      <ion-header>
           <ion-toolbar mode="ios">
          <ion-menu-button menu="Menu" slot="start" class="t" color="primary"></ion-menu-button>
          <LgoName :town="UserTown"/>
         <ion-icon slot="primary" :icon="flash" color="primary" class="iconPanier"></ion-icon>
      </ion-toolbar >
      <div>
      <ion-segment :value="segmentValue"  @ionChange="segmentChanged($event)">
          <ion-segment-button value="event">
              <ion-label>Evenement</ion-label>
          </ion-segment-button>
          <ion-segment-button value="services">
              <ion-label>Services</ion-label>
          </ion-segment-button>
      </ion-segment>
      </div>
      </ion-header>
      <ion-content class="ion-margin">
          <EventComponent v-if="segmentValue=='event'"   />
          <ServicesComponent v-if="segmentValue=='services'"  />
       </ion-content>
  </ion-page>    
</template>

<script>
import {flash } from 'ionicons/icons';
import {IonPage,IonToolbar,IonIcon,IonSegment,IonSegmentButton,IonLabel,IonContent,IonMenuButton,IonHeader,} from '@ionic/vue'
import { defineComponent } from '@vue/runtime-core'
import LgoName from '@/components/LgoName.vue'
import store from '@/VerifyUserStore'
import EventComponent from '@/components/EventComponent.vue'
import ServicesComponent from '@/components/ServicesComponent.vue'
export default defineComponent ({
   name:"FlasH",
   components:{
       IonPage,
       IonToolbar,
      IonIcon,
      IonSegment,
      IonSegmentButton,
      IonLabel,
      IonContent,
      IonMenuButton,
      IonHeader,
      LgoName,
      EventComponent,
      ServicesComponent
   },
   data(){
       return{
           UserTown:"",
           segmentValue:"event",
           flash,
           test:false
       }
   },
   ionViewWillEnter(){
    store.get('UserTown').then((value)=>this.UserTown=value)
     store.get('t').then((value)=>{
       this.test=value
       if(this.test==true){
           this.UserTown="Chap Chap"
       }
    })
   },
   
   methods:{
       segmentChanged(e){
           this.segmentValue=e.detail.value
       }
   },
   
})
</script>

<style lang="scss" scoped>
ion-segment{
    --background: none;
    ion-segment-button{
        font-size: 1rem;
      border-width: 0;
      --padding-start: 7px !important ;
      --padding-bottom: 2px !important ;
      --padding-end: 7px !important ;
      --padding-top: 2px !important ;
       --background-checked:#03A61c ;
       --indicator-color :transparent !important;
       --color:#d1d1d1 ;
       --color-checked:#fff;
        font-weight: bold;
        border-radius: 22px;

    }
  }
</style>