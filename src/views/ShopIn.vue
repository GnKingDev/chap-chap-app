<template>
  <ion-page>
    <ion-header slot="fixed" class="ion-no-border"  >
     <ion-toolbar mode="ios">
          <ion-menu-button menu="Menu" slot="start" class="t" color="primary"></ion-menu-button>
          <LgoName :town="test ? 'Chap Chap' : UserTown"/>
         <ion-icon slot="primary" :icon="cart" color="primary" class="iconPanier"></ion-icon>
      </ion-toolbar >
           <ion-toolbar>
          <ion-searchbar :animated="true" mode="ios" v-model="recherche" placeholder="recherche" :disabled="click1"></ion-searchbar>
            </ion-toolbar >
    <!--gestion segment buttons-->
           <div class="tabs">
         <ion-segment :value="TakeSegmentValue" @ionChange="segmentChanged($event)" :scrollable="true" v-if="ifSerach" class="ion-padding" :disabled="click1">
            <ion-segment-button value="Homme">
         Homme
      </ion-segment-button>
      <ion-segment-button value="Femme">
        Femme
      </ion-segment-button>
       <ion-segment-button value="accessoires">
        Accessoires
      </ion-segment-button>
    </ion-segment>
       </div>
   <!--les ion chip en cas de recherche-->
 <div class="les-chipFiltre" v-if="ifsearch1" >
         <h6 class="index ion-marging">effacez ce que vous avez ecris pour sortir de la recherche</h6>
      <ion-chip :class="{ichipFiltre:Activefiltre==1}" @click="ChipFiltre(1)">
          <ion-label>Dans ma Ville</ion-label>
        </ion-chip>
        <ion-chip :class="{ichipFiltre:Activefiltre==2}" @click="ChipFiltre(2)">
          <ion-label>Tout</ion-label>
        </ion-chip>
         <ion-chip :class="{ichipFiltre:Activefiltre==3}" @click="ChipFiltre(3)">
          <ion-label>prix reduit</ion-label>
        </ion-chip>
     </div>
</ion-header>
<ion-content>

  
  
    
  
      


      
    
      

       <div v-if="ifSerach">
   <!--debut gestion melleur vente-->
      <ion-toolbar v-if="SuccesPage" mode="md"  >
        <ion-label slot="start" class="ion-padding">Meilleur Vente</ion-label>
        <ion-button slot="end" @click="GotoALLCategory('Meilleur Vente') " fill="clear" >
          Voir tout
        </ion-button>
      </ion-toolbar>

             <div>
            <swiper v-if="SuccesPage"
    :modules="modules"
    :slides-per-view="1"
    :space-between="50"
    navigation
    :pagination="{ clickable: true }"
    watch-slides-progress
    :autoplay="true"  class="swpi"> 
                <swiper-slide class="slide"  v-for="data in MeilleurVente" :key="data.nom" data-swiper-autoplay="2000"    >
               <ion-card @click="GetIdProduits(data.id)" :button="true" mode="ios" class="card" >
                  <img :src="data.LinkPhoto" class="img" />
                <ion-chip color="primary"  >
                  <ion-label>{{data.nomProd}} </ion-label>
                </ion-chip>

                <ion-chip color="primary" mode="ios" >
                  <ion-label>{{data.prix.toLocaleString('en-US') }} GNF </ion-label>
                </ion-chip>
  
               </ion-card>
               </swiper-slide>
             
             </swiper>
             </div>
            <!--fin gestion melleur vente-->
            <!-- gestion melleur vente dnas votre ville-->
             <ion-toolbar v-if="SuccesPage  && hideMeilleurVenteTown" mode="md">
              <ion-label slot="start" class="ion-padding">Meilleur vente de {{UserTown}}</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Meilleur Vente de votre ville')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage && hideMeilleurVenteTown"  >
              <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in MeilleurVenteVille" :key="data.id" :button="true" mode="ios" >
                <img :src="data.LinkPhoto"/>
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>
            <!--fin gestion melleur vente dnas votre ville-->
             <!--debut gestion Nouvel arrivage-->
             <ion-toolbar v-if="SuccesPage" mode="md" >
               <ion-label slot="start" class="ion-padding">Nouvel Arrivage</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Nouvel Arrivage')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in NouvelArivage" :key="data.id" :button="true"  mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>

             <ion-toolbar v-if="SuccesPage && hideNouvelleArrivageTown" mode="md"  >
              <ion-label slot="start" class="ion-padding">Nouvel Arrivage de {{UserTown}}</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Nouvel Arrivage de votre ville')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage && hideNouvelleArrivageTown"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in NouvelArivageVille" :key="data.id" :button="true" mode="ios" >
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>
            <!--fin gestion Nouvel arrivage-->
              <!--debut prix reduit-->
               <ion-toolbar v-if="SuccesPage" mode="md" >
               <ion-label slot="start" class="ion-padding">prix Reduits</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Prix Reduit')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage "  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in PrixReduit" :key="data.id" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>

              <ion-toolbar v-if="SuccesPage && hidePrixreduitTown" mode="md" >
              <ion-label slot="start" class="ion-padding">Prix Reduit de {{UserTown}}</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Prix Reduit de votre Ville')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage && hidePrixreduitTown"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in PrixreduitVille" :key="data.id" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>

                <!--fin prix reduit-->

              <!--debut Tout Les Produit de votre Ville-->
              
              <ion-toolbar v-if="SuccesPage && hideAllTown" mode="md" >
              <ion-label slot="start" class="ion-padding">Tout les produits de {{UserTown}}</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Tous les produits')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage && hideAllTown"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in AllTown" :key="data.id" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>
             <!--fin Tout Les Produit de votre ville-->

                <!--plus de like ce que les gens aiment-->
                  <ion-toolbar v-if="SuccesPage" mode="md">
               <ion-label slot="start" class="ion-padding">Plus de Like</ion-label>
               <ion-button slot="end" @click="GotoALLCategory('Plus de Like')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetIdProduits(data.id)"  v-for="data in MoreLiked" :key="data.id" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />

                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>

                <!--fin plus ce que les gens aiment -->
           
     
      <!--debut top boutique ville-->
      <ion-toolbar v-if="SuccesPage && hideTopBoutique" mode="md" >
               <ion-label slot="start" class="ion-padding">Top Boutique de {{UserTown}}</ion-label>
               <ion-button slot="end" @click="GotoALLFour('allv')" fill="clear">
                  Voir tout
               </ion-button>
             </ion-toolbar>
  
          <div class="iteme" v-if="SuccesPage && hideTopBoutique"  >
               <div v-if="SegmantButton">
               <ion-card @click="GetFourId(data.id)"  v-for="data in TopMagasinVille" :key="data.id" :button="true" mode="ios">
                <img :src="data.Photo.link"  />
                 <ion-card-content>
                <h6 >{{data.NomMagasin}} </h6>
                <h6 color="primary" > {{data.Ville}} </h6>
                 </ion-card-content>
               </ion-card>
              </div>
             </div>

          
      <!--fin top boutique ville-->
     <!--debut tout boutique -->
       <ion-toolbar v-if="SuccesPage" mode="md" >
              <ion-label slot="start" class="ion-padding">Top Boutique</ion-label>
               <ion-button slot="end" @click="GotoALLFour('all')" fill="clear"  >
                  Voir tout
               </ion-button>
             </ion-toolbar>

           <div class="iteme" v-if="SuccesPage"  >
               <div v-if="SegmantButton">
                 
                   
               <ion-card @click="GetFourId(data.id)"  v-for="data in TopMagasin" :key="data.id" :button="true" mode="ios">
                <img :src="data.Photo.link" />
                 <ion-card-content>
                <h6 >{{data.NomMagasin}} </h6>
                <h6 color="primary" > {{data.Ville}} </h6>
                 </ion-card-content>
               </ion-card>
                   
                 
              </div>
             </div>


     <!--fin tout boutique -->
     </div>
     <!--fin gestion de tout le catalogue-->
     <!--debut gestion en cas de recherche-->
    <div v-if="ifsearch1" class="c" >
           <div v-for="data in takingSearchData" :key="data.id" class="g">
               <ion-card @click="GetIdProduits(data.id)" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF</h6>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>
     <!--fin gestion en cas de recherche-->


       <div align="center"  v-if="error">
         <ion-img :src="require('../images/erreurImage.png')"  ></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>
    
     <LoaderPage v-if="loader" />
    
    </ion-content>
  </ion-page>
</template>

<script>

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
import { IonPage, IonHeader, IonToolbar, IonContent,IonButton,IonMenuButton, alertController, IonImg, loadingController, IonIcon,IonSearchbar,IonSegment,IonSegmentButton,IonCard,IonCardContent,IonicSlides, IonChip,IonLabel,} from '@ionic/vue';
import{cart,chevronForward,heartOutline,heart,filterSharp}from 'ionicons/icons'
import LgoName from '@/components/LgoName.vue'
import { collection,getDocs,getFirestore,query,doc,getDoc, Timestamp, where, updateDoc,} from "firebase/firestore"
import app from '@/firebase';
import LoaderPage from '@/components/LoaderPage.vue'
import store from '@/VerifyUserStore';
export default  defineComponent({
  name: "ShopIn",
  components: { 
    Swiper,
    SwiperSlide,
    IonContent, 
    IonPage ,
    IonMenuButton,
    IonIcon,
    LgoName,
    IonSearchbar,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonHeader,
    IonButton,
   IonImg,
   IonCard,
   IonCardContent,
   IonChip,
   LoaderPage,
   IonLabel
    },
  data(){
    return{
      //icon
      filterSharp,
        cart,
        chevronForward,
        loadingController,
        alertController,
        heartOutline,
        heart,
        modules: [Navigation, Pagination, Scrollbar, A11y,Autoplay,IonicSlides],
        // v-if
        SuccesPage:false,
        error:false,
        SegmantButton:true,
        Accesoires:true,
        loader:true,
        refresh:true,
        Activefiltre:2,//pour le filtrage
         hideTopBoutique:true,
         hideNouvelleArrivageTown:true,
         hidePrixreduitTown:true,
         hideMeilleurVenteTown:true,
         AllImgLodad:[],
         click1:true,
         hideAllTown:true,

         //data
        ProduitsShow:[] ,
        MeilleurVente:[],
        NouvelArivage:[],
        AllDataInCollection:[],
        PrixReduit:[],
        MoreLiked:[],
        takingSearchData:[],
        TopMagasin:[],
        TopMagasinVille:[],
        MeilleurVenteVille:[],
        PrixreduitVille:[],
        NouvelArivageVille:[],
        AllTown:[],
        //homme data represente les data homme et femme qui doit etre affiche
        HommeData:[],
        //taking Variable
        TakeSegmentValue:"Homme",
        //pour la recherche
        recherche:"",
        DMV:0,//pour le filtrage,
        Tout:0,//pour le filtrage
        Prixreduit:0,//pour le filtarge
        //swipe
        slideAuto:{
             autoplay: {
                           delay: 2000,
                            disableOnInteraction:false,
                            pauseOnMouseEnter:false
                            }     
        },
        //fin gestion slide
        //router
         PrendreNvente:50,
         //Users ville
         UserTown:"",
         test:false

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
    })
},
 
async beforeCreate(){
  this.click1=true
  this.ProduitsShow=[]
     this.NouvelArivage=[]
     this.MeilleurVente=[]
     this.HommeData=[]
     this.PrixReduit=[]
     this.MoreLiked=[]
     this.TopMagasin=[]
     this.TopMagasinVille=[]
     this.MeilleurVenteVille=[]
     this.NouvelArivageVille=[]
     this.PrixreduitVille=[]
     this.AllTown=[]
     this.hideNouvelleArrivageTown=true
     this.hideMeilleurVenteTown=true
     this.hidePrixreduitTown=true
     this.hideAllTown=true
  this.TakeSegmentValue="Homme"
  
       
  try {
  
    this.refresh=true
       this.SuccesPage=false
       this.error=false
        this.loader=true
           store.get("UserTown").then((value)=>{
            this.UserTown=value
            if(this.test==true){
              this.UserTown="Chap Chap"
            }
          })
    //fin
   //requete pour prendre tous les document de la collection produit
    const db = await getFirestore(app)
     //debut prendre les fournisseur de sa ville
   const refFour = await collection(db,"FOURNISSEURS")
   const AllFourInTown = await getDocs(refFour)
   let take4=[]
   AllFourInTown.forEach((element)=>{
      take4.push(element.data())
      
   })
   take4.forEach(element => {
       if(element.NombreDEPub>0 && element.active==true){
         this.TopMagasin.push(element)
         
       }
   });
   //au niveau des magasin
   this.TopMagasin.forEach(element => {
        if(element.Ville==this.UserTown){
          this.TopMagasinVille.push(element)
        }
   });
   if(!this.TopMagasinVille[0]) this.hideTopBoutique=false
    //app info pour les prix
    const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
     //debut APPiNFO MEILLEURvENTE
   const refMvente= await doc(db,"APPINFO",'MeilleurVente')
   const nVente = await getDoc(refMvente)
   var takeNvente=50
   var nday = 7
   if(nVente.exists()){
     const take = nVente.data()
     takeNvente= take.nVente
     nday=take.nday
     this.PrendreNvente= take.nVente
   }
    //taking all data in collection
    const requetAlldata= await query(collection(db,"PRODUITS"),where("publier","==",true))
      await getDocs(requetAlldata).then(val =>{
        val.forEach(data=>{
               this.AllDataInCollection.push(data.data())
        })
      })
      //ajout des prix a all data 
    this.AllDataInCollection.forEach(element => {
       element.prix=parseInt(element.prix)
           let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
    });
    //fin taking all data
    //debut des requete
   const RequeteHomme=   await query(collection(db,"PRODUITS"),where("publier","==",true))
   const Produit= await getDocs(RequeteHomme)
   Produit.forEach((docu)=>{
     this.ProduitsShow.push(docu.data())
   });
       if(this.ProduitsShow.length==0){
         this.error=true
         this.loader=false
       } else if(this.ProduitsShow.length!=0){
         //le filtrage des donne
          this.ProduitsShow.forEach((element) => {
             //convertissons tous les prix en nombre
            element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
              if(element['categori']=="Homme" || element['categori']=="HommeFemme"){
                this.HommeData.push(element)
              } 
          });
           //debut de filtrage
          this.HommeData.forEach(element => {
            if(element.ville==this.UserTown){
              this.AllTown.push(element)
            }
          });
          if(!this.AllTown[0]) this.hideAllTown=false

        let take1 =[]
          this.HommeData.forEach((element) => {
                  //gestion du temps 
            let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.NouvelArivage.push(element)
              if (element.ville==this.UserTown){
               take1.push(element)
               this.NouvelArivageVille.push(element)
              } 
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.NouvelArivage.push(element)
                  if (element.ville==this.UserTown){
                 take1.push(element)
                 this.NouvelArivageVille.push(element)
                  } 
               }
             }
          });
          this.NouvelArivage=this.NouvelArivage.sort((a,b)=>b.Cree-a.Cree)
          this.NouvelArivageVille=this.NouvelArivageVille.sort((a,b)=>b.Cree-a.Cree)
          if(!take1[0]) this.hideNouvelleArrivageTown=false

          //debut gestion Meilleur Vente
          let take3 = []
           this.HommeData.forEach(async(element)=> {
              if(element['Nvente']>=takeNvente){
                 if(!element.dateNvente){
               const refProduct = await doc(db,"PRODUITS",element.id)
              await updateDoc(refProduct,{
               dateNvente:Timestamp.now()
             }).then(()=>this.MeilleurVente.push(element))
                 } else{
                    let timestamp  = Timestamp.now()
                    let DateNow = new Date(timestamp.seconds*1000)
                    let ProductDate = new Date(element.dateNvente.seconds*1000)
                    let TimeDiff=DateNow.getTime()-ProductDate.getTime()
                     let result = TimeDiff/(1000 * 3600 * 24)
                     if(result<=nday){
                          this.MeilleurVente.push(element)
                     }
                 }
                
                
                if(element.ville==this.UserTown){
                 take3.push(element)
                 this.MeilleurVenteVille.push(element)
                } 
              
              }
          });
           this.MeilleurVente.sort((a,b)=>b.Nvente-a.Nvente)
           this.MeilleurVenteVille.sort((a,b)=>b.Nvente-a.Nvente)
           if(!take3[0])this.hideMeilleurVenteTown=false
          //fin gestion Meilleur Vente
          //debut gestion Prix Reduit
          let take2=[]
           this.HommeData.forEach((element)=> {
              if(element['prix']<=150000){
                this.PrixReduit.push(element)
                if(element.ville==this.UserTown){
                 take2.push(element)
                 this.PrixreduitVille.push(element)
                } 
              }
          });
          if(!take2[0]) this.hidePrixreduitTown=false
           this.PrixReduit.sort((a,b)=>a.prix-b.prix)
         // fin gestion Prix reduit
           //gestion pour MoreLiked
          
          this.HommeData.forEach(element => {
            if(element['liked']>=10){
              this.MoreLiked.push(element)
            }
          });

         this.MoreLiked.sort(function trie(a,b){
           return b.liked-a.liked
         })
               
         //fin filtrage
          
         this.SuccesPage=true
         this.loader=false
         this.click1=false
         this.error=false
       }
   
     
  
     //fin
  } catch (e) {
     this.SuccesPage=false
     this.error=true
     this.loader=false
     this.refresh=false
     this.click1=false
  }
 
},


computed:{
  
  //pour la recherche
  ForFiltre(){
    if(this.recherche){
          
         return 2 
       } 
    else{

        return 0
    
    }
  },
  //ici cache tout affichage pour afficher tout le catalogue
  ifSerach(){
    if(this.recherche){
      return false
    } else{
      return true
     
    }
  },
  //ifSearch1 affiche tout le catagalogue qui deja filtre
  ifsearch1(){
    if(this.recherche){
       return true
    }
    else{
      return false
    }
  } 
},

watch:{
  //pour la recherche
  recherche:function(){
    this.WatchRecherche()
     this.Activefiltre=2
  },
  //pour le filtrage
  DMV:function(){
   this.watchPourMemeVille()
  },
  Tout:function(){
    this.WatchRecherche()
  },
  Prixreduit:function(){
    this.takingSearchData=this.takingSearchData.filter(e=>e.prix<=150000)
  }
},

methods:{
  
  //gestion des fournisseurs
 async GetFourId(value){
    if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
  this.$router.push({name:"OneFourView",params:{id:value}})
  },
 async GotoALLFour(value){
 if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
  
  this.$router.push({name:"FournisseurPartie",params:{value:value}})
  
  },
  //founction pour le watch sur la recherche
  WatchRecherche(){
    this.takingSearchData  = this.AllDataInCollection.filter(item=>{
              return this.recherche
              .toLowerCase()
              .split('')
              .every(v=>item.nom.toLowerCase().includes(v))
            })
            this.refresh=false
  },
  watchPourMemeVille(){
this.takingSearchData=this.takingSearchData.filter(e=>e.ville==this.UserTown)
  },
  //filtrage chip
  ChipFiltre(e){
   this.Activefiltre=e
   if(e==1){
     this.DMV=this.DMV+1
   } else if (e==2){
     this.Tout=this.Tout+1
   } else if (e==3){
     this.Prixreduit=this.Prixreduit+1
   }
   
  },
  //button en cas d'erreur
async  TryAgain(){
   if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
this.TakeSegmentValue="Homme"
  
       
  try {
    //vidage de tous 
    this.click1=true
    this.ProduitsShow=[]
     this.NouvelArivage=[]
     this.MeilleurVente=[]
     this.HommeData=[]
     this.PrixReduit=[]
     this.MoreLiked=[]
     this.TopMagasin=[]
     this.TopMagasinVille=[]
     this.MeilleurVenteVille=[]
     this.NouvelArivageVille=[]
     this.PrixreduitVille=[]
     this.AllTown=[]
     this.hideNouvelleArrivageTown=true
     this.hideMeilleurVenteTown=true
     this.hidePrixreduitTown=true
     this.hideTopBoutique=true
     this.hideAllTown=true
    this.refresh=false
    this.click1=true
       this.SuccesPage=false
       this.error=false
        this.loader=true
          await store.get("UserTown").then((value)=>{
            this.UserTown=value
            if(this.test==true){
              this.UserTown="Chap Chap"
            }
          })
    //fin
   //requete pour prendre tous les document de la collection produit
    const db = await getFirestore(app)
     //debut prendre les fournisseur de sa ville
   const refFour = await collection(db,"FOURNISSEURS")
   const AllFourInTown = await getDocs(refFour)
   let take4=[]
   AllFourInTown.forEach((element)=>{
      take4.push(element.data())
   })
   take4.forEach(element => {
       if(element.NombreDEPub>0 && element.active==true){
         this.TopMagasin.push(element)
       }
   });
   //au niveau du magasin
    this.TopMagasin.forEach(element => {
        if(element.Ville==this.UserTown){
          this.TopMagasinVille.push(element)
        }
   });
   if(!this.TopMagasinVille[0]) this.hideTopBoutique=false
    //app info pour les prix
    const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
     //debut APPiNFO MEILLEURvENTE
   const refMvente= await doc(db,"APPINFO",'MeilleurVente')
   const nVente = await getDoc(refMvente)
   var takeNvente=50
   var nday=7
   if(nVente.exists()){
     const take = nVente.data()
     takeNvente= take.nVente
     nday=take.nday
     this.PrendreNvente= take.nVente
   }
    //taking all data in collection
    const requetAlldata= await query(collection(db,"PRODUITS"),where("publier","==",true))
      await getDocs(requetAlldata).then(val =>{
        val.forEach(data=>{
               this.AllDataInCollection.push(data.data())
        })
      })
       this.AllDataInCollection.forEach(element => {
       element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
          
    });
    //fin taking all data
    //debut des requete
   const RequeteHomme=   await query(collection(db,"PRODUITS"),where("publier","==",true))
   const Produit= await getDocs(RequeteHomme)
   Produit.forEach((docu)=>{
     this.ProduitsShow.push(docu.data())
   });
       if(this.ProduitsShow.length==0){
         this.error=true
         this.loader=false
       } else if(this.ProduitsShow.length!=0){
         //le filtrage des donne
          this.ProduitsShow.forEach((element) => {
             //convertissons tous les prix en nombre
            element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
              if(element['categori']=="Homme" || element['categori']=="HommeFemme"){
                this.HommeData.push(element)
              } 
          });
            //debut de filtrage
             this.HommeData.forEach(element => {
            if(element.ville==this.UserTown){
              this.AllTown.push(element)
            }
          });
          if(!this.AllTown[0]) this.hideAllTown=false
        let take1 =[]
          this.HommeData.forEach((element) => {
                  //gestion du temps 
            let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.NouvelArivage.push(element)
              if (element.ville==this.UserTown){
               take1.push(element)
               this.NouvelArivageVille.push(element)
              } 
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.NouvelArivage.push(element)
                  if (element.ville==this.UserTown){
                 take1.push(element)
                 this.NouvelArivageVille.push(element)
                  } 
               }
             }
          });
          this.NouvelArivage=this.NouvelArivage.sort((a,b)=>b.Cree-a.Cree)
          this.NouvelArivageVille=this.NouvelArivageVille.sort((a,b)=>b.Cree-a.Cree)
          if(!take1[0]) this.hideNouvelleArrivageTown=false
          //debut gestion Meilleur Vente
         let take3 = []
           this.HommeData.forEach(async(element)=> {
              if(element['Nvente']>=takeNvente){
                 if(!element.dateNvente){
               const refProduct = await doc(db,"PRODUITS",element.id)
              await updateDoc(refProduct,{
               dateNvente:Timestamp.now()
             }).then(()=>this.MeilleurVente.push(element))
                 } else{
                    let timestamp  = Timestamp.now()
                    let DateNow = new Date(timestamp.seconds*1000)
                    let ProductDate = new Date(element.dateNvente.seconds*1000)
                    let TimeDiff=DateNow.getTime()-ProductDate.getTime()
                     let result = TimeDiff/(1000 * 3600 * 24)
                     if(result<=nday){
                          this.MeilleurVente.push(element)
                     }
                 }
                
                
                if(element.ville==this.UserTown){
                 take3.push(element)
                 this.MeilleurVenteVille.push(element)
                } 
              
              }
          });
           this.MeilleurVente.sort((a,b)=>b.Nvente-a.Nvente)
           this.MeilleurVenteVille.sort((a,b)=>b.Nvente-a.Nvente)
           if(!take3[0])this.hideMeilleurVenteTown=false
          //fin gestion Meilleur Vente
          //debut gestion Prix Reduit
          let take2=[]
           this.HommeData.forEach((element)=> {
              if(element['prix']<=150000){
                this.PrixReduit.push(element)
                if(element.ville==this.UserTown){
                 take2.push(element)
                 this.PrixreduitVille.push(element)
                } 
              }
          });
          if(!take2[0]) this.hidePrixreduitTown=false
           this.PrixReduit.sort((a,b)=>a.prix-b.prix)
         // fin gestion Prix reduit
           //gestion pour MoreLiked
          
          this.HommeData.forEach(element => {
            if(element['liked']>=10){
              this.MoreLiked.push(element)
            }
          });

         this.MoreLiked.sort(function trie(a,b){
           return b.liked-a.liked
         })
         //fin gestion MoreLiked
               
         //fin filtrage
          
         this.SuccesPage=true
         this.loader=false
         this.click1=false
         this.error=false
       }
   
     
  
     //fin
  } catch (e) {
     this.SuccesPage=false
     this.error=true
     this.loader=false
     this.refresh=false
     this.click1=false
     
  }
  },
  //Go To Produit detail 
 async GetIdProduits(id){
    if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
    let iD=id
    iD.trim()
    this.$router.push({name:'ProductDetailPage',params:{id:iD,prix:"none"}})
  },
  //Go to filter page
async GotoALLCategory(name){
   if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
    this.$router.push({name:'HommeFemmeAllProduct',params:{categori:this.TakeSegmentValue,type:name}})
},
//controle segment button
async segmentChanged(val){
   if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer votre internet"})
      alert.present()
      return
    }
  try {
  
   if(val.detail.value){
   this.TakeSegmentValue=val.detail.value
   this.recherche=""
     this.SegmantButton=false
     this.SuccesPage=false
     this.error=false
     this.loader=true
     //vidage des tableau pour un changement de donne
     this.ProduitsShow=[]
     this.NouvelArivage=[]
     this.MeilleurVente=[]
     this.HommeData=[]
     this.PrixReduit=[]
     this.MoreLiked=[]
     this.TopMagasin=[]
     this.TopMagasinVille=[]
     this.MeilleurVenteVille=[]
     this.NouvelArivageVille=[]
     this.PrixreduitVille=[]
     this.AllTown=[]
     this.hideNouvelleArrivageTown=true
     this.hideMeilleurVenteTown=true
     this.hidePrixreduitTown=true
     this.hideTopBoutique=true
     this.hideAllTown=true
     this.click1=true
     this.refresh=false
     //requete
      const db = await getFirestore(app)
       const refFour = await collection(db,"FOURNISSEURS")
   const AllFourInTown = await getDocs(refFour)
    let take4=[]
   AllFourInTown.forEach((element)=>{
      take4.push(element.data())
   })
  
       //app info pour les prix
       const refMvente= await doc(db,"APPINFO",'MeilleurVente')
   const nVente = await getDoc(refMvente)
   var takeNvente=50
   var nday = 7 
   if(nVente.exists()){
     const take = nVente.data()
     takeNvente= take.nVente
     nday=take.nday
     this.PrendreNvente= take.nVente
   }
    const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   const RequeteHomme=   await query(collection(db,"PRODUITS"),where("publier","==",true))
   const produit= await getDocs(RequeteHomme)
    produit.forEach((docu)=>{
     this.ProduitsShow.push(docu.data())
   });
   this.Accesoires=true
   //fin

   //controle affichage
       if(this.ProduitsShow.length==0){
         this.error=true
         this.loader=false
       } else if(this.ProduitsShow.length!=0){
         //controle pour les accessoires
         if(`${val.detail.value}`=="accessoires"){
            this.ProduitsShow.forEach((element) => {
               //convertissons tous les prix en nombre
            element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000 ){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
          if(element['categori']==`${val.detail.value}`){
            this.HommeData.push(element)
          }
        });
        //debut forunisseurs
        take4.forEach(element => {
          if(element.TypeMagasin=='accessoires' && element.NombreDEPub>0 && element.active==true){
            this.TopMagasin.push(element)
          }
        });
         this.TopMagasin.forEach(element => {
        if(element.Ville==this.UserTown){
          this.TopMagasinVille.push(element)
        }
   });
   if(!this.TopMagasinVille[0]) this.hideTopBoutique=false
   //fin fournisseur
          //debut de filtrage
        let take1 =[]
         this.HommeData.forEach(element => {
            if(element.ville==this.UserTown){
              this.AllTown.push(element)
            }
          });
          if(!this.AllTown[0]) this.hideAllTown=false
      
          this.HommeData.forEach((element) => {
                  //gestion du temps 
            let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.NouvelArivage.push(element)
              if (element.ville==this.UserTown){
               take1.push(element)
               this.NouvelArivageVille.push(element)
              } 
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.NouvelArivage.push(element)
                  if (element.ville==this.UserTown){
                 take1.push(element)
                 this.NouvelArivageVille.push(element)
                  } 
               }
             }
          });
          this.NouvelArivage=this.NouvelArivage.sort((a,b)=>b.Cree-a.Cree)
          this.NouvelArivageVille=this.NouvelArivageVille.sort((a,b)=>b.Cree-a.Cree)
          if(!take1[0]) this.hideNouvelleArrivageTown=false
          //debut gestion Meilleur Vente
         let take3 = []
           this.HommeData.forEach(async(element)=> {
              if(element['Nvente']>=takeNvente){
                 if(!element.dateNvente){
               const refProduct = await doc(db,"PRODUITS",element.id)
              await updateDoc(refProduct,{
               dateNvente:Timestamp.now()
             }).then(()=>this.MeilleurVente.push(element))
                 } else{
                    let timestamp  = Timestamp.now()
                    let DateNow = new Date(timestamp.seconds*1000)
                    let ProductDate = new Date(element.dateNvente.seconds*1000)
                    let TimeDiff=DateNow.getTime()-ProductDate.getTime()
                     let result = TimeDiff/(1000 * 3600 * 24)
                     if(result<=nday){
                          this.MeilleurVente.push(element)
                     }
                 }
                
                
                if(element.ville==this.UserTown){
                 take3.push(element)
                 this.MeilleurVenteVille.push(element)
                } 
              
              }
          });
           this.MeilleurVente.sort((a,b)=>b.Nvente-a.Nvente)
           this.MeilleurVenteVille.sort((a,b)=>b.Nvente-a.Nvente)
           if(!take3[0])this.hideMeilleurVenteTown=false
          //fin gestion Meilleur Vente
          //debut gestion Prix Reduit
          let take2=[]
           this.HommeData.forEach((element)=> {
              if(element['prix']<=150000){
                this.PrixReduit.push(element)
                if(element.ville==this.UserTown){
                 take2.push(element)
                 this.PrixreduitVille.push(element)
                } 
              }
          });
          if(!take2[0]) this.hidePrixreduitTown=false
           this.PrixReduit.sort((a,b)=>a.prix-b.prix)
         // fin gestion Prix reduit
           //gestion pour MoreLiked
          
          this.HommeData.forEach(element => {
            if(element['liked']>=10){
              this.MoreLiked.push(element)
            }
          });

         this.MoreLiked.sort(function trie(a,b){
           return b.liked-a.liked
         })
         //fin filtrage
       
         //fin controle accesoire
         //debut Homme et Femme
      } else if (`${val.detail.value}`!="accessoires"){
         //debut filtrage 
        this.ProduitsShow.forEach((element) => {
           element.prix=parseInt(element.prix)
         element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
          if(element['categori']==`${val.detail.value}` || element['categori']=="HommeFemme"){
            this.HommeData.push(element)
          }
        });
        //debut fournisseurs
        take4.forEach(element => {
          if(element.TypeMagasin==`${val.detail.value}` && element.NombreDEPub>0 && element.active==true){
            this.TopMagasin.push(element)
          }
        });
         this.TopMagasin.forEach(element => {
        if(element.Ville==this.UserTown){
          this.TopMagasinVille.push(element)
        }
   });
   if(!this.TopMagasinVille[0]) this.hideTopBoutique=false
        //fin fournisseurs
            //debut filtrage
            //debut de filtrage
        let take1 =[]
         this.HommeData.forEach(element => {
            if(element.ville==this.UserTown){
              this.AllTown.push(element)
            }
          });
          if(!this.AllTown[0]) this.hideAllTown=false
          this.HommeData.forEach((element) => {
                  //gestion du temps 
            let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.NouvelArivage.push(element)
              if (element.ville==this.UserTown){
               take1.push(element)
               this.NouvelArivageVille.push(element)
              } 
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.NouvelArivage.push(element)
                  if (element.ville==this.UserTown){
                 take1.push(element)
                 this.NouvelArivageVille.push(element)
                  } 
               }
             }
          });
          this.NouvelArivage=this.NouvelArivage.sort((a,b)=>b.Cree-a.Cree)
          this.NouvelArivageVille=this.NouvelArivageVille.sort((a,b)=>b.Cree-a.Cree)
          if(!take1[0]) this.hideNouvelleArrivageTown=false
          //debut gestion Meilleur Vente
         let take3 = []
           this.HommeData.forEach(async(element)=> {
              if(element['Nvente']>=takeNvente){
                 if(!element.dateNvente){
               const refProduct = await doc(db,"PRODUITS",element.id)
              await updateDoc(refProduct,{
               dateNvente:Timestamp.now()
             }).then(()=>this.MeilleurVente.push(element))
                 } else{
                    let timestamp  = Timestamp.now()
                    let DateNow = new Date(timestamp.seconds*1000)
                    let ProductDate = new Date(element.dateNvente.seconds*1000)
                    let TimeDiff=DateNow.getTime()-ProductDate.getTime()
                     let result = TimeDiff/(1000 * 3600 * 24)
                     if(result<=nday){
                          this.MeilleurVente.push(element)
                     }
                 }
                
                
                if(element.ville==this.UserTown){
                 take3.push(element)
                 this.MeilleurVenteVille.push(element)
                } 
              
              }
          });
           this.MeilleurVente.sort((a,b)=>b.Nvente-a.Nvente)
           this.MeilleurVenteVille.sort((a,b)=>b.Nvente-a.Nvente)
           if(!take3[0])this.hideMeilleurVenteTown=false
          //fin gestion Meilleur Vente
          //debut gestion Prix Reduit
          let take2=[]
           this.HommeData.forEach((element)=> {
              if(element['prix']<=150000){
                this.PrixReduit.push(element)
                if(element.ville==this.UserTown){
                 take2.push(element)
                 this.PrixreduitVille.push(element)
                } 
              }
          });
          if(!take2[0]) this.hidePrixreduitTown=false
           this.PrixReduit.sort((a,b)=>a.prix-b.prix)
         // fin gestion Prix reduit
           //gestion pour MoreLiked
          
          this.HommeData.forEach(element => {
            if(element['liked']>=10){
              this.MoreLiked.push(element)
            }
          });

         this.MoreLiked.sort(function trie(a,b){
           return b.liked-a.liked
         })
           //fin gestion Plus de like
         //fin filtrage

         }
         this.SuccesPage=true
         this.SegmantButton=true
         this.loader=false
         this.click1=false
         this.refresh=true
       }
      
      
   }

  }
    catch (e) {
      this.SuccesPage=false
      this.error=true
      this.loader=false
      console.log(e.message)
  }
},
async doRefresh(event){
  this.loader=true
  this.SuccesPage=false
  this.NouvelArivage= this.NouvelArivage.reverse()
  this.PrixReduit= this.PrixReduit.reverse()
  this.MoreLiked= this.MoreLiked.reverse()
  setTimeout(()=>{
    event.target.complete();
    this.loader=false
    this.SuccesPage=true
  },3000)
  
}
  
  

 }
 
 
})


</script>
<style lang="scss" scoped>
ion-title{
  font-size: 18px;
}
.tabs{
  ion-segment{
    --background: none;
    ion-segment-button{
      font-size: 1rem;
      border-width: 0;
      --padding-start: 8px !important ;
      --padding-bottom: 3px !important ;
      --padding-end: 8px !important ;
      --padding-top: 3px !important ;
       --background-checked:#03A61c ;
       --indicator-color :transparent !important;
       --color:#d1d1d1 ;
       --color-checked:#fff;
        font-weight: bold;
        border-radius: 22px;

    }
  }
}
ion-header ion-toolbar ion-icon{
  font-size: 32px;
  padding-right: 20px;
}
.toolbarForSearch{

 
}
.toolBarForCategoerie ion-label{
    font-size: 12px;
  
    
}
.erreur{
  text-align: center;
}

.swiper .swiperslide ion-card{
  width: 45%;
}

.iteme {
  overflow: auto;
  white-space: nowrap;
}
.iteme ion-card{
  display: inline-block;
}
.iteme ion-card img{
  width: 180px;
  height: 180px;
  object-fit: fill;
}

.les-chipFiltre{
  text-align: center;
}

.ichipFiltre{
  background-color: #03A61c;
  color:white ;
}

h6{
  color: #898585;
}
.c{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.g ion-card img {
   width: 180px;
  height: 180px;
  object-fit: fill;
}
.g{
  width: 50%;
  height: 50%;
}
.index{
  padding: 10px;
  background: #eeee;
  border-radius: 10px;
  font-weight: bold;
  margin: 4px;
}
</style>
