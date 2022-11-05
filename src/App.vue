<template>
  <ion-app>
    <ion-menu contentId="menu-content" menuId="Menu" side="start" type="overlay" :swipe-gesture="false" >
      <ion-content>
       <div class="menu-header-bg"></div>
       <div class="header-content">
        <img :src="userInfo.LinkPhoto" alt="">
        <ion-label>
          <h2> {{userInfo.nom}} </h2>
          <p> CodeU: {{ userInfo.VerifyCode}} </p>
        </ion-label>
       </div>
          <ion-list lines="none" class="menu-items">
            <ion-menu-toggle>
           <ion-item :button="true" routerLink="/HistoriqueAchat">
          <ion-icon slot="start" :icon="cart" class="IconActve" ></ion-icon>Historiques Achats
           </ion-item>
         <ion-item :button="true" routerLink="/MesFavoris">
          <ion-icon slot="start" :icon="heart" class="heart"></ion-icon>Mes Favoris
        </ion-item> 
        <ion-item :button="true" routerLink="/ServiceClient">
          <ion-icon slot="start" :icon="call" ></ion-icon>Services Clients
        </ion-item>
         <ion-item :button="true" @click="GotoMessge()">
          <ion-icon slot="start" :icon="chatbubble" ></ion-icon>Messages
          <ion-badge slot="end" v-if="userInfo.newMessage"> {{userInfo.countMessage}} </ion-badge>
        </ion-item>
         <ion-item :button="true" @click="goToCondition()" >
          <ion-icon slot="start" :icon="information" ></ion-icon>Termes et conditions
        </ion-item>
         <ion-item :button="true" @click="GotoTermes()" >
          <ion-icon slot="start" :icon="lockClosed"></ion-icon>Politique de confidentialité 
        </ion-item>
        <ion-item :button="true" routerLink="/AproposPage">
           <ion-icon slot="start" :icon="atCircle" ></ion-icon>A propos de Nous
        </ion-item>
         <ion-item :button="true" @click="signout()" >
           <ion-icon slot="start" :icon="exit"></ion-icon>Déconnexion
        </ion-item>
            </ion-menu-toggle>
      </ion-list>
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="menu-content" />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet,IonMenu,IonItem,IonLabel,IonList,IonContent,IonIcon, IonMenuToggle,useBackButton,useIonRouter,alertController, loadingController, onIonViewWillEnter, toastController,IonBadge} from '@ionic/vue';
import { defineComponent, onMounted, reactive,  } from 'vue';
import { ellipse,cart,calendar,call,atCircle,heart,paperPlane,lockClosed,information,exit,chatbubble} from 'ionicons/icons';
import { doc, getDoc, getFirestore, onSnapshot, Timestamp } from "firebase/firestore";
import app from '@/firebase';
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import store from './VerifyUserStore';
import router from './router';
import {LocalNotifications} from '@capacitor/local-notifications'
import {Browser} from '@capacitor/browser'
import { SplashScreen } from '@capacitor/splash-screen'
import { Device } from '@capacitor/device';
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonItem,
    IonList,
    IonContent,
    IonIcon,
    IonMenuToggle,
  IonLabel,
  IonBadge

  },
 
  setup(){
    onMounted(()=>{
      setTimeout(async() => {
         await SplashScreen.hide()
         const info = await Device.getInfo()
         const db = getFirestore(app)
         const refdoc= doc(db,"ALLAUTHORISED","UpdateApp")
         const Maj = await getDoc(refdoc)
         if(Maj.exists()){
           let take = Maj.data()
           if(take.isAvailable=="Non Obligatoire"){
             const alert = await alertController.create({
               header:"Veillez faire la mije a jour",
               subHeader:"Pour une meilleure experience utilisateur",
               mode:"ios",
               buttons:[{
                 text:"OK",
                 cssClass:"primary",
                 handler:()=>{
                   if(info.platform=="android"){
                     window.open(take.Link.android)
                   }else if (info.platform=="ios"){
                     window.open(take.Link.ios)
                   }
                 }
               },{
                 text:"prochainement",
                 cssClass:"primary",
                 handler:()=>{
                   return
                 }
               }]
             })
             alert.present()
           }
         }
      },1000);
     
    })

    //go to terme condition
    const GotoTermes = ()=>{
     Browser.open({url:"https://www.chapchap.store/Politique-de-confidentialite",toolbarColor:"#03A61c",})
    }
    const goToCondition = ()=>{
       Browser.open({url:"https://www.chapchap.store/Politique-de-confidentialite/one",toolbarColor:"#03A61c",})
    }
    //ecoute sur le click des notification
   
    //fin ecoute des notification
    App.addListener("appStateChange",async(state)=>{
     if(state.isActive==false){
       const db = getFirestore(app)
       const auth = getAuth(app)
       onAuthStateChanged(auth,(user)=>{
         if(!user)return
           const refuser = doc(db,'USERS',user.uid)
           onSnapshot(refuser,(newData)=>{
             if(newData.exists()){
               let take = newData.data()
               if(!take.Message) return
               take.Message.forEach((element,index) => {
                 element.message.forEach(element1=> {
                   if(element1.type=="Four"){
                     if(element1.vue==false){
                       LocalNotifications.schedule({
                         notifications:[
                           {
                             title:`Vous avez un nouveau message `,
                             body:"cliquez ici pour lire message",
                             id:index,
                             attachments:[{id:"face",url:element.linkPhoto}]
                           }
                         ]
                       })
                     }
                   }
                 });
               });
             }
           })
         
       })
     }
    })
    onIonViewWillEnter(async()=>{
      LocalNotifications.requestPermissions().catch(async()=>{
      const alert = await alertController.create({message:"Chap Chap a besion de cette fonctionalite pour bien fonctioner exemple pour vous informe si un fournisseur vous a repondu",
      buttons:[{
        text:"ok",
        cssClass:"primary",
        handler:()=>{
          LocalNotifications.requestPermissions()
        }
      }]})
      alert.present()
      })
    })
    //deconnexion
    const signout = async ()=>{
      const alert = await alertController.create({
        header:"Voulez-vous vous deconnecter ?",
        buttons:[{
          text:"Oui",
          cssClass:"primary",
          handler:async ()=>{
            const auth = await getAuth(app)
         await signOut(auth).then(async()=>{
            router.replace({path:"/CreateAcountPage"})
            const toat = await toastController.create({
              message:"Deconnecter avec succes",
              duration:2000
            })
            toat.present()
      })
          }
        },{
          text:"Non",
          cssClass:"Primary",
          handler:()=>{
            return
          }
        }]
      })
      alert.present()
      
    }
    //fin deconnexion
   //pour la partie partager

 const GotoMessge = async ()=>{
   const attendre = await loadingController.create({message:"Patientez s'il vous plait "})
   attendre.present()
   try {
      const db = await getFirestore(app)
      const refuser = doc(db,"USERS",userInfo.id)
      const data = await getDoc(refuser)
      if(data.exists()){
        let take = data.data()
        if(take.Message){
          attendre.dismiss()
          router.push({path:"/Messages"})
        }else{
          attendre.dismiss()
          const alert = await alertController.create({header:"Vous avez pas de messge pour le moment",subHeader:"pour le faire click sur un produit que vous voulez dans la page detail click sur icon du message",buttons:[{
            text:"ok",
            cssClass:"primary",
            handler:()=>{
              return
            }
          }]})
          alert.present()
          
        }
      }
   } catch (error) {
     attendre.dismiss()
     const alert = await alertController.create({message:"erreur du serveur"})
     alert.present()
   }
   
    
 }
 let Shareink = reactive({android:"",ios:"",isActive:true})
 async function getink(){
   try {
      const db = await getFirestore(app)
   const refShareLink = await await doc(db,"ALLAUTHORISED","ShareLink")
   const link = await getDoc(refShareLink)
   if(link.exists()){
     let take = link.data()
     Shareink.android=take.Link.android,
     Shareink.ios=take.Link.ios
   }
   } catch (error) {
     Shareink.isActive=false
   }
  
   
 }
 getink()
   //fin partage
    //gestion du deeplink
    App.addListener("appUrlOpen",async (event)=>{
       try {
       const auth = await getAuth(app)
        await onAuthStateChanged(auth,async(user)=>{
          if(user){
            const db = await getFirestore(app)
         const Url = event.url.split('.store').pop()
          let AllUrl =Url.split('/')
          AllUrl=AllUrl.filter(e=>e!="")
            if(AllUrl[0]=="P"){
              //cela veut dire c'est un produit
              const refproduits = await doc(db,"PRODUITS",`${AllUrl[1]}`)
              const Product = await getDoc(refproduits)
              if(Product.exists()){
                let take = Product.data()
                if(take.publier){
                  
                  router.push({name:"ProductDetailPage",params:{id:`${AllUrl[1]}`,prix:'none'}})
                  //produit desactiver par le fournisseur
                }else{
                  const alert = await alertController.create({header:"Produit Desactive"})
                   alert.present()
                   
                    router.replace({path:"/tabs/tab1"})
                }
              }else{
                //au cas le produit n'existe pas
                const alert = await alertController.create({header:"Produit Supprimer ou Mauvais lien"})
                   alert.present()
                   
                   router.replace({path:"/tabs/tab1"})
              }
            } else if (AllUrl[0]=='F'){
               //cela veut dire la page du fournisseur
               const refFournisseur = await doc(db,"FOURNISSEURS",`${AllUrl[1]}`)
               const Four = await getDoc(refFournisseur)
               if(Four.exists()){
                 let take = Four.data()
                 if(take.active){
                   router.replace({name:"OneFourView",params:{id:`${AllUrl[1]}`}})
                 } else {
                   //au cas ou le fournisseur est desactiver ou il na pas premium
                   const alert = await alertController.create({header:"Fournisseur non reconnu"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                 }
               }else{
                 //au cas ou le Fournisseur
                 const alert = await alertController.create({header:"Fournisseur non reconnu"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
               }
            }else if (AllUrl[0]=="PF"){
              //SI cest un lien pour une promotion
              const refFour = await doc(db,"FOURNISSEURS",`${AllUrl[1]}`)
              const four = await getDoc(refFour)
              if(four.exists()){
                let take = four.data()
                //verification si promo
                if(take.promo){
                  let timestamp = Timestamp.now()
                  let DateNow = new Date(timestamp.seconds*1000)
                  let PromoDate = new Date(take.promo.promoDate.seconds*1000)
                  let timeDiff = DateNow.getTime()-PromoDate.getTime()
                  let resultat = timeDiff/(1000 * 3600 * 24)
                  if(resultat<=take.promo.promoNday){
                    router.replace({name:"OneFourView",params:{id:`${AllUrl[1]}`}})
                  } else{
                     const alert = await alertController.create({header:`La promotion de ${take.NomMagasin} a expire`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                  }

                } else {
                   const alert = await alertController.create({header:`Lien promo invalide`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                }
              }else{
                const alert = await alertController.create({header:`Lien promo invalide`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
              }
            } else if (AllUrl[0]=="R") {
               //un lin d'un restaurant
               const refResto= await doc(db,"RESTO",`${AllUrl[1]}`)
               const OneResto = await getDoc(refResto)
               if(OneResto.exists()){
                 let take = OneResto.data()
                 let town=""
                 await store.get("UserTown").then((data)=>town=data)
                 if(take.Ville==town && take.active){
              
                  router.replace({name:"Resto",params:{id:`${AllUrl[1]}`}})
                 }else{
                   //le resto a une erreur 
                    const alert = await alertController.create({header:`Lien est invalide ou le resto n'est pas dans la localite ou vous ete`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                 }
               }else{
                 //le resto n'existe pas
                  const alert = await alertController.create({header:`Lien  invalide`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
               }
            } else if (AllUrl[0]=="PNF"){
                const refFournisseur = await doc(db,"FOURNISSEURS",`${AllUrl[1]}`)
               const Four = await getDoc(refFournisseur)
               if(Four.exists()){
                 let take = Four.data()
                 if(take.active && take.premium){
                   router.replace({name:"FournisseurPartie",params:{value:`${AllUrl[1]}`}})
                 } else {
                   //au cas ou le fournisseur est desactiver ou il na pas premium
                   const alert = await alertController.create({header:"Fournisseur non reconnu"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                 }
               }else{
                 //au cas ou le Fournisseur
                 const alert = await alertController.create({header:"Fournisseur non reconnu"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
               }
            } else if(AllUrl[0]=='E'){
            const refEvent = doc(db,"Evenement",`${AllUrl[1]}`)
            const event = await getDoc(refEvent)
              if(event.exists()){
                let get = event.data()
                 let timestamp = Timestamp.now()
                let DateNow = new Date(timestamp.seconds*1000)
                let EventDate = new Date(get.EventDate.seconds*1000)
                 if(EventDate.getTime()>=DateNow.getTime()){
                  router.replace({name:'FlasH',params:{id:`${AllUrl[1]}`}})
                }else{
                   const alert = await alertController.create({header:"Evenement passer"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
                }
              } else{
                   const alert = await alertController.create({header:"Evenement effacer"})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
              }

            }  else{
               const alert = await alertController.create({header:`Lien invalide`})
                  alert.present()
                   router.replace({path:"/tabs/tab1"})
            }
            
          }else{
            //en cas ou il n'est pas incri
            const alert = await alertController.create({header:"Vous n'ete pas inscrit dans chap chap inscrivez vous et retapez sur le lien"})
           alert.present()
            router.replace({path:'/LoadPage'})
          }
        })
    }catch (error) {
         const alert = await alertController.create({header:`Une Erreur s'est produite`})
            alert.present()
           setTimeout(()=>App.exitApp(),2000)
       }
    })

  //fin gestion deeplink
    //gestion du gps  gps
    
   
    //gestion en cas de mise en jour disponible
   
    //fin gestion mise en jour
   //gestion du button de retour 
   const ionRouter = useIonRouter();
    useBackButton(-1, async() => {
      if (!ionRouter.canGoBack()) {
      const alert = await alertController.create({
        header:"Voulez vous quitter l'application ?",
        mode:"ios",
        buttons:[{
          text:"oui",
          cssClass:"primary",
          handler:()=>{
            App.exitApp()
          }
        },{
          text:"non",
          cssClass:"primary",
          handler:()=>{
            return
          }
        }]
      })
     alert.present()
      }
      
    });
    window.addEventListener("online",async()=>{
      const db = await  getFirestore(app)
    const auth = await getAuth(app)
    await onAuthStateChanged(auth,async(user)=>{
      if(!user)return
      const refuser = await doc(db,"USERS",`${user.uid}`)
      userInfo.id=user.uid
      const User= await getDoc(refuser)
      if(User.exists()){
        let take = User.data()
         userInfo.nom=take.nom
         userInfo.VerifyCode=take.VerifyCode
         userInfo.ville=take.ville
         userInfo.LinkPhoto=take.LinkPhoto
      }
    })
    })
   //fin gestion du button de retour
 let userInfo=reactive({nom:"",VerifyCode:"",ville:"",LinkPhoto:"",id:"",newMessage:false,countMessage:0})
   async function auth(){
  const db = await  getFirestore(app)
    const auth = await getAuth(app)
    await onAuthStateChanged(auth,async(user)=>{
      if(user){
      const refuser = await doc(db,"USERS",`${user.uid}`)
      userInfo.id=user.uid
      const User= await getDoc(refuser)
      if(User.exists()){
        let take = User.data()
         userInfo.nom=take.nom
         userInfo.VerifyCode=take.VerifyCode
         userInfo.ville=take.ville
         userInfo.LinkPhoto=take.LinkPhoto
      }
        let vu = false
       onSnapshot(refuser,(Newdata)=>{
        if(Newdata.exists()){
          let take = Newdata.data()
           userInfo.nom=take.nom
           userInfo.LinkPhoto=take.LinkPhoto
           if(!take.Message)return
           userInfo.newMessage=false
            take.Message.forEach(element => {
               element.message.forEach(async element1 => {
                   if(element1.type=="Four"  ){
                     if(element1.vue==false){
                      userInfo.countMessage++
                       userInfo.newMessage=true
                       const toast = await toastController.create({
                         message:"Vous avez un nouveau message",
                         duration:2000,
                       })
                       toast.present()
                     }
                   }
               });
               vu=true
             });
           }
       
        
      })
      } else{
        return
      }
    })
   }
   auth()
    
     
   return{
      userInfo,
      ellipse,
      cart,
      calendar,
      call,
      exit,
      atCircle,
      heart,
      paperPlane,
      lockClosed,
      information,
      signout,
      Shareink,
      chatbubble,
      GotoMessge,
      GotoTermes,
      goToCondition
    }
  }

  

 
   
 
   
});
</script>
<style lang="scss" >

.menu-header-bg{
  height: 180px;
  width: 350px;
  background-color:#03A61c ;
  background: linear-gradient(90deg,#03A61c 0%,#03A61c 100%);
  box-shadow: 0px 1px 10px rgba(98,140, 255, 0.5);
  transform: rotate(-15deg);
  border-radius: 10px 10px 10px 50px;
  margin-left: -18px;
  margin-top: -50px;
  margin-bottom: 60px;
}
.header-content{
  position: absolute;
top: 30px;
left: 15px;
display: flex;
align-items: center;
img{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 7px solid #5e7ccc;
  margin-right: 14px;
}
h2{
  font-weight: 300;
  color: #fff;
}
p{
  font-size: 12px;
  color: #e4e4e4;
  font-weight: 100;
  letter-spacing: 0.4px;
}
}
.menu-items{
  margin: 0px;

  ion-icon{
    margin-right: 20px;
    color: #86979f;
  }
  ion-item{
    padding-left: 20px;
    margin-bottom: 10px;
  }
  .activ34{
    border-left: 5px solid;
    color: #03A61c;
    padding-left: 15px;

    .IconActve{
      color: #03A61c;
    }
  }
}
</style>