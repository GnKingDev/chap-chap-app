<template>
 <ion-page>
      <ion-content :fullscreen="true">
         <ion-list   class="ion-margin">
             <ion-list-header>
                 <ion-label class="ion-text-center" > S'IDENTIFIER</ion-label>
             </ion-list-header>
             <div v-if="test.test==false">
             <ion-item class="ion-margin-vertical " mode="md" >
                 <ion-icon slot="start" :icon="person" color="primary" ></ion-icon>
                 <ion-input type="text" placeholder="Votre CodeU" v-model="test.codeU" ></ion-input>
             </ion-item>
             </div>
             <div v-if="test.test">
              <ion-item class="ion-margin-vertical">
                 <ion-icon slot="start" :icon="mail" color="primary" ></ion-icon>
                 <ion-input type="text" placeholder="Email" v-model="test.testEmal"></ion-input>
             </ion-item>
              <ion-item class="ion-margin-vertical ">
                 <ion-icon slot="start" :icon="lockClosed" color="primary" ></ion-icon>
                 <ion-input :type="test.password" placeholder="mot de passe" v-model="test.testpassword"  ></ion-input>
                 <ion-icon slot="end" :icon="test.password=='password' ? eye : eyeOff" color="primary" @click="Change()" ></ion-icon>
             </ion-item>
             </div>
             <ion-button v-on:click="verify()" expand="block" size="large">
                 Me connecter
             </ion-button>
             <ion-text class="ion-text-center">
                 <p>
                     <ion-note>Avez-vous oublier votre {{test.text}}</ion-note>
                     <ion-text color="primary" class="text" @click="openModal()">
                         oui
                     </ion-text>
                 </p>
             </ion-text>
         </ion-list>
        
      </ion-content>
      <ion-footer>
          <ion-toolbar mode="md" class="ion-text-center">
              <ion-note>Vous n'avez pas de compte</ion-note>
              <ion-text color="primary" @click="signup()">
                S'inscrire ici
              </ion-text>
          </ion-toolbar>
      </ion-footer>
 </ion-page>
</template>
<script>
import { defineComponent, reactive } from "@vue/runtime-core";
import { person,call,mail,lockClosed,eye,eyeOff } from 'ionicons/icons' 
import { IonContent,IonPage,IonList,IonListHeader,IonLabel,IonItem,IonInput,alertController,loadingController,IonIcon,IonNote,IonButton,IonText,IonFooter,IonToolbar,onIonViewWillEnter, onIonViewDidEnter, modalController} from '@ionic/vue';
import { collection,  getDocs, getFirestore, query, where } from "@firebase/firestore";
import app from "@/firebase";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import router from "@/router";
import store from "@/VerifyUserStore";
import RestartCodeu from '@/components/RestartCodeu.vue'
export default defineComponent ({
    name:"CodeU",
    components:{
   IonPage,
   IonContent,
   IonList,
   IonListHeader,
   IonLabel,
   IonItem,
   IonInput,
   IonIcon,
   IonNote,
   IonButton,
   IonText,
   IonFooter,
   IonToolbar
    
},
setup(){
    const Change = ()=>{
        if(test.password=='password'){
           test.password='text'
       }else{
           test.password='password'
       }
    }
    onIonViewWillEnter(()=>{
         store.get('t').then((value)=>{
          test.test=value
          if(test.test==false){
              test.text="Code U"
          }else{
              test.text="Mot de passe"
          }
    })
    })
    onIonViewDidEnter(async()=>{
         const attendre=await loadingController.create({message:"Veillez activer votre internet"})
    window.addEventListener("offline",()=>{
        attendre.present()
    })
    window.addEventListener("online",()=>{
        attendre.dismiss()
    })
    })
    //open modal
    const openModal = async ()=>{
      const modal = await modalController.create({
       component:RestartCodeu,
       componentProps:{tester:test.test},
       cssClass:"modalCodeU",
      })
      modal.present()
    }
    //fin open modal
    let test =reactive({test:false,codeU:"",testEmal:"",testpassword:"",text:"",password:"password"})

    const verify=async ()=>{
        if(window.navigator.onLine==false){
            const alert = await alertController.create({message:"Veillez activer votre connection"})
            alert.present()
            return
        }
       
        const attendre = await loadingController.create({message:"patientez s'il vous plait"})
        attendre.present()
        try {
             const db = await getFirestore(app)
        const auth = await getAuth(app)
         if(test.test==false){
              if(test.codeU=="" || !test.codeU){
            const alert = await alertController.create({message:"Veillez ecrire votre Code U"})
            alert.present()
            return
        }
        const requete = await query(collection(db,"USERS"),where('VerifyCode',"==",`${test.codeU}`))
        const UserConnect = await getDocs(requete)
        let userData=[]
        UserConnect.forEach(async(element)=>{
           userData.push(element.data())
        })

       if(!userData[0]){
             const alert = await alertController.create({message:`Aucun compte n'est enregistre sur ce code`})
            alert.present()
            attendre.dismiss()
            return
        } else{
           await signInWithEmailAndPassword(auth,`${userData[0].email}`,`${userData[0].MotdePasse}`).then(()=>{
            setTimeout(()=>{
                attendre.dismiss()
                router.replace({path:"/tabs/tab1"})
                
            },3000)
            
            return
        })
        }
        }else{
             let mailregex=/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
             if(mailregex.test(test.testEmal)==false){
                 const alert = await alertController.create({message:"email invalide"})
                 alert.present()
                 attendre.dismiss()
                 return
             }
         await signInWithEmailAndPassword(auth,test.testEmal,test.testpassword).then(()=>{
              setTimeout(()=>{
                router.replace({path:"/tabs/tab1"})
                attendre.dismiss()
            },3000)
            return
         })
        }
        } catch (error) {
            const alert = await alertController.create({message:"erreur  email,password incorrecte"})
            alert.present()
            attendre.dismiss()
        }
       
    }
    const signup=()=>{
        router.replace({path:"/CreateAcountPage"})
    }
    return{
        person,
        call,
        mail,
        lockClosed,
        test,
        verify,
        signup,
        openModal,
        Change,
        eye,
        eyeOff
    }
}
})
</script>
<style scoped lang="scss" >
.text{
    font-size: 22px;
}
a{
    text-decoration: none;
}
ion-list{
    transform: translateY(10vh);
    ion-list-header{
        margin-bottom: 5vh;
        letter-spacing: 1px;
        ion-label{
            font-weight: bold;
            font-size: 1.5rem;
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        }
    }
}
     
ion-footer{
    ion-text{
        font-size: 1.2rem;
    }
    ion-note{
        font-size: 1rem;
    }
}

</style>