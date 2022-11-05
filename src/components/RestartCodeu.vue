<template>
  <ion-page>
      <ion-header>
              <ion-toolbar >
                  <ion-icon slot="start" :icon="closeCircle" color="danger" @click="closeModal()" ></ion-icon>
              </ion-toolbar>
          </ion-header>
      <ion-content class="ion-padding">
          <h3 class="ion-text-center">Vos informations</h3>
          <div v-if="tester==false">
              <ion-row>
                  <ion-col size="12" class="ion-text-center">
                      <ion-note>veillez mettre ces informatons que vous avez utlisez pour creer votre compte nous allons envoyer votre codeU sur votre numero </ion-note>
                  </ion-col>
              </ion-row>
            <ion-item>
                <ion-icon slot="start" :icon="person" color="primary" ></ion-icon>
                <ion-input type="text" placeholder="Prenom et nom" v-model="userDetail.name"></ion-input>
            </ion-item>
             <ion-item>
                <ion-icon slot="start" :icon="call" color="primary" ></ion-icon>
                <ion-input type="text" placeholder="numero de telephone" v-model="userDetail.NumberPhone"></ion-input>
            </ion-item>
          </div>
          <div v-if="tester" >
         <ion-row>
             <ion-col size="12" class="ion-text-center">
                 <ion-note>Entrer l'email que vous avez utilise pour creer le compte nous allons envoyer un lien de renitialisation de votre mot de mot de passe</ion-note>
             </ion-col>
         </ion-row>
         <ion-item>
             <ion-icon slot="start" :icon="mail" color="primary" ></ion-icon>
             <ion-input type="text" v-model="userDetail.email"></ion-input>
         </ion-item>
          </div>
           <ion-button v-on:click="Reni()" expand="block" size="large" >
                 Renitialiser
             </ion-button>
      </ion-content>
  </ion-page>
</template>

<script>
import app from '@/firebase'
import { getAuth, sendPasswordResetEmail, } from '@firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from '@firebase/firestore'
import{IonPage,IonContent,IonHeader,IonToolbar,IonButton, alertController, modalController, loadingController,IonRow,IonCol,IonNote,IonItem,IonInput,IonIcon} from '@ionic/vue'
import { defineComponent, reactive } from '@vue/runtime-core'
import axios from 'axios'
import {closeCircle,person,call,mail} from 'ionicons/icons'
export default defineComponent ({
 name:"RestartCodeu",
 components:{
     IonPage,
     IonContent,
     IonToolbar,
     IonButton,
     IonHeader,
     IonIcon,
     IonRow,
     IonCol,
     IonNote,
     IonItem,
     IonInput,
 },
 props:['tester'],
 setup(props){
     let userDetail = reactive({name:"",NumberPhone:"",email:""})
     const closeModal = ()=>{
         modalController.dismiss()
     }
     const Reni=async()=>{
        if(window.navigator.onLine==false){
            const alert = await alertController.create({message:"Veillez activer votre internet"})
              alert.present()
              return
        }
          const attendre = await loadingController.create({message:"patientez s'il vous plait"})
         try {
              const db = await getFirestore(app)
              const auth = await getAuth(app)
        if(props.tester==false){
         let regexNumber = /^(\+\d{3}\s?)?\(?6\d{2}\)?[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d{2}$/
          if(regexNumber.test(userDetail.NumberPhone)==false){
              const alert = await alertController.create({message:"numero non valide"})
              alert.present()
              return
          }
          if(userDetail.name=="" || !userDetail.name){
              const alert = await alertController.create({message:"prenom et nom invalide"})
              alert.present()
              return
          }
          attendre.present()
          const refAlluser = await query(collection(db,"USERS"),where("UserNumberPhone","==",userDetail.NumberPhone))
          const Alluser = await getDocs(refAlluser)
          let take =[]
          Alluser.forEach((element)=>{
              let data=element.data()
              if(data.nom==userDetail.name){
             take.push(element.data())
              }
              
          })
          if(!take[0]){
              const alert = await alertController.create({message:"aucun compte sur ces renseignements"})
              alert.present()
              attendre.dismiss()
              return
          }else{
              const reft = await doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA")
              const t = await getDoc(reft)
              if(t.exists()){
                  let tak = t.data()
                   await axios.post(
    'https://chachap.herokuapp.com/https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${userDetail.NumberPhone}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
                'message': `Bonjour Mr/Mme ${userDetail.name} \n  Voici votre codeU: ${take[0].VerifyCode}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${tak.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
).then(async()=>{
    modalController.dismiss()
     const alert = await alertController.create({message:"Nous avons envoyer votre CodeU sur votre numero"})
            alert.present()
            attendre.present()
            return
})
              }
          }
       }else{
         let mailregex=/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
         if(mailregex.test(userDetail.email)==false){
             const alert = await alertController.create({message:"Email invalide"})
             alert.present()
             return
         }
         attendre.present()
        await sendPasswordResetEmail(auth,userDetail.email).then(async()=>{
            modalController.dismiss()
            const alert = await alertController.create({message:"Nous avons envoyer le lien de renitialisation sur votre email"})
            alert.present()
            attendre.dismiss()
            return
        })
       }
         } catch (error) {
            const alert = await alertController.create({message:"erreur reessayer"})
            alert.present() 
            attendre.dismiss()
         }
        
     }
     return{
      close,
      person,
      mail,
      call,
      userDetail,
      closeCircle,
      Reni,
      closeModal
     }
 }
})
</script>

<style scoped>
 ion-toolbar ion-icon{
     font-size: 30px;
 }
</style>