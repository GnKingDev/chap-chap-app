<template>
 <ion-page>
      <ion-content :fullscreen="true">
         <ion-list lines="full"  class="ion-margin">
             <ion-list-header>
                 <ion-label class="ion-text-center" >INSCRIPTION </ion-label>
             </ion-list-header>
             <div v-if="test==false">
             <ion-item class="ion-margin-vertical " mode="md" >
                 <ion-icon slot="start" :icon="person" color="primary" ></ion-icon>
                 <ion-input type="text" placeholder="prenom et nom" v-model="UserValue"  ></ion-input>
             </ion-item>
              <ion-item class="ion-margin-vertical " mode="md" >
                 <ion-icon slot="start" :icon="call" color="primary" ></ion-icon>
                 <ion-input type="text" placeholder="ex:620137890" v-model="UserNumberPhone"  ></ion-input>
             </ion-item>
             </div>
             <div v-if="test">
              <ion-item class="ion-margin-vertical">
                 <ion-icon slot="start" :icon="mail" color="primary" ></ion-icon>
                 <ion-input type="text" placeholder="Email" v-model="testEmail"></ion-input>
             </ion-item>
              <ion-item class="ion-margin-vertical " >
                 <ion-icon slot="start" :icon="lockClosed" color="primary" ></ion-icon>
                 <ion-input :type="password" placeholder="mot de passe" v-model="TestPassword" ></ion-input>
                 <ion-icon slot="end" :icon="password=='password' ? eye : eyeOff" @click="Change()" color="primary"></ion-icon>
             </ion-item>
             </div>
             <ion-row>
                 <ion-col size="12" class="alignItems">
                     <ion-icon  :icon="checkmark" color="primary"></ion-icon>
                     <ion-note>En appuyant sur creer mon compte vous avez accepte les <a @click="OpenTerme()">conditions d'utilisations</a> </ion-note>
                 </ion-col>
             </ion-row>
             <ion-button v-on:click="AcountManager()" expand="block" size="large" >
                 Cree mon compte
             </ion-button>
            
             <ion-text class="ion-text-center">
                 <p>
                     <ion-note>Avez-vous deja un compte</ion-note>
                     <ion-text color="primary" class="text" @click="sidentifier()">
                         oui
                     </ion-text>
                 </p>
             </ion-text>
         </ion-list>
        
      </ion-content>
 </ion-page>
</template>

<script>
import { person,call,mail,lockClosed,checkmark,eye,eyeOff} from 'ionicons/icons' 
import { defineComponent} from 'vue';
import { IonContent,IonPage,IonList,IonListHeader,IonLabel,IonItem,IonInput,alertController,loadingController,IonIcon,IonRow,IonCol,IonNote,IonButton,IonText} from '@ionic/vue';
// pour firebase
import {
  createUserWithEmailAndPassword,
  getAuth, 
} from "firebase/auth";
import {  getFirestore,doc,  collection,  query, where, getDocs, getDoc, setDoc,  } from "firebase/firestore"; 
import app from'@/firebase'
import axios from 'axios'
//fin firebase
import store from '@/VerifyUserStore';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
export default defineComponent( {
name:'CreateAcountPage',
components:{
   IonPage,
   IonContent,
   IonList,
   IonListHeader,
   IonLabel,
   IonItem,
   IonInput,
   IonIcon,
   IonRow,
   IonCol,
   IonNote,
   IonButton,
   IonText
    
},
data(){
    return{
        loadingController,
        alertController,
        person,
        call,
        mail,
        checkmark,
        lockClosed,
        test:undefined,
        UserValue:"",
        forAcount:false,
        userTown:"",
        UserNumberPhone:"",
        //when test equal true
        testEmail:"",
        TestPassword:"",
        eye,
        eyeOff,
        password:"password"
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
ionViewWillEnter(){
    store.get('t').then((value)=>{
        this.test=value
        this.forAcount=value
    })
},


methods:{
    Change(){
       if(this.password=='password'){
           this.password='text'
       }else{
           this.password='password'
       }
    },
    OpenTerme(){
    Browser.open({url:"https://www.chapchap.store/Politique-de-confidentialite/one",toolbarColor:"#03A61c",})
    },
 async AcountManager(){
     //verification
     if(window.navigator.onLine==false){
         const alert = await alertController.create({message:"Veillez activer votre internet"})
         alert.present()
         return
     }
    
    //verification number phone
     const attendre = await loadingController.create({message:"patientez s'il vous plait"})
        attendre.present()
      
      try {
        
         await store.get("UserTown").then((value)=>this.userTown=value)
           const db = await getFirestore(app)
            const auth = await getAuth(app)
         if(this.forAcount==false){

             let regexNumber = /^(\+\d{3}\s?)?\(?6\d{2}\)?[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d{2}$/
    if(!regexNumber.test(this.UserNumberPhone)){
        const alert = await alertController.create({message:`Numero de telephone invalide`})
            alert.present()
            attendre.dismiss()
            return
    } 
    if(regexNumber.test(this.UserNumberPhone)){
        const db = await getFirestore(app)
        const refAlluser = await query(collection(db,"USERS"),where("UserPhoneNumber","==",this.UserNumberPhone))
        const AllUser = await getDocs(refAlluser)
        let take =[]
        AllUser.forEach((element)=>{
        take.push(element.data())
        })
        if(take[0]){
             const alert = await alertController.create({message:`Ce numero de telephone existe deja`})
            alert.present()
            attendre.dismiss()
            return
        } 
        
    }
              //verifictaion input
      if(!this.UserValue || this.UserValue==""){
       const alert = await alertController.create({message:`Veillez bien remplir le formulaire`})
            alert.present()
            return
     }
             if(!this.userTown || this.userTown==""){
                 const alert = await alertController.create({
                     header:"cette erreur provient de votre localisation ",
                 subHeader:"Assurer vous que votre localisation  est activer et accepter cliquer sur oui chap chap se fermera et reouvrir ",
                   buttons:[{
                       text:"oui",
                       cssClass:"primary",
                       handler:async()=>{
                         App.exitApp()
                       }
                   }]
                 })
                    alert.present()
                    attendre.dismiss()
                   return
             }
    //initiation de compte
    
       const refT = await doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA") 
       const refU = await doc(collection(db,'USERS'))
       let c = Math.floor(Math.random() * 10) + 1
       let codeU = refU.id[0]+refU.id[5]+refU.id[2]+c
       if(!codeU || codeU==undefined || codeU.includes('undefined ')){
           const alert = await alertController.create({message:"erreur reessayer"})
           attendre.dismiss()
           alert.present()
           return
       }
    const t = await getDoc(refT)
    let take 
    if(t.exists()){
        take=t.data()
    
         await axios.post(
    'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${this.UserNumberPhone}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
                'message': `Bonjour Mr/Mme ${this.UserValue.toUpperCase()} \n Bienvenue dans chap chap \n voici votre codeU: ${codeU} \n pour valider votre incription`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
).then(()=>{
 this.$router.push({name:"WelcomePage",params:{VerifyCode:codeU,UserNumberPhone:this.UserNumberPhone,UserName:this.UserValue,UserTown:this.userTown}})
 attendre.dismiss()
 return
})
         }
      } else{
        //creation de compte pour le testeur
        let mailregex=/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
        
        
        if(mailregex.test(this.testEmail)==false){
            const alert = await alertController.create({message:"Email incorrecte"})
            alert.present()
            attendre.dismiss()
            return
        }
        if(this.TestPassword.length<4 || this.TestPassword==""){
            const alert = await alertController.create({message:"le mot de passe doit etre superieur a 4"})
            alert.present()
            attendre.dismiss()
            return
        }
        await createUserWithEmailAndPassword(auth,this.testEmail,this.TestPassword).then(async(tester)=>{
             const refClient = await doc(db,"USERS",tester.user.uid)
              await setDoc(refClient,{
            id:tester.user.uid,
            MotdePasse:refClient.id,
            nom: "User",
            VerifyCode: refClient.id[3]+refClient.id[1]+refClient.id[0]+refClient.id[6],
            email:this.testEmail,
            MesLike:[],
            Panier:[],
            ville:this.userTown,
            UserNumberPhone:"628134567",
            EmailUser:this.testEmail,
            AdresseLivrason:"",
            NombreAchat:0,
            NombreAchatResto:0,
            abonement:[],
            LinkPhoto:'https://firebasestorage.googleapis.com/v0/b/onlinezaly.appspot.com/o/defaultPcture%2FR.png?alt=media&token=2a5a3d8e-2830-4e5e-8c31-efd454b23e79'
        }).then(async()=>{
             await store.set("UserTown",this.userTown)
             this.$router.replace({path:"/tabs/tab1"})
             attendre.dismiss()
          return
        })
        })
        
      }
 
 } catch (e) {
          const alert = await alertController.create({message:"erreur reessayer"})
          attendre.dismiss()
          alert.present()
      }
    

      

 },
 sidentifier(){
    this.$router.replace({path:"/CodeU"})
 },
  
  
 
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
    p{
        padding-top: 1vh;
    }
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
     

.footer{
    padding-top: 70px;
    text-align: center;
}
.wrapsignUpLogo{
    text-align: center;
}
.wrapsignUpLogo ion-button {
    margin-top: 10px;
}
ion-card-title{
    font-size: 20px;
    text-align: center;
    color: #080808;
    font-weight: 600;
}
.fbIcon{
    font-size: 40px;
}
.AcceuilWrap ion-label{
    text-align: center;
    font-weight: normal;
}
.erreur{
    text-align: center;
}
.isAcount{
    margin-top: 10px;
}
</style>