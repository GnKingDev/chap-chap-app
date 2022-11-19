<template>
<div v-if="leRoute=='Succes'">
 <div class="container1 ion-margin" v-for="(event,index) in EventData" :key="index">
  <img :src="event.img" alt="EventImg" style="width:100%;">
  <div class="content">
    <h6>{{event.Titre}}</h6>
   <p>
     {{event.dateDebut}} à {{event.Heur}} <br>
     Lieux: {{event.Lieux}} <br>
   </p>
   <ion-button v-on:click="Participe(index)">
    Je participe
   </ion-button>
  </div>
</div>
</div>
  
 <div  v-if="leRoute=='erreur'" align="center">
         <ion-img :src="require('../images/erreurImage.png')"></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>
</template>

<script scoped>
import { defineComponent } from "@vue/runtime-core";
import {alertController, IonButton, loadingController, modalController,IonImg} from '@ionic/vue'
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, Timestamp, where } from "@firebase/firestore";
import EventDetail from '@/components/EventDetail.vue'
import app from "@/firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import store from "@/VerifyUserStore";
import router from "@/router";
export default defineComponent ({
 name:"HotelComponent",
 components:{IonButton,IonImg},
 data(){
     return{
         leRoute:"load",
         EventData:[],
         UserData:{},
         EndPoint:{}
     }
 },
 async beforeCreate(){
  const attendre = await loadingController.create({message:"Patientez"})
    attendre.present()
    try {
        const db = getFirestore(app)
        const auth = getAuth(app)
        let UserTown=""
       await store.get('UserTown').then((value)=>UserTown=value)
        onAuthStateChanged(auth,async (user)=>{
            if(user){
              const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
                const refuser = doc(db,"USERS",user.uid)
                const User = await getDoc(refuser)
                if(User.exists()) this.UserData=User.data()
                const refEvent = query(collection(db,"Evenement"),where("Ville","==",UserTown))
            const Event = await getDocs(refEvent)
              Event.forEach(async (element)=>{
                let take = element.data()
                let timestamp = Timestamp.now()
                let DateNow = new Date(timestamp.seconds*1000)
                let EventDate = new Date(take.EventDate.seconds*1000)
                if(EventDate.getTime()>=DateNow.getTime()){
                     this.EventData.push(take)
                }
                 
              })
              this.leRoute="Succes"
              attendre.dismiss()
            }else {
               const alert = await alertController.create({
                header:"Vous n'avez pas de compte",
                message:"Vous devez avoir un compte pour utiliser cette fonctionalite voulez vous creer un compte ?",
                buttons:[{
                    text:"Non",
                    cssClass:"primary",
                    handler:()=>{
                        this.$router.back()
                        return
                    }
                },{
                    text:"creer un compte",
                    cssClass:"primary",
                    handler:()=>{
                        this.$router.push({path:"/CreateAcountPage"})
                    }
                }]
                
            })
            alert.present()
            attendre.dismiss()
            }

        })
    } catch (error) { 
        attendre.dismiss()
        this.leRoute="erreur"
    }
 },
 methods:{
   async  Participe(index){
       if(window.navigator.onLine==false){
            const alert = await alertController.create({message:"Veillez activer votre internet"})
            alert.present()
            return
        }
        const modal = await modalController.create({
            component:EventDetail,
            componentProps:{eventDetail:this.EventData[index],User:this.UserData,EndPoint:this.EndPoint}
        })
        modal.present()
     },
    async TryAgain(){
        if(window.navigator.onLine==false){
            const alert = await alertController.create({message:"Veillez activer votre internet"})
            alert.present()
            return
        }
        const attendre = await loadingController.create({message:"Patientez"})
    attendre.present()
    try {
        const db = getFirestore(app)
        const auth = getAuth(app)
        let UserTown=""
       await store.get('UserTown').then((value)=>UserTown=value)

        onAuthStateChanged(auth,async (user)=>{
            if(user){
               const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
                const refuser = doc(db,"USERS",user.uid)
                const User = await getDoc(refuser)
                if(User.exists()) this.UserData=User.data()
                const refEvent = query(collection(db,"Evenement"),where("Ville","==",UserTown))
            const Event = await getDocs(refEvent)
              Event.forEach(async (element)=>{
                let take = element.data()
                let timestamp = Timestamp.now()
                let DateNow = new Date(timestamp.seconds*1000)
                let EventDate = new Date(take.EventDate.seconds*1000)
                if(EventDate.getTime()>=DateNow.getTime()){
                     this.EventData.push(take)
                }
                 
              })
              if(this.$route.params.id!='All'){
                this.EventData=this.EventData.filter(e=>e.id==this.$route.params.id)
              }
              this.leRoute="Succes"
              attendre.dismiss()
            }

        })
    } catch (error) { 
        attendre.dismiss()
        this.leRoute="erreur"
    }
     }
 }
})
</script>

<style scoped>

.container1{
  position: relative;
  max-width: 800px; /* Maximum width */
  margin: 10px;
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