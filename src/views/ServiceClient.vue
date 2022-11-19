<template>
  <ion-page>
     <ion-header class="ion-no-border">
       <ion-toolbar>
         <ion-back-button slot="start" default-href="/tabs/tab1"></ion-back-button>
         <MenuName :title="nom" />
       </ion-toolbar>
     </ion-header>
    <ion-content>
      <ion-img :src="require('../images/contactus.jpg')"></ion-img>
      <h5 class="text"> contatez nous si vous rencontrez un probleme d'achat ou quoi que sa soit concernant l'application</h5>
      <h5 class="text2">sur  <a href="tel:+224666296999">+224 666296999</a>  ou <a href="mailto:Contact@chapchap.store">Contact@chapchap.store</a></h5>
      <h5 class="text2">nous envoyer un message directement en mettant dans le  message votre numero de telephone ou le mail nous allons vous repondre le plus vite que possible</h5>
     <ion-item>
       <ion-label position="floating"> Votre message</ion-label>
       <ion-textarea placeholder="votre message ici" :autofocus="true" v-model="Message"></ion-textarea>
     </ion-item> 

     <ion-button shape="round" @click="sendMessage()" :disabled="btnSend"  >
         <ion-icon :icon="send" ></ion-icon>  <span></span>
         envoyer
       </ion-button>

    </ion-content>
  </ion-page>
</template>

<script >
import { defineComponent } from 'vue';
import { IonPage,  IonToolbar,  IonContent,IonBackButton ,IonHeader,IonTextarea,IonImg,IonLabel,IonButton,IonIcon,IonItem,loadingController,toastController, alertController} from '@ionic/vue';
 import{send}from 'ionicons/icons'
 import MenuName from '@/components/MenuName.vue'
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import app from '@/firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
export default defineComponent({
  name: 'ServiceClient',
  components: {    
   IonContent, 
   IonPage,
   IonToolbar,
   IonBackButton,
   IonHeader,
   MenuName,
   IonTextarea,
   IonImg,
   IonLabel,
   IonButton,
   IonIcon,
   IonItem,
   },
   data(){
     return{
       send,
       nom:"Service client",
       ContacNumber:"",
       yes:undefined,
       Message:"",
       loadingController,
       toastController
     }
   },

   async ionViewDidEnter(){
  const attendre=await loadingController.create({message:"Veillez activer votre internet"})
    window.addEventListener("offline",()=>{
        attendre.present()
    })
    window.addEventListener("offline",()=>{
        attendre.dismiss()
    })

},
  
   computed:{
     btnSend(){
       if(this.Message){
         return false
       } else{
         return true
       }
     }
   },
   methods:{
    async sendMessage(){
      if(window.navigator.onLine==false){
        const alert = await alertController.create({message:"Veillez activer votre internet"})
        alert.present()
        return
      }
      const attendre = await loadingController.create({message:"patientez"})
      attendre.present()
      try {
        const db = await getFirestore(app)
        const auth = await getAuth(app)
        await onAuthStateChanged(auth,async(user)=>{
          if(user){
            const refuser = await doc(db,"APPINFO","UserMessages")
            const UserRef = await doc(db,"USERS",user.uid)
            const UserInfo= await getDoc(UserRef)
            let take ={}
            if(UserInfo.exists()){
              take=UserInfo.data()
            }
            await updateDoc(refuser,{
              AllMessage:arrayUnion({
                idUser:user.uid,
                NomUser:take.nom,
               CodeU : take.VerifyCode,
               Ville:take.ville,
               message:this.Message
              })
            }).catch(async()=>{
              const toast = await toastController.create({message:"message non envoyer reessayer",duration:2000})
            attendre.dismiss()
            toast.present()
            })
            const toast = await toastController.create({message:"message envoye avec succes vous serez contacte par l'equipe chap chap",duration:2000})
            attendre.dismiss()
            toast.present()
            
          }else {
             const refuser = await doc(db,"APPINFO","UserMessages")
             await updateDoc(refuser,{
              AllMessage:arrayUnion({
               message:this.Message
              })
            })
             const toast = await toastController.create({message:"message envoye avec succes vous serez contacte par l'equipe chap chap",duration:2000})
            attendre.dismiss()
            toast.present()
          }
        })
      } catch (error) {
        attendre.dismiss()
         const toast = await toastController.create({message:`message non envoyer reessayer ${error.message}`,duration:2000})
            attendre.dismiss()
            toast.present()
      }
        
      
        
     }
   }
});
</script>
<style  scoped>
.text{
  text-align: center;
   color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 2px;
}
.text2{
   text-align: center;
   color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 2px;
}
ion-button{
  text-align: center;
  margin-top: 10px;
  margin-left: 100px;

}

</style>