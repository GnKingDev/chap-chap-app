<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
         <ion-buttons slot="start">
        <ion-back-button default-href="/tabs/tab1"></ion-back-button>
      </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <LoaderPage v-if="loader" />
    <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="SuccesPage" @click="ChatPage()">
      <ion-fab-button>
        <ion-icon :icon="chatboxEllipses"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-fab vertical="bottom" horizontal="start" slot="fixed" v-if="SuccesPage" @click="OneFour(OneProduitShow.IdFournisseur)">
      <ion-fab-button>
        <ion-icon :icon="person"></ion-icon>
      </ion-fab-button>
    </ion-fab>


    <swiper v-if="SuccesPage"
    :modules="modules"
    :slides-per-view="1"
    :space-between="50"
    navigation
    :pagination="{ clickable: true }"
    watch-slides-progress
    class="product-slide"
    
   
  >
    <swiper-slide v-for="photo in OneProduitShow.slidePhoto" :key="photo.COuleur" class="slide" >
       <img :src="photo.lien" v-if="photo.Publier" class="img"  ><img> 
    </swiper-slide>
   
    ...
  </swiper>

 <div v-if="SuccesPage">
  <div class="ion-padding-vertical">
    <h1 class="item-name">{{OneProduitShow.nomProd}}</h1>
    <h4 class="price">
      {{OneProduitShow.prix.toLocaleString('en-US')}}GNF
      <p class="Pricebar" v-if="this.$route.params.prix=='yes'">{{Pricebar.toLocaleString('en-US')}}GNF </p>
    </h4>
  </div>

  <div class="separator">
    <hr>
  </div>
  <div class="review">
    <ion-row>
      <ion-col size="6">
        <div class="rating">
          {{OneProduitShow.liked}}
        </div>
        <ion-icon :icon="like==true ? heart:heartOutline" @click="ForLike(OneProduitShow.id)" class="like" ></ion-icon>
      </ion-col>
      <ion-col size="6">
        <div class="cout">
          {{OneProduitShow.views}} <span><ion-icon :icon="eye"></ion-icon> </span>
        </div>
      </ion-col>
    </ion-row>
  </div>

  <div class="separator">
    <hr>
  </div>

  <div class="description">
    <h5>Description</h5>
    <p>
      Ville:{{OneProduitShow.ville}} <br>
      Qualite:{{OneProduitShow.Qualite}} <br>
      {{OneProduitShow.description}}

    </p>
  </div>

 
   <div class="qty-selector" align="center">
     <h6 class="compteuTitle" >Combien de {{OneProduitShow.nomProd}} </h6>
 <ion-chip color="primary" mode="ios">
   <ion-icon :icon="addCircle" @click="add(realPrice)" class="CompteuIcon"></ion-icon>
   <ion-label> {{compteu}} </ion-label>
    <ion-icon :icon="removeCircle" @click="soustra(realPrice)" class="CompteuIcon"></ion-icon>
 </ion-chip>
  </div>
 <div class="separator">
    <hr>
  </div>
  <div class="variation">
    <ion-segment :value="activeVariation" @ionChange="segmentChanged($event)">
      <ion-segment-button value="size">
        <ion-label>Choisir la taille </ion-label>
      </ion-segment-button>
      <ion-segment-button value="color">
        <ion-label>Couleur</ion-label>
      </ion-segment-button>
    </ion-segment>

  </div>
     <div class="separator">
    <hr>
  </div>
   <div class="separator">
    <hr>
  </div>
  <div class="variation-selector">
    <div class="sizes" :class="{activeVariation:activeVariation=='size'}">
    <div v-for="(t,index) in OneProduitShow.taille" :key="index" @click="ChoixTaille(index,t)" :class="{active:ActiveTaile==index}">
        {{t}}
      </div>
    </div>
    <div class="colors" :class="{activeVariation:activeVariation=='color'}">
      <div v-for="(couleur,index) in OneProduitShow.slidePhoto" :key="index" @click="ChoixCouleur(index,couleur.COuLeur)" :class="{active:activeColor==index}">
        {{couleur.COuLeur}}
      </div>
    </div>
  </div>
  
  
 
     

          <div   v-if="error" align="center">
         <ion-img :src="require('../images/erreurImage.png')"  ></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>
    </div>

    </ion-content>
    <ion-footer v-if="SuccesPage">
      <ion-row>
        <ion-col size="6">
          <ion-button v-on:click="AjoutPanier()" expand="full" color="light">
            <ion-icon :icon="addOutline"></ion-icon>
            Panier
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button v-on:click="OpenPayement()" expand="full">
            Achete
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-footer>
    
  </ion-page>
</template>

<script >
import { defineComponent } from 'vue';
import 'swiper/css';
 import '@ionic/vue/css/ionic-swiper.css';
 import { Swiper, SwiperSlide } from 'swiper/vue';
 import { Navigation, Pagination, Scrollbar, A11y ,Autoplay,} from 'swiper';
 import 'swiper/css/autoplay';
  import 'swiper/css/keyboard';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
  import 'swiper/css/zoom';
import { IonPage, IonHeader, IonToolbar, IonImg,loadingController,IonIcon,IonButton,toastController,IonLabel,IonBackButton,IonButtons,alertController,IonicSlides,popoverController,IonRow,IonCol,IonSegment,IonSegmentButton,IonFooter,IonFab,IonFabButton,IonContent, modalController,IonChip} from '@ionic/vue';
import { doc, getDoc,getFirestore,updateDoc, arrayUnion, arrayRemove ,increment,Timestamp,} from "firebase/firestore";
import app from '@/firebase';
import{addCircle,addOutline,heartOutline,heart,chatboxEllipses,eye,person,removeCircle}from 'ionicons/icons'
import LoaderPage from '@/components/LoaderPage.vue'
import InitAchat from '@/components/InitAchat.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
export default defineComponent({
  name: 'Tab3Page',
  components: {   IonContent, IonPage  ,IonImg,IonBackButton,IonToolbar,IonButtons,LoaderPage,IonHeader,
   Swiper,SwiperSlide,IonButton,IonIcon,IonRow,IonCol,IonSegment,IonSegmentButton,IonFooter,IonLabel,IonFab,IonFabButton,IonChip},
  data(){
          return{
            //icon
             person,
               eye,
                loadingController,
                heartOutline,
                heart,
                chatboxEllipses,
                popoverController,
                toastController,
                addOutline,
                addCircle,
                alertController,
                removeCircle,
               modules: [Navigation, Pagination, Scrollbar, A11y,Autoplay,IonicSlides],
                  
                
                //data
                OneProduitShow:new Object,
                GetUserData:new Object,
                panier:[],
                compteu:1,
                Description:"",
                UserInfo:{},
                //v if
                SuccesPage:false,
                error:false,
                pasdeTaille:true,
                pasDeCouleur:true,
                description:false,
                loader:true,
                btnPromo:false,
                //classe css
                activeColor:0,
                ActiveTaile:new Number,
                takeTaille:"",
                activeVariation:"size",
                
                //PrendreIdCouleurChoisi
                IdcouleurChoisie:"defaut",
                //gestion pour like
                like:false,
                //les Variable pour le payement 
                couleurLienName:{lien:"",name:""},
                SommeTotale:0,
                CodePromo:"",
                Promo:false,
                MemeFour:[],//pour meme fournisseur
                UserNumberPhone:"",
                RealPrice:0,
                Pricebar:0,
                AllPrice :{},
                //les Variables pour instant boot
                fourInfo:{},
                EndPoint:"",
                  
                
                
          }
  },
async ionViewWillEnter(){
  const attendre = await loadingController.create({message:"veillez activer votre internet"})
  if(window.navigator.onLine==false){
    attendre.present()
  }
  window.addEventListener("online",()=>{
    attendre.dismiss()
  })
  window.addEventListener("offline",()=>{
    attendre.present()
  })
},

  async beforeCreate(){
    this.SuccesPage=false
    this.error=false
    try {
      this.loader=true
      let user
       const db= await getFirestore(app)
       const auth = await getAuth(app)
       ///gestion du prix a ajouter
       const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()){
    Price=AlgoPrice.data()
    this.AllPrice=AlgoPrice.data()
   } 
   //fin prix a ajouter
   //debut prendre le endpoint
    const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
   //fin prendre le endpoin

      await onAuthStateChanged(auth,(User)=>user=User.uid)
        //DEBUT verification si l'utilisateur a deja like le produit
         const refUser= await doc(db,"USERS",`${user}`)
         const Datauser= await getDoc(refUser)
         let data={}
         if(Datauser.exists()){
            data = Datauser.data()
            this.UserInfo=Datauser.data()
           this.UserNumberPhone=data.UserNumberPhone
           if(data.MesLike){
             if(data.MesLike.includes(`${this.$route.params.id}`)==true){
               this.like=true
             } 
           }
           
         }
         //fin verification si l'utilisateur a deja like le produit
       const refProduit=await doc(db,"PRODUITS",`${this.$route.params.id}`)
       const Data = await getDoc(refProduit)
        if(Data.exists()){
          this.OneProduitShow=Data.data()
          this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
          this.Pricebar=this.OneProduitShow.prix
          this.RealPrice=this.OneProduitShow.prix
            if(this.OneProduitShow.views){
              this.OneProduitShow.views=this.OneProduitShow.views +1
              await updateDoc(refProduit,{
                views:increment(1)
              })
            }else{
              this.OneProduitShow.views=1
            }
        //fin instant chop
          //verifaction si promo code est active 
          const refFour = await doc(db,"FOURNISSEURS",`${this.OneProduitShow.IdFournisseur}`)
          const four = await getDoc(refFour)
          if(four.exists()){
             this.fourInfo=four.data()
          }
          //fin verification
          //verification si le produit a des tailles
         if(this.OneProduitShow.taille){
                 let i =  this.OneProduitShow.slidePhoto.findIndex(e=>e.COuLeur==this.OneProduitShow.couleur)
                let takeFirstPosition = this.OneProduitShow.slidePhoto[0]
                this.takeTaille=this.OneProduitShow.taille[0]
                 this.OneProduitShow.slidePhoto[0]=this.OneProduitShow.slidePhoto[i]
               this.OneProduitShow.slidePhoto[i]=takeFirstPosition
               this.OneProduitShow.slidePhoto = this.OneProduitShow.slidePhoto.filter(e=>e.Publier==true)
              } else{
                if(this.OneProduitShow.description){
                  let take = this.OneProduitShow.slidePhoto.filter(e=>e.COuLeur=='Meme couleur')
                  if(!take[0]){
                       let i =  this.OneProduitShow.slidePhoto.findIndex(e=>e.COuLeur==this.OneProduitShow.couleur)
                      let takeFirstPosition = this.OneProduitShow.slidePhoto[0]
                      this.OneProduitShow.slidePhoto[0]=this.OneProduitShow.slidePhoto[i]
                     this.OneProduitShow.slidePhoto[i]=takeFirstPosition
                  } 
                }
              }
               
               //si autre mes avec couleurs
               
          //gestion du prix a ajouter
            
                //ajout des prix sur les produit
                this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
       let r = this.OneProduitShow.prix*2/100
       if(r<1000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.b
       } else if (r>=10000){
        this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.c
       }
              this.SommeTotale=this.OneProduitShow.prix
          //gestion du prix a ajouter
         this.Pricebar=this.OneProduitShow.prix
          this.couleurLienName.lien=this.OneProduitShow.slidePhoto[0].lien
          this.couleurLienName.name=this.OneProduitShow.slidePhoto[0].COuLeur
          this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
          if(!this.OneProduitShow.taille) this.pasdeTaille=false
          if(this.OneProduitShow.description){
            this.description=true
            this.Description=this.OneProduitShow.description
          } 

          if(this.$route.params.prix=='yes'){
            let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id )
            let take =this.UserInfo.Message[i]
            let date = new Date(Timestamp.now().seconds*1000)
            let prixdate = new Date(take.newPrice.duree.seconds*1000)
            let timeDiff = date.getTime()-prixdate.getTime()
            let result = timeDiff/(1000 * 3600 * 24)
            if(result<=1){
              this.OneProduitShow.prix=take.newPrice.price
              this.RealPrice=take.newPrice.price
                this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
       let r = this.OneProduitShow.prix*2/100
       if(r<1000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.b
       } else if (r>=10000){
        this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.c
       }
              this.SommeTotale=this.OneProduitShow.prix
            }
          }
          

          this.SuccesPage=true
          this.error=false
          this.loader=false
          this.CanStart=true
        }
    } catch (e) {
      this.SuccesPage=false
      this.error=true
      this.loader=false
      console.log(e)
    }
      
    
  },
  methods:{
    //la gestion du compteur 
    add(realprice){
      this.compteu++
      this.SommeTotale=this.SommeTotale+this.OneProduitShow.prix
      this.RealPrice=this.RealPrice+realprice
    },
    soustra(realprice){
      if(this.compteu>1){
        this.compteu--
        this.SommeTotale=this.SommeTotale-this.OneProduitShow.prix
        this.RealPrice=this.RealPrice-realprice
      }
    },
    //fin gestion compteur
    //checksize
   segmentChanged(event){
     this.activeVariation=event.detail.value
   },
    
    //go to one four views
   OneFour(id){
     if(window.navigator.onLine==false){
       return
     }
   this.$router.push({name:"OneFourView",params:{id:id}})
   },
    
  
   async OpenPayement(){
     if(window.navigator.onLine==false){
       const alert = await alertController.create({message:"Veillez activer votre internet"})
       alert.present()
       return
     }
     if(this.compteu==1){
       this.SommeTotale=this.OneProduitShow.prix
     }
     
      const pop = await modalController.create({
        component:InitAchat,
        backdropDismiss:false,
        cssClass:"PaymentModa1",
       componentProps:{nom:this.OneProduitShow.nomProd,ville:this.OneProduitShow.ville,taille:this.takeTaille,couleur:this.couleurLienName,nombreProduit:this.compteu,sommeTotat:this.SommeTotale,RealPrice:this.RealPrice,EndPoint:this.EndPoint,UserInfo:this.UserInfo,Product:this.OneProduitShow,fourInfo:this.fourInfo}
       
      })
      pop.present()
    },
    //fin les methodes pour le payement
    //ouverture pour pop  message
  
    //fin pop pour le message
  async  TryAgain(){
    this.SuccesPage=false
    this.error=false
    try {
      this.loader=true
      let user
       const db= await getFirestore(app)
       const auth = await getAuth(app)
       ///gestion du prix a ajouter
       const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()){
    Price=AlgoPrice.data()
    this.AllPrice=AlgoPrice.data()
   } 
   //fin prix a ajouter
   //debut prendre le endpoint
    const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
   //fin prendre le endpoin

      await onAuthStateChanged(auth,(User)=>user=User.uid)
        //DEBUT verification si l'utilisateur a deja like le produit
         const refUser= await doc(db,"USERS",`${user}`)
         const Datauser= await getDoc(refUser)
         let data={}
         if(Datauser.exists()){
            data = Datauser.data()
            this.UserInfo=Datauser.data()
           this.UserNumberPhone=data.UserNumberPhone
           if(data.MesLike){
             if(data.MesLike.includes(`${this.$route.params.id}`)==true){
               this.like=true
             } 
           }
           
         }
         //fin verification si l'utilisateur a deja like le produit
       const refProduit=await doc(db,"PRODUITS",`${this.$route.params.id}`)
       const Data = await getDoc(refProduit)
        if(Data.exists()){
          this.OneProduitShow=Data.data()
          this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
          this.Pricebar=this.OneProduitShow.prix
          this.RealPrice=this.OneProduitShow.prix
            if(this.OneProduitShow.views){
              this.OneProduitShow.views=this.OneProduitShow.views +1
              await updateDoc(refProduit,{
                views:increment(1)
              })
            }else{
              this.OneProduitShow.views=1
            }
        //fin instant chop
          //verifaction si promo code est active 
          const refFour = await doc(db,"FOURNISSEURS",`${this.OneProduitShow.IdFournisseur}`)
          const four = await getDoc(refFour)
          if(four.exists()){
             this.fourInfo=four.data()
          }
          //fin verification
          //verification si le produit a des tailles
         if(this.OneProduitShow.taille){
                 let i =  this.OneProduitShow.slidePhoto.findIndex(e=>e.COuLeur==this.OneProduitShow.couleur)
                let takeFirstPosition = this.OneProduitShow.slidePhoto[0]
                this.takeTaille=this.OneProduitShow.taille[0]
                 this.OneProduitShow.slidePhoto[0]=this.OneProduitShow.slidePhoto[i]
               this.OneProduitShow.slidePhoto[i]=takeFirstPosition
               this.OneProduitShow.slidePhoto = this.OneProduitShow.slidePhoto.filter(e=>e.Publier==true)
              } else{
                if(this.OneProduitShow.description){
                  let take = this.OneProduitShow.slidePhoto.filter(e=>e.COuLeur=='Meme couleur')
                  if(!take[0]){
                    let i =  this.OneProduitShow.slidePhoto.findIndex(e=>e.COuLeur==this.OneProduitShow.couleur)
                    let takeFirstPosition = this.OneProduitShow.slidePhoto[0]
                    this.OneProduitShow.slidePhoto[0]=this.OneProduitShow.slidePhoto[i]
                     this.OneProduitShow.slidePhoto[i]=takeFirstPosition
                  } 
                }
              }
               
               //si autre mes avec couleurs
               
          //gestion du prix a ajouter
             this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
       let r = this.OneProduitShow.prix*2/100
       if(r<1000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.b
       } else if (r>=10000){
        this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.c
       }
          //gestion du prix a ajouter
          this.SommeTotale=this.OneProduitShow.prix
         this.Pricebar=this.OneProduitShow.prix
          this.couleurLienName.lien=this.OneProduitShow.slidePhoto[0].lien
          this.couleurLienName.name=this.OneProduitShow.slidePhoto[0].COuLeur
          this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
          if(!this.OneProduitShow.taille) this.pasdeTaille=false
          if(this.OneProduitShow.description){
            this.description=true
            this.Description=this.OneProduitShow.description
          } 

          if(this.$route.params.prix=='yes'){
            let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id )
            let take =this.UserInfo.Message[i]
            let date = new Date(Timestamp.now().seconds*1000)
            let prixdate = new Date(take.newPrice.duree.seconds*1000)
            let timeDiff = date.getTime()-prixdate.getTime()
            let result = timeDiff/(1000 * 3600 * 24)
            if(result<=1){
              this.OneProduitShow.prix=take.newPrice.price
            this.OneProduitShow.prix=parseInt(this.OneProduitShow.prix)
       let r = this.OneProduitShow.prix*2/100
       if(r<1000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.b
       } else if (r>=10000){
        this.OneProduitShow.prix=this.OneProduitShow.prix+r+Price.c
       }
              this.SommeTotale=this.OneProduitShow.prix
            }
          }
          

          this.SuccesPage=true
          this.error=false
          this.loader=false
          this.CanStart=true
        }
    } catch (e) {
      this.SuccesPage=false
      this.error=true
      this.loader=false
      this.$router.back()
    }
      
   
    },
    //gestion Pour le like
    async ForLike(id){
      if(window.navigator.onLine==false){
       const alert = await alertController.create({message:"Veillez activer votre internet"})
       alert.present()
       return
     }
  let user
      try {
        const db = await getFirestore(app)
        const auth = await getAuth(app)
        await onAuthStateChanged(auth,(User)=>user=User.uid)
        const refUser = await doc(db,"USERS",`${user}`)
        const refproduit = await doc(db,"PRODUITS",`${id}`)
        if(this.like==false){
        
        //gestion en cas de like
      await updateDoc(refUser,{
         MesLike:arrayUnion(id)
       })
       await updateDoc(refproduit,{
          liked:increment(1)
       })
       
        this.like=true
        this.OneProduitShow.liked=this.OneProduitShow.liked+1
        //cas succes
        const toast = await toastController.create({
          message:"ajouter a vos favoris",
          duration:1000
        })
        toast.present()
        //fin gestion en cas de like
      } else{
       //debut en cas de dislike
      await updateDoc(refUser,{
          MesLike:arrayRemove(id)
        })
        await updateDoc(refproduit,{
          liked:increment(-1)
        })
         this.like=false
         this.OneProduitShow.liked=this.OneProduitShow.liked-1
         const toast = await toastController.create({message:"supprimer de vos favoris",duration:1000})
         toast.present()
         //fin gestion dislike
      }
      } catch  (e) {
         const toast = await toastController.create({message:"supprimer de vos favoris",duration:1000})
         toast.present()
      }
    },
    //fin gestion pour le like
    //choix des couleurs
    ChoixCouleur(index,name){
       this.activeColor=index
       this.couleurLienName.name=name
    },
    //choix de taille
       ChoixTaille(index,taille){
          this.ActiveTaile=index
          this.takeTaille=taille
          
       },
      async ChatPage(){
         if(window.navigator.onLine==false){
           const alert = await alertController.create({message:"Veillez activer votre internet"})
           alert.present()
           return
         }
          const attendre = await loadingController.create({message:"patientez s'il vous plait "})
          attendre.present()
         try {
          const db = await getFirestore(app)
           const refuser = await doc(db,"USERS",this.UserInfo.id)
           const refFour = await doc(db,"FOURNISSEURS",this.fourInfo.id)
         if(!this.UserInfo.Message){
           await updateDoc(refuser,{
             Message:[{
               linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
               UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
             }]
           }).then(async()=>{
             if(!this.fourInfo.Message){
               await updateDoc(refFour,{
                  Message:[{
               linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
             }]
               }).then(async()=>{
                let user= await getDoc(refuser)
               if(user.exists()){
                this.UserInfo=user.data()
                let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 let four = await getDoc(refFour)
                 if(four.exists()) this.fourInfo=four.data()
                 let i1 = this.fourInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 attendre.dismiss()
                this.$router.push({name:"ConverSation",params:{index:i,id:this.UserInfo.id,index2:i1}})
               } 
               })
               

             }else{
             await updateDoc(refFour,{
                  Message:arrayUnion({
                  linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
                  })         
             }).then(async()=>{
                 let user= await getDoc(refuser)
               if(user.exists()){
                this.UserInfo=user.data()
                let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 let four = await getDoc(refFour)
                 if(four.exists()) this.fourInfo=four.data()
                 let i1 = this.fourInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 attendre.dismiss()
                this.$router.push({name:"ConverSation",params:{index:i,id:this.UserInfo.id,index2:i1}})
               } 
             })
             }
             
           })
         
         }else{
           if(this.fourInfo.Message){
             console.log(this.UserInfo.Message)
             //le fournisseur a mais il na jamis echanger sur ce produit
           let i= this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
           let i1 = this.fourInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
             if(i!=-1){
              this.$router.push({name:"ConverSation",params:{index:i,id:this.UserInfo.id,index2:i1}})

             }else{
              await updateDoc(refuser,{
                Message:arrayUnion({
                    linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
                })
              }).then(async()=>{
                await updateDoc(refFour,{
                  Message:arrayUnion({
                     linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
                  })
                }).then(async()=>{
                   let user= await getDoc(refuser)
               if(user.exists()){
                this.UserInfo=user.data()
                let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 let four = await getDoc(refFour)
                 if(four.exists()) this.fourInfo=four.data()
                 let i1 = this.fourInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 attendre.dismiss()
                this.$router.push({name:"ConverSation",params:{index:i,id:this.UserInfo.id,index2:i1}})
               } 
                })
              })
             }
           }else{
             await updateDoc(refFour,{
               Message:[{
               linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
             }]
             }).then(async()=>{
                 await updateDoc(refFour,{
                  Message:arrayUnion({
                     linkPhoto:this.OneProduitShow.LinkPhoto,
               nomProd:this.OneProduitShow.nomProd,
               idProduit:this.OneProduitShow.id,
               idUser:this.UserInfo.id,
               idFour:this.OneProduitShow.IdFournisseur,
               realPrice:this.RealPrice,
               prix:this.OneProduitShow.prix,
               newPrice:{isActive:false,duree:Timestamp.now(),price:0},
               message:[],
                UserPhoto:this.UserInfo.LinkPhoto,
               FourPhoto:this.fourInfo.Photo.link,
                  })
                }).then(async()=>{
                    let user= await getDoc(refuser)
               if(user.exists()){
                 this.UserInfo=user.data()
                let i = this.UserInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 let four = await getDoc(refFour)
                 if(four.exists()) this.fourInfo=four.data()
                 let i1 = this.fourInfo.Message.findIndex(e=>e.idProduit==this.OneProduitShow.id && e.idUser==this.UserInfo.id)
                 attendre.dismiss()
                this.$router.push({name:"ConverSation",params:{index:i,id:this.UserInfo.id,index2:i1}})
                  
               } 
                })
             })
           }
         }
         attendre.dismiss()
         } catch (error) {
           console.log(error.message)
           attendre.dismiss()
         }
       },
         //ajouter le Produit au panier
       async  AjoutPanier(){
         if(window.navigator.onLine==false){
       const alert = await alertController.create({message:"Veillez activer votre internet"})
       alert.present()
       return
     }
           const db= await getFirestore(app)
           const auth = await getAuth(app)
           let user
            await onAuthStateChanged(auth,(User)=>user=User.uid)
             const  refUser=await doc(db,"USERS",`${user}`)
             //controle des produit qui non pas de couleur
            
             //controle si users ne choisi pas choisi une couleur
              if(this.IdcouleurChoisie=="defaut"){
              await updateDoc(refUser,{
               Panier:arrayUnion({id:`${this.$route.params.id}`,taille:`${this.takeTaille}`})
             }).then(async ()=>{
               const toast=await toastController.create({
                 message:"Element ajouter au panier Click sur l'icon du panier",
                 duration:2000
               })
               toast.present()
               this.panier.push(`${this.IdcouleurChoisie}`)
             }).catch(async ()=>{
                const toast=await toastController.create({
                 message:"Element non ajouter au panier",
                 duration:2000
               })
               toast.present()
             })
                  return

              }
              

         },
         //la gestion de compteur
         
        
         
  }
  
});
</script>
<style scoped lang="scss">
.Pricebar{
  text-decoration: line-through;
}
.footer-md::before{
  background-image: none !important;
}
ion-footer{
  ion-row{
    padding: 0;
    ion-col{
      padding: 0;
      ion-button{
        margin: 0;
        height: 50px;
        font-size: 18px;
        box-shadow: none;
      }
    }
  }
}
.variation-selector{
  margin-top: 30px;
  display: flex;
  position: relative;
  .activeVariation{
    opacity: 1 !important;
    z-index: 1 !important;
  }
  .sizes{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    opacity: 0;
    z-index: 0;
    padding-bottom: 30px;
    div{
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f3f3f3;
      width: 50px;
      height: 50px;
      margin-right: 8px;
      transition: 0.5s ease-in-out;
    }
    .active{
      color: #ffffff;
      background-color: var(--ion-color-primary);
    }
  }
  .colors{
     display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    opacity: 0;
    z-index: 0;
    padding-bottom: 30px;
    div{
       display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f3f3f3;
      width: 70px;
      height: 50px;
      margin-right: 8px;
      transition: 0.5s ease-in-out;
    }
    .active{
      color: #ffffff;
      background-color: var(--ion-color-primary);
    }
  }
}
.variation{
  padding-top: 16px;
  ion-segment-button{
    color: #2a2a2a;
  }
}
.description{
  h5{
    color: #2a2a2a;
    padding-top: 10px;
  }
  p{
    color: #656565;
  }
}
.review{
  margin-top: 16px;
  color: #2a2a2a;
  .rating{
    display: inline-block;
    color: #ffffff;
    background: var(--ion-color-primary);
    padding: 10px 20px 10px 20px;
    border-radius: 5px;
    margin-right: 10px;
  }
  ion-icon{
    font-size: 30px;
  }
  .like{
    color: #fd6c9e;
  }
  .count{
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: var(--ion-color-primary);
  }
}
.erreur{
  text-align: center;
}
ion-content{
  --padding-top: 16px;
  --padding-bottom: 16px;
  --padding-start:26px ;
  --padding-end:26px ;
}
.item-name{
  color: #2a2a2a;
}
.price{
  color: var(--ion-color-primary);
}
.separator{
  hr{
    position: absolute;
    left: 0;
    width: 100%;
    background: #e2e2e2;
  }
}
 .CompteuIcon{
   font-size: 40px;
 }
.compteuTitle{
  margin: 8px;
}
 img {
   width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>