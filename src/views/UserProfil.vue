<template>
<ion-page>
    <ion-header>
        <ion-toolbar >
          <ion-menu-button menu="Menu" slot="start" color="primary"></ion-menu-button>
      </ion-toolbar>
    </ion-header>
  <ion-content >
      <div v-if="Info.succes">
      
  <ion-grid class="main-header">
      <div align="center" >
          <span class="group">
            <ion-avatar @click="ChangePicture()" >
          <img :src="Info.UserInfo.LinkPhoto" />
      </ion-avatar>
      <span class="badge"> <ion-icon  :icon="camera" @click="ChangePicture()" ></ion-icon> </span>
          </span>
      </div>
  </ion-grid>
  <ion-row class="row">
      <ion-col size="6">
          <ion-item lines="none" class="ion-text-center">
            <ion-icon  :icon="cart" color="primary" ></ion-icon>
              <ion-label>
                  {{Info.UserInfo.NombreAchat}}
                  <p>Achats</p>
              </ion-label>
          </ion-item>
      </ion-col>
      <ion-col size="6">
          <ion-item lines="none" class="ion-text-center">
            <ion-icon  :icon="restaurant" color="primary" ></ion-icon>
              <ion-label>
                  {{Info.UserInfo.NombreAchatResto}}
                  <p>Achats Resto</p>
              </ion-label>
          </ion-item>
      </ion-col>
  </ion-row>

  <ion-row class="ion-padding">
      <ion-col size="6">
     <ion-item>
         <ion-label position="floating" >Prenom et Nom</ion-label>
         <ion-input v-model="Info.UserInfo.nom"></ion-input>
     </ion-item>
      </ion-col>
       <ion-col size="6">
     <ion-item>
         <ion-label position="floating" >Email</ion-label>
         <ion-input v-model="Info.UserInfo.EmailUser"></ion-input>
     </ion-item>
      </ion-col>
  </ion-row>
   <ion-row class="ion-padding" v-if="Info.hidenumber">
      <ion-col size="8">
     <ion-item>
         <ion-label position="floating" >Numero de Telephone</ion-label>
         <ion-input v-model="Info.UserInfo.UserNumberPhone"></ion-input>
     </ion-item>
      </ion-col>
  </ion-row>
  <ion-row class="ion-padding">
      <ion-col size="8">
     <ion-item>
         <ion-label position="floating" >Adresse de livraison</ion-label>
         <ion-input v-model="Info.UserInfo.AdresseLivrason"></ion-input>
     </ion-item>
      </ion-col>
       <ion-col size="4">
     <ion-item :disabled="true">
         <ion-label position="floating" >Code U</ion-label>
         <ion-input v-model="Info.UserInfo.VerifyCode"></ion-input>
     </ion-item>
      </ion-col>
  </ion-row>
  <div>
      <ion-button v-on:click="MAJ(Info.UserInfo.id)" fill="solid" expand="block" class="ion-padding" :disabled="Info.MajBtn">
          Mettre a jour
      </ion-button>
  </div>
   <div>
      <ion-button v-on:click="Suppre(Info.UserInfo.id)" fill="solid" expand="block" class="ion-padding" color="danger" >
          Supprimer mon Compte
      </ion-button>
  </div>
</div>

   <div align="center"  v-if="Info.succes==false">
         <ion-img :src="require('../images/erreurImage.png')"></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

  </ion-content>
</ion-page>
</template>

<script>
import app from "@/firebase";
import { deleteUser, EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signOut, updateEmail } from "@firebase/auth";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getFirestore, updateDoc } from "@firebase/firestore";
import {IonContent,IonGrid,IonAvatar,IonToolbar,IonMenuButton,IonPage,IonRow,IonCol,IonLabel,IonItem,IonIcon,IonInput,IonButton,onIonViewWillEnter, loadingController, alertController,IonImg, toastController, modalController,IonHeader} from "@ionic/vue"
import { defineComponent, onMounted, reactive } from "@vue/runtime-core";
import axios from "axios";
import ProflPicture from '@/components/ProfilPicture.vue'
import { cart,restaurant,camera, alert, } from 'ionicons/icons';
import store from "@/VerifyUserStore";
import router from "@/router";
export default defineComponent ({
name:"UserProfl",
components:{
    IonContent,
    IonGrid,
    IonAvatar,
    IonToolbar,
    IonMenuButton,
    IonPage,
    IonRow,
    IonCol,
    IonLabel,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonImg,
    IonHeader
},
setup(){
    const Suppre = async(id)=>{
        try {
            
       
        const alert = await alertController.create({
            header:"voulez-vous supprimer votre compte ? ",
            message:"vous allez perdre tous vos historiques achats ,favoris et vos renseignements seront supprimer dans notre base de donnees vous aurez besion de creer un nouveau compte si voulez utiliser l'application ",
            buttons:[{
                text:"non",
                cssClass:"primary",
                handler:()=>{
                    return
                }
            },{
                text:"oui et je confirme",
                cssClass:"danger",
                handler:async()=>{
                   const a1 = await alertController.create({
                    header:"Veillez entrer votre mot de passe",
                    inputs:[{
                        id:"pasword",
                        name:"pasword"
                    }],
                    buttons:[{
                        text:"Annuler",
                        cssClass:"primary",
                        handler:()=>{
                            return
                        }
                    },{
                        text:"Confirme",
                        cssClass:"primary",
                        handler:async(data)=>{
                            try {
                                 const attendre = await loadingController.create({message:"veillez patientez"})
                    attendre.present()
                    const auth = getAuth(app)
                    const user = auth.currentUser
                      const credential = EmailAuthProvider.credential(auth.currentUser.email,data.pasword)
                      reauthenticateWithCredential(user,credential).then(()=>{
                        deleteUser(user).then(async()=>{
                            attendre.dismiss()
                            router.replace({path:"/CreateAcountPage"})
                            const t = await toastController.create({message:"Votre compte a ete supprimer avec succes",duration:2000})
                            t.present()
                        }).catch(async()=>{
                            attendre.dismiss()
                             const a = await alertController.create({message:"erreur ou mot de passe incorecte reessayer"})
                               a.present()
                        })
                      }).catch(async()=>{
                        attendre.dismiss()
                          const a = await alertController.create({message:"erreur ou mot de passe incorecte reessayer"})
                               a.present()
                      })
                            } catch (error) {
                                 const a = await alertController.create({message:"erreur ou mot de passe incorecte reessayer"})
                               a.present()
                            }
                          

                        }
                    }]
                   })
                   a1.present()
                }
            }]
        })
        alert.present()
         } catch (error) {
            const a = await alertController.create({message:"erreur reessayer"})
            a.present()
        }
         
    }
    const Info = reactive({UserInfo:{},succes:undefined,oldNumber:"",MajBtn:false,hidenumber:undefined})
    onIonViewWillEnter(()=>{
        store.get('t').then((value)=>{
            if(value==true){
                Info.hidenumber=false
            }else{
                Info.hidenumber=true
            }
        })
    })
    const ChangePicture = async ()=>{
     const modal= await modalController.create({
         component:ProflPicture,
         componentProps:{CodeU:Info.UserInfo.VerifyCode,id:Info.UserInfo.id},
         cssClass:"my-modal-component-css",
     })
     modal.present()
     modal.onDidDismiss().then((data)=>{
         if(data.data.data){
             Info.UserInfo.LinkPhoto=data.data.data
         }
         
     })
    }
    const MAJ = async (id)=>{
        console.log(id)
        try {
            Info.MajBtn=true
             const db = await getFirestore(app) 
             const refT = await doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA") 
            //cas de verfication number Phone
            if(Info.UserInfo.UserNumberPhone!=Info.oldNumber){
            let regexNumber = /^(\+\d{3}\s?)?\(?6\d{2}\)?[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d{2}$/
            if(regexNumber.test(Info.UserInfo.UserNumberPhone)==false){
                const alert = await alertController.create({message:"Veillez rentre un numero valide"})
                alert.present()
                Info.MajBtn=false
                return
            }
             const t = await getDoc(refT)
             let NewCode = doc(collection(db,"USERS"))
             let Code = NewCode.id[0]+NewCode.id[7]+NewCode.id[2]+NewCode.id[4]
             if(Code=="" || !Code){
                 const alert = await alertController.create({message:"Erreur reessayer"})
                alert.present()
                Info.MajBtn=false
                return
             }
             if(t.exists()){
                 let take = t.data()
                  await axios.post(
    'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${Info.UserInfo.UserNumberPhone}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
                'message': `Bonjour Mr/Mme ${Info.UserInfo.nom} \n Voici votre code de verfcation de votre nouveau numero:${Code}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
).then(async()=>{
 const alert = await alertController.create({
                header:"Verificaton",
                subHeader:`Nous avons envoye un code de confirmation sur votre nouveau numero`,
                backdropDismiss:false,
                inputs:[{
                    placeholder:"le code ici",
                    name:"Code",
                    id:"Code",
                }],
                buttons:[{
                    text:"Verifier",
                    cssClass:"primary",
                    handler:async(data)=>{
                     if(data.Code==Code){
                const refuser = await doc(db,"USERS",id)
           await updateDoc(refuser,{
               nom:Info.UserInfo.nom,
               UserNumberPhone:Info.UserInfo.UserNumberPhone,
              AdresseLivrason:Info.UserInfo.AdresseLivrason,
              EmailUser:Info.UserInfo.EmailUser,
           }).then(async()=>{
            Info.UserInfo.abonement.forEach(async element => {
                const refFour = doc(db,"FOURNISSEURS",element)
                await updateDoc(refFour,{
                    AbonementUser:arrayRemove(Info.oldNumber)
                }).then(async()=>{
                  await updateDoc(refFour,{
                    AbonementUser:arrayUnion(Info.UserInfo.UserNumberPhone)
                  })
                }).then(async()=>{
                 Info.MajBtn=false
               const toast = await toastController.create({message:"Mise a jour effectue",duration:3000})
                   toast.present()
                })
            });
            
           })
          
                     }else{
                         const toast = await toastController.create({message:"Code Incorrecte mse a jour non effectue",duration:5000})
                         Info.MajBtn=false
                         Info.UserInfo.UserNumberPhone=Info.oldNumber
                         toast.present()
                     }
                    }

                },{
                    text:"Annuler",
                    cssClass:"primary",
                    handler:()=>{
                     Info.MajBtn=false
                     Info.UserInfo.UserNumberPhone=Info.oldNumber
                       return
                    }
                }]
            })
            alert.present()
 return
})
             }
            
        }else{
           const refuser = await doc(db,"USERS",id)
           await updateDoc(refuser,{
               nom:Info.UserInfo.nom,
               UserNumberPhone:Info.UserInfo.UserNumberPhone,
              AdresseLivrason:Info.UserInfo.AdresseLivrason,
              EmailUser:Info.UserInfo.EmailUser,
           }).then(async()=>{
           Info.MajBtn=false
           const toast = await toastController.create({message:"Mise a jour avec succes",duration:3000})
           toast.present()
           })
           
        }
            //fin cas de verificaton
          
          
        } catch (e) {
            const alert = await alertController.create({message:"erreur internet"})
            alert.present()
            Info.UserInfo.UserNumberPhone=Info.oldNumber
            Info.MajBtn=false
        }
    }
    const TryAgain = async ()=>{
     if(window.navigator.onLine==false){
            Info.succes=false
            const alert = await alertController.create({message:'Veillez activer votre internet'})
            alert.present()
            return
        }
         const attendre = await loadingController.create({message:"Patientez s'il vous plait"})
        attendre.present()
        try {
             const db = await getFirestore(app)
     const auth = await getAuth(app)
     await onAuthStateChanged(auth,async(user)=>{
         if(user){
         const refUser = await doc(db,"USERS",user.uid)
         const Doc = await getDoc(refUser)
         if(Doc.exists()){
             Info.UserInfo=Doc.data()
             Info.oldNumber=Info.UserInfo.UserNumberPhone
             attendre.dismiss()
             Info.succes=true
         }
         }
     })
        } catch (error) {
            attendre.dismiss()
            Info.succes=false
        }

    }
    onMounted(async()=>{
        if(window.navigator.onLine==false){
            Info.succes=false
            return
        }
       
        const attendre = await loadingController.create({message:"Patientez s'il vous plait"})
        attendre.present()
        try {
             const db = await getFirestore(app)
     const auth = await getAuth(app)
     await onAuthStateChanged(auth,async(user)=>{
         if(user){
         const refUser = await doc(db,"USERS",user.uid)
         const Doc = await getDoc(refUser)
         if(Doc.exists()){
             Info.UserInfo=Doc.data()
              Info.oldNumber=Info.UserInfo.UserNumberPhone
             attendre.dismiss()
             Info.succes=true
             
         }
         }else{
            const alert = await alertController.create({
                header:"Vous n'avez pas de compte",
                message:"Vous devez avoir un compte pour utiliser cette fonctionalite voulez vous creer un compte ?",
                buttons:[{
                    text:"Non",
                    cssClass:"primary",
                    handler:()=>{
                        router.back()
                        return
                    }
                },{
                    text:"creer un compte",
                    cssClass:"primary",
                    handler:()=>{
                        router.push({path:"/CreateAcountPage"})
                    }
                }]
                
            })
            alert.present()
            attendre.dismiss()
         }
     })
        } catch (error) {
            attendre.dismiss()
            Info.succes=false
        }
    
    })
    return{
        cart,
        restaurant,
        Info,
        camera,
        TryAgain,
        ChangePicture,
        MAJ,
        Suppre
    }
}
})
</script>

<style lang="scss" scoped>
ion-content{
    .main-header{
        height: 28vh;
        width: 120%;
       background: linear-gradient(90deg,#03A61c 0%,#03A61c 100%);
       border-radius: 0 0 50% 50%;
       box-shadow: 0 1px 10px var(--ion-color-light);
       margin-left: -4.5vh;
       margin-top: -5px;
       div{
           transform: translateY(2vh);
           ion-avatar{
               width: 15vh;
               height: 15vh;
               background: var(--ion-color-light);
               margin-bottom: 5px;
               border: 7px solid var(--ion-color-primary);
               position: relative;
           }
       }

    }
    .row{
        margin-top: -60px;
        ion-col{
            ion-item{
                width: 94%;
                margin: auto;
                border: 1px solid var(--ion-color-light);
                box-shadow: 1px var(--ion-color-dark);
                border-radius: 5px;
                ion-label{
                    font-weight: 1.8rem;
                    font-weight: bold;
                    p{
                        font-size: 0.7rem;
                    }
                }
                ion-icon{
                    font-size: 2rem;
                }
            }
        }
    }
}
.erreur{
    text-align: center;
}

.badge {
            position: relative;
            top: -30px;
            right: -25px;
           font-size: 20px;
        }

</style>