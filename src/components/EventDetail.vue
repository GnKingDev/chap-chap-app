<template>
<ion-header>
    <ion-toolbar mode="ios">
        <ion-icon slot="start" :icon="closeCircle" color="danger" @click="Close()" ></ion-icon>
        <h6 class="title"> {{eventDetail.Titre}} </h6>
    </ion-toolbar>
</ion-header>
  <ion-content>
      <div class="img">
    <img :src="eventDetail.img" alt="" style="width:100%;">
      </div>
      <div class="eventdeta" align="center">
          <h6>Description de l'évènement</h6>
          <p> date de debut: <span>{{eventDetail.dateDebut}} à {{eventDetail.Heur}} </span> <br>
             Date Fin : <span> {{eventDetail.dateFin}} </span> <br>
             Lieux : <span> {{eventDetail.Lieux}} </span>
             {{eventDetail.Desc}}
           </p>
      </div>
      <div class="dsec" align="center">
          <p> {{eventDetail.EventDesc}} <br> Organisateur : {{eventDetail.Company.nom}} Contact : {{eventDetail.Company.numero}} </p>
      </div>
      <div class="nombreticket" align="center">
          <h6>Type de ticket</h6>
          <div  v-for="(T,index) in eventDetail.TicketDetail" :key="index">
           <ion-label>ticket {{T.type}} {{T.prix.toLocaleString('en-US')}} GNF par ticket </ion-label> 
          <ion-chip color="primary">
              <ion-icon :icon="addCircle" @click="Add(T.type,T.prix,T.id,index)"></ion-icon>
              <ion-label> {{activeIndex==index ? compteur[index]:NomCompteur[index]}} </ion-label>
              <ion-icon :icon="removeCircle" @click="Sous(T.type,T.prix,T.id,index)"></ion-icon>
          </ion-chip>
          </div>
      </div>
  </ion-content>
   <ion-footer>
          <ion-toolbar>
              <ion-label slot="start"> Total: <span>{{Sometotal.toLocaleString('en-US')}}</span> GNF</ion-label>
              <ion-button v-on:click="Achat()" slot="end" :disabled="btnAchat">
                  Acheter
              </ion-button>
          </ion-toolbar>
      </ion-footer>
</template>
<script>
import { defineComponent } from "@vue/runtime-core";
import {IonContent,IonHeader,IonToolbar,IonIcon,IonChip,IonLabel, modalController,IonFooter,IonButton} from '@ionic/vue'
import {closeCircle,addCircle,removeCircle,} from 'ionicons/icons';
import initAchatEventVue from "@/components/initAchatEvent.vue";
export default defineComponent ({
 name:"EventDetail",
 components:{IonContent,IonHeader,IonToolbar,IonIcon,IonChip,IonLabel,IonFooter,IonButton},
   
 data(){
     return{
         closeCircle,
         addCircle,
         removeCircle,
         Sometotal:0,
         compteu:0,
         activeIndex:new Number,
         compteur:[],
        NomCompteur:[],
        For:[],
        message:[],

     }
 },
 created(){
this.NomCompteur[1]=0
 },
 computed:{
   btnAchat(){
       if(this.Sometotal==0){
           return true
       }else{
           return false
       }
   }
 },
 methods:{
   async  Achat(){
      this.For.forEach(element => {
           this.message.push(JSON.stringify({type:element.type,nombre:element.nombre}))
      });
       const modal = await modalController.create({
       component:initAchatEventVue,
       componentProps:{sommeTotat:this.Sometotal,content:this.eventDetail,user:this.User,nombre:this.compteu,EndPoint:this.EndPoint,payementDetail:this.For,message:this.message},
       backdropDismiss:false,
       cssClass:"PaymentModa1"
       })
       modal.present()
       modal.onDidDismiss().then(()=>{
           this.message=[]
       })
       
     },
     Add(type,prix,id,index){
      this.activeIndex=index
        if(this.compteur[index]){
            this.compteur[index]=this.compteur[index]+1
            this.NomCompteur[index]=this.compteur[index]
        } else {
            this.compteur[index]=1
            this.NomCompteur[index]=this.compteur[index]
        }

       let i = this.For.findIndex(e=>e.id==id)
       if(i==-1){
         this.For[index]={id:id,type:type,nombre:this.NomCompteur[index]}
         this.For=this.For.filter(e=>e.id!="")
       }else {
          this.For[i].nombre=this.NomCompteur[index]
       }
       this.Sometotal=this.Sometotal+prix
     },
     Sous(type,prix,id,index){
       this.activeIndex=index
       if(this.compteur[index]>0){
         this.compteur[index]=this.compteur[index]-1
         this.NomCompteur[index]=this.compteur[index]
         this.For[index].nombre=this.NomCompteur[index]
         if(this.compteur[index]==0){
          this.For= this.For.filter(e=>e.nombre!=0)
         }

         this.Sometotal=this.Sometotal-prix
       }
     },
     Close(){
         modalController.dismiss()
     },

 },
 props:['eventDetail','User','EndPoint']
})
</script>

<style scoped>
ion-content h6{
 text-decoration: underline;
}

ion-icon{
    font-size: 40px;
}
span{
    color: #03A61c;
}
.title{
    text-align: center;
}
.eventdeta{
    background-color: #eee;
    padding: 12px;
    border-radius: 10px;
    margin: 10px;
}
.dsec{
    background: #eee;
    padding: 12px;
    border-radius: 10px;
    margin: 10px;
}
</style>