<template>
<ion-page>
    <ion-header class="ion-no-border" >
        <ion-toolbar v-if="M.succes==true" >
         <ion-back-button default-href="tabs/tab1" mode="md" class="b" color="primary"  slot="start"></ion-back-button>
         <ion-title color="primary">Message</ion-title>
         <ion-icon :icon="chatbubble" slot="end"></ion-icon>
        </ion-toolbar>
    </ion-header>
<ion-content>
    <div v-if="M.succes==true" class="itemMessage" >
<ion-item v-for="(message,index) in M.Messages" :key="index" @click="Conversation(index,message.idUser,message.idProduit)" :button="true" >
    <ion-avatar slot="start">
        <img :src="message.linkPhoto" />
    </ion-avatar>
    <ion-label>
        <h6> concernant {{message.nomProd}}</h6>
        <p> {{M.coute[index].showNewMessage}}</p>
    </ion-label>
    <ion-badge color="primary" mode="ios" slot="end" v-if="M.coute[index].vue==false">.</ion-badge>
</ion-item>
</div>
</ion-content>
</ion-page>
</template>

<script>
import { defineComponent,  reactive } from "@vue/runtime-core";
import {IonHeader,IonBackButton,IonContent,IonItem,IonLabel,IonBadge,IonAvatar,IonPage,IonIcon, loadingController, alertController, onIonViewWillEnter,IonToolbar,IonTitle} from '@ionic/vue'
import {chatbubble} from 'ionicons/icons'
import router from "@/router";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import app from "@/firebase";
import { doc, getDoc, getFirestore, onSnapshot } from "@firebase/firestore";
export default defineComponent( {
name:"MessaGes",
components:{
    IonHeader,
    IonBackButton,
    IonContent,
    IonPage,
    IonIcon,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonToolbar,
    IonTitle
},
setup(){
   
    //prendre tous les message de l'utilisateur
    let M = reactive({Messages:[],coute:[],succes:false})
   onIonViewWillEnter(async()=>{
       const attendre = await loadingController.create({message:"patientez s'il vous plait"})
       attendre.present()
       try {
           
       
       const auth = await getAuth(app)
       const db = await getFirestore(app)
     onAuthStateChanged(auth,async(user)=>{
         const refuser = await doc(db,"USERS",user.uid)
         const data = await getDoc(refuser)
         if(data.exists()){
         let take = data.data()
         let msg=take.Message
          msg.forEach(element => {
              if(element.message[0]){
                  M.Messages.push(element)
              }
          });
         M.Messages.forEach((element,index) => {
              element.message.forEach(element1 => {
                  if(element1.vue==false){
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }else{
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }
              });
         });
         attendre.dismiss()
         M.succes=true
         }
         onSnapshot(refuser,(newData)=>{
             if(newData.exists()){
                 let take = newData.data()
                 let msg = take.Message
                 M.Messages=[]
                  msg.forEach(element => {
              if(element.message[0]){
                  M.Messages.push(element)
              }
          });
           M.Messages.forEach((element,index) => {
              element.message.forEach(element1 => {
                  if(element1.vue==false){
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }else{
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }
              });
         });


             }
         })
     })
    } catch (error) {
         attendre.dismiss()
        const alert = await alertController.create({message:"erreur du serveur"})
        alert.present()
         router.replace({path:"tabs/tab1"})
       }
   })
    const Conversation =async (index,idUser,idProuct)=>{
        const attendre = await loadingController.create({message:"patientez s'il vous plait"})
        attendre.present()
        try {
             const db = await getFirestore(app)
             const refFour = await doc(db,"FOURNISSEURS",M.Messages[index].idFour)
             const take = await getDoc(refFour)
             if(take.exists()){
                 let data = take.data()
              let i= data.Message.findIndex(e=>e.idProduit==idProuct && e.idUser==idUser)
              router.push({name:"ConverSation",params:{index:index,id:idUser,index2:i}})
              attendre.dismiss()
             }
        } catch (error) {
            const alert = await alertController.create({message:"erreur du serveur"})
            alert.present()
            attendre.dismiss()
            router.back()
        }
       
    }
    return{
        chatbubble,
        Conversation,
        M
    }
}
})
</script>

<style lang="scss" scoped>



</style>