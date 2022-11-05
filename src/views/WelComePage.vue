<template>
    <ion-page>
    <ion-header  class="ion-no-border">
    </ion-header>
    
    <ion-content >
     <ion-card class="ion-no-margin">
        <ion-img :src="require('../images/Ecommerce web page-pana.png')"></ion-img>
         <ion-card-header>
              <ion-card-title>
                  WELCOME  votre code U a ete envoye sur ce  numero ({{this.$route.params.UserNumberPhone}}) a garder soigneusement
            </ion-card-title>
         </ion-card-header>
         <ion-card-content>
             <ion-item>
                 <ion-label>Code U</ion-label>
                 <ion-input type="text" maxlength="4" v-model="VerifyCode"></ion-input>
             </ion-item>
             <div class="forbtn">
                 <ion-button fill="solid" shape="round" class="conexbtn" @click="GotoConnection()" >
                     Commencer
                 </ion-button>
             </div>

         </ion-card-content>
        
     </ion-card>
    
    </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonHeader, IonPage , IonCard,IonImg ,IonCardTitle,IonCardHeader,IonCardContent,IonButton,IonInput,IonItem,IonLabel,loadingController,alertController} from '@ionic/vue';
import store from '@/VerifyUserStore';
import {
  createUserWithEmailAndPassword,
  getAuth, 
} from "firebase/auth";
import {  setDoc,getFirestore,doc, collection,} from "firebase/firestore"; 
import app from '@/firebase';
export default defineComponent ({
 name: 'WelcomePage',
  components: {
    IonContent,
    IonHeader,
    IonCard,
    IonImg,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonPage,
    IonItem,
    IonInput,
    IonLabel
    
  },

data(){
    return{
     VerifyCode:"",
     loadingController,
     alertController
    }
},

async ionViewDidEnter(){
  const attendre=await loadingController.create({message:"Veillez activer votre internet"})
    window.addEventListener("offline",()=>{
        attendre.present()
    })
    window.addEventListener("online",()=>{
        attendre.dismiss()
    })
},

methods:{
  async GotoConnection(){
      if(window.navigator.onLine==false){
          const alert = await alertController.create({message:"Veillez activer votre internet"})
          alert.present()
          return
      }
     if(this.VerifyCode==this.$route.params.VerifyCode){
      const attendre = await loadingController.create({message:"patientez s'il vous plait"})
      attendre.present()
      try {
          const db = await getFirestore(app)
          const auth = await getAuth(app)
          let UserName = this.$route.params.UserName.toLowerCase()
          let UserEmail = this.$route.params.UserName
          UserEmail=UserEmail.replace(/ /g,"")
        let UserTown = this.$route.params.UserTown
    const refuser = await doc(collection(db,"USERS"))
    let EmailUser = UserEmail+refuser.id[0]+refuser.id[2]+refuser.id[6]+refuser.id[4]+'@chapchap.com'
    await createUserWithEmailAndPassword(auth,EmailUser,refuser.id).then(async(user)=>{
        const refClient = await doc(db,"USERS",user.user.uid)
        await setDoc(refClient,{
            id:user.user.uid,
            MotdePasse:refuser.id,
            nom:UserName,
            VerifyCode:this.$route.params.VerifyCode,
            email:EmailUser,
            MesLike:[],
            Panier:[],
            ville:UserTown,
            UserNumberPhone:this.$route.params.UserNumberPhone,
            EmailUser:"",
            AdresseLivrason:"",
            NombreAchat:0,
            NombreAchatResto:0,
            abonement:[],
            LinkPhoto:'https://firebasestorage.googleapis.com/v0/b/onlinezaly.appspot.com/o/defaultPcture%2FR.png?alt=media&token=2a5a3d8e-2830-4e5e-8c31-efd454b23e79'
        }).then(async()=>{
             await store.set("UserTown",UserTown)
             this.$router.replace({path:"/tabs/tab1"})
             attendre.dismiss()
          return
        })
       
    })
      } catch (e) {
          const alert = await alertController.create({message:"erreur reessayer"})
          attendre.dismiss()
          alert.present()
      }
     }else{
         const alert = await alertController.create({message:"code incorrecte ou respecter les majuscules ou minijuscules"})
         alert.present()
     }
   } 
}
  
})
</script>

<style scoped>
ion-content{
   
    margin: 0px;
}
ion-toolbar{
    --ion-background-color: transparent;
    --ion-opacity: 0;
}
ion-header{
    position: absolute;
}
.forbtn{
    margin-top: 25px;
    text-align: center;
}
.conexbtn{
    --ion-color-primary:#03A61c;
}
.registerbtn{
    --ion-color-primary:#03A61c;
}
.text-tag{
    margin-top: 40px;
    text-align: center;
  
}
.text-tag span {
    text-align: center;
    font-size: 17px;
    font-weight: normal;
}
.SocialMedia{
    text-align: center;
     padding-top: 10px;
}

    
    
ion-card{
    --ion-background-color:transparent;
      box-shadow: none !important;
}
ion-card-title{
    font-size: 20px;
    text-align: center;
    color: #080808;
    font-weight: 600;
}
ion-card-subtitle{
    margin-top: 15px;
    font-size: 17px;
    color: #898585;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

  

</style>