<template>
 <ion-header class="ion-no-border">
     <ion-toolbar mode="md" class="ion-padding">
         <ion-title slot="start">Changer la photo</ion-title>
         <ion-icon slot="end" :icon="closeCircle" @click="CloseModal()" color="danger" ></ion-icon>
     </ion-toolbar>
 </ion-header>
  <ion-content>
       <ion-row class="ion-padding" align="center">
           <ion-col size="6" align="center">
               <ion-card @click="useCamera()">
                   <ion-icon :icon="image" color="primary" ></ion-icon>
                   <h3>Gallery</h3>
               </ion-card>
           </ion-col>
       </ion-row>
     </ion-content>
</template>

<script>
import { closeCircle,camera,image } from 'ionicons/icons';
import {IonToolbar,IonTitle,IonIcon,IonHeader,IonContent,IonRow,IonCol,IonCard, modalController, alertController, loadingController, toastController} from '@ionic/vue'
import { defineComponent } from '@vue/runtime-core';
import { Camera, CameraResultType } from '@capacitor/camera';
import {getDownloadURL, getStorage,ref,uploadString} from 'firebase/storage'
import app from '@/firebase';
import { doc, getFirestore, updateDoc } from '@firebase/firestore';
export default defineComponent( {
name:"ProflPicture",
components:{
    IonToolbar,
    IonTitle,
    IonIcon,
    IonHeader,
    IonContent,
    IonRow,
    IonCol,
    IonCard
},
props:['CodeU','id'],
setup(props){ 
    const useCamera=async ()=>{
       Camera.getPhoto({
         quality: 90,
      resultType: CameraResultType.DataUrl,
     }).then(async(img)=>{
         const attendre = await loadingController.create({message:`Veillez Patenter`})
         attendre.present()
        
         try {
         const storage = getStorage(app)
         const refStorage = ref(storage,`defaultPcture/${props.CodeU}`)
         const url =img.dataUrl
        await uploadString(refStorage,url,"data_url").then((snapshot)=>{
         getDownloadURL(snapshot.ref).then(async(result)=>{
            const db = await getFirestore(app)
            const refuser = doc(db,"USERS",props.id)
            await updateDoc(refuser,{
                LinkPhoto:result
            }).then(async()=>{
                modalController.dismiss({data:result})
                attendre.dismiss()
                const toast = await toastController.create({message:"Votre photo a ete mise a jour",duration:2000})
                toast.present()
            })
         })
        })
      } catch (error) {
             const alert = await alertController.create({message:`${error.message} firebase`}) 
             alert.present()
             attendre.dismiss()
         }
         
     }).catch(async(error)=>{
         const alert = await alertController.create({message:`${error.message}`}) 
         alert.present()
     })
    }   
    const CloseModal = async()=>{
        modalController.dismiss()
    }
    return{
        closeCircle,
        camera,
        image,
        CloseModal,
        useCamera
    }
}

})
</script>

<style lang="scss" scoped>
ion-header{
    ion-icon{
        font-size: 30px;
    }
}
ion-card{
    ion-icon{
        font-size: 60px;
    }
}

</style>