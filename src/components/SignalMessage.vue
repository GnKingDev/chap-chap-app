<template>
  <ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-icon  :icon="closeCircle" @click="CloseModal()" color="danger" ></ion-icon>
          </ion-toolbar>
      </ion-header>
      <ion-content>
       <div class="conten">
           <div>
          <h6>Veillez nous d'ecrire un peu le pourquoi</h6>
             <ion-textarea v-model="value.value" placeholder="votre message ici" ></ion-textarea>
            <ion-button v-on:click="send()" :disabled="value.isActive" >
               Envoyer
           </ion-button>
           </div>
           
       </div>
      </ion-content>
  </ion-page>
</template>

<script>
import app from '@/firebase';
import { arrayUnion, doc,  getFirestore, updateDoc } from '@firebase/firestore'
import {IonPage,IonTextarea,IonButton, modalController, alertController, toastController,IonHeader,IonContent,IonToolbar,IonIcon} from '@ionic/vue'
import { defineComponent, reactive } from '@vue/runtime-core'
import { closeCircle } from 'ionicons/icons';
export default defineComponent ({
name:"SignalMessage",
components:{
    IonPage,
    IonTextarea,
    IonButton,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon
},
props:['id'],
setup(props){
let value = reactive({value:"",isActive:false})
const send= async()=>{
    if(value.value=="" || !value.value){
        const alert = await alertController.create({message:"veillez ecrire le pourquoi",
        buttons:[{
            text:"ok",
            cssClass:"primary",
            handler:async()=>{
            return
            }
        }]
        })
        alert.present()
        return
    }
    value.isActive=true
 const db = await getFirestore(app)
 const docap = await doc(db,"APPINFO","SignalMessage")
 await updateDoc(docap,{
     AllMessage:arrayUnion({idUser:props.id,message:value.value})
 }).then(async()=>{
    modalController.dismiss()
    const alert = await alertController.create({
        header:"merci",
        subHeader:"cela nous aide a mieux vous fournir des meilleurs produits nous allons immediatement informe ce fournisseurs",
        buttons:[{
            text:"ok",
            cssClass:"primary",
            handler:()=>{
                return
            }
        }]
    })
    alert.present()
    value.isActive=false
 }).catch(async()=>{
     const toast = await toastController.create({message:"message non envoye",duration:3000})
     toast.present()
 })
}
const CloseModal = ()=>{
     modalController.dismiss()
 }
return{
    value,
    closeCircle,
    send,
    CloseModal
}
}
})
</script>

<style scoped>
.conten{
    display: flex;
    justify-content: center;
    align-items: center;
}
ion-icon{
    font-size: 30px;
}

</style>