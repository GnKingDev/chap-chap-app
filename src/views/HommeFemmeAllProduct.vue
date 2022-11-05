<template>
  <ion-page>
   <ion-header class="ion-no-border" slot="fixed">
      <ion-toolbar mode="ios">
        <ion-back-button default-href="/tabs/tab1" slot="start"></ion-back-button>
      <LogoName town="chap chap"  />
      </ion-toolbar>
       <ion-toolbar v-if="SuccesPage" >
       <ion-searchbar :animated="true" mode="ios" placeholder="Recherche" v-model="Recherche"></ion-searchbar>
       </ion-toolbar >
         <div  class="path" v-if="SuccesPage"  >
    <ion-label > {{this.$route.params.categori}} > {{this.$route.params.type}} </ion-label>
      </div>
      </ion-header>
    <ion-content >
       <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)" pullFactor="0.8" pullMin="60" pullMax="120" v-if="refresh">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
    <LoaderPage v-if="loader" />
      
     <div class="for-all" v-if="SuccesPage" >


         <div class="c3"  >
           <div class="g3" v-for="data in search" :key="data.id"    >

               <ion-card @click="GetIdProduits(data.id)" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>
     </div>

       <div   v-if="error" align="center">
         <ion-img :src="require('../images/erreurImage.png')"  ></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent,  } from 'vue';
import { IonPage, IonHeader, IonToolbar,  IonContent,IonLabel,loadingController,IonSearchbar,IonBackButton,alertController,IonRefresher,IonRefresherContent,IonImg,IonButton,IonCard,IonCardContent } from '@ionic/vue';
import LogoName from '@/components/LgoName.vue'
import { collection,getDocs,getFirestore,query,doc,getDoc,Timestamp, where } from "firebase/firestore"
import app from '@/firebase';
import LoaderPage from '@/components/LoaderPage.vue'
import store from '@/VerifyUserStore';
export default defineComponent({
  name: 'HommeFemmeAllProduct',
  components: {  IonHeader, IonContent, IonPage ,IonToolbar,LogoName,LoaderPage,IonBackButton,IonRefresher,IonRefresherContent,IonLabel,IonSearchbar,IonImg,IonButton,IonCardContent,IonCard  },
  data(){
          return{
            //les icon
            loadingController,
            alertController,
            //les reactive
             Recherche:"",
             path:"",
             path2:"",
             //v if
             SuccesPage:false,
             error:false,
             loader:true,
             refresh:true,
             //data
            AllData:[],
            DataFiltre:[],
            DataShow:[],
          }
  },
async  ionViewDidEnter(){
     const attendre=await loadingController.create({message:"Veillez activer votre internet"})
    window.addEventListener("offline",()=>{
        attendre.present()
    })
    window.addEventListener("online",()=>{
        attendre.dismiss()
    })
  },
  computed:{
    //cas de recherche
    search(){
         if(this.Recherche){
           return this.DataShow.filter(item=>{
              return this.Recherche
              .toLowerCase()
              .split('')
              .every(v=>item.nom.toLowerCase().includes(v))
            })
         } else{
           return this.DataShow
         }
    }
    //fin gestion cherche
  },
  
async beforeCreate(){
    
  try {
    let UserTown=""
     this.SuccesPage=false
    this.error=false
    this.refresh=true
     this.path= this.$route.params.categori
    this.path2= this.$route.params.type
    this.loader=true
   await store.get('UserTown').then((value)=>UserTown=value)
 //fin controle attendre
 //debut requete dynamic
 const db = await getFirestore(app)
 const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
  var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
  //debut APPINFO MEILLEURVENTE
   const refMvente= await doc(db,"APPINFO",'MeilleurVente')
   const nVente = await getDoc(refMvente)
   let takeNvente=50
   if(nVente.exists()){
     let take = nVente.data()
     takeNvente=take.nVente
   }
  const refProduits= await query(collection(db,"PRODUITS"),where("publier","==",true))
    await getDocs(refProduits).then((data)=>{
      data.forEach((docu)=>{
        this.AllData.push(docu.data())
      })
    })
      //ajout sur les prix 
      this.AllData.forEach(element => {
           element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
                //ajout des prix sur les produit
               
      //gestion en cas d'erreure
    })
    if(this.AllData.length!=0){
      //filtrage 
      this.AllData.forEach(element => {
          if(element['categori']==`${this.$route.params.categori}` || element['categori']=="HommeFemme"){
                  this.DataFiltre.push(element)
          }
      });
      //filtrage si click voir tout de meilleur vente
     if(`${this.$route.params.type}`=="Meilleur Vente"){
       this.DataFiltre.forEach((element)=>{
         if(element['Nvente']>=takeNvente){
           this.DataShow.push(element)
         }
       })
       this.DataShow.sort((a,b)=>b.Nvente-a.Nvente)
       // filtrage aussi nouvel arrivage
     } else if(`${this.$route.params.type}`=="Nouvel Arrivage"){
        this.DataFiltre.forEach(element => {
         let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.DataShow.push(element)
               
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.DataShow.push(element)
               }
             }
            
        });
    this.DataFiltre =this.DataShow.sort((a,b)=>b.Cree-a.Cree)
        //filtrage aussi tout le catologue
     } else if(`${this.$route.params.type}`=="Prix Reduit"){
         this.DataFiltre.forEach(element => {
           if(element['prix']<=150000){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Plus de Like"){
             this.DataFiltre.forEach(element => {
           if(element['liked']>=10){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Prix Reduit de votre Ville"){
          this.DataFiltre.forEach(element => {
           if(element['prix']<=150000 && element.ville==UserTown){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Nouvel Arrivage de votre ville"){
         this.DataFiltre.forEach(element => {
         let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival && element.ville==UserTown){
               this.DataShow.push(element)
               
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip && element.ville==UserTown){
                 this.DataShow.push(element)
               }
             }
     })
            this.DataShow= this.DataShow.sort((a,b)=>b.Cree-a.Cree)
     } else if (`${this.$route.params.type}`=="Meilleur Vente de votre ville"){
         this.DataFiltre.forEach((element)=>{
         if(element['Nvente']>=50 && element.ville==UserTown){
           this.DataShow.push(element)
         }
       })
       this.DataShow.sort((a,b)=>b.Nvente-a.Nvente)
     } else if (`${this.$route.params.type}`=="Tous les produits"){
       this.DataFiltre.forEach(element => {
           if(element.ville==UserTown){
             this.DataShow.push(element)
           }
       });
     }
      this.SuccesPage=true
      this.error=false
      this.loader=false
    } 
    
    } catch (erro){
      this.loader=false
      this.SuccesPage=false
      this.error=true
    }
   
 },
 methods:{
 
   //gestion en cas derreure
   async TryAgain(){
     if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    return
  }
  try {
    let UserTown=""
     this.SuccesPage=false
    this.error=false
    this.refresh=true
     this.path= this.$route.params.categori
    this.path2= this.$route.params.type
    this.loader=true
   await store.get('UserTown').then((value)=>UserTown=value)
 //fin controle attendre
 //debut requete dynamic
 const db = await getFirestore(app)
 const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
  var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
  //debut APPINFO MEILLEURVENTE
  //debut APPINFO MEILLEURVENTE
   const refMvente= await doc(db,"APPINFO",'MeilleurVente')
   const nVente = await getDoc(refMvente)
   let takeNvente=50
   if(nVente.exists()){
     let take = nVente.data()
     takeNvente=take.nVente
   }
  const refProduits= await query(collection(db,"PRODUITS"),where("publier","==",true))
    await getDocs(refProduits).then((data)=>{
      data.forEach((docu)=>{
        this.AllData.push(docu.data())
      })
    })
      //ajout sur les prix 
      this.AllData.forEach(element => {
           element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
                //ajout des prix sur les produit
               
      //gestion en cas d'erreure
    })
    if(this.AllData.length!=0){
      //filtrage 
      this.AllData.forEach(element => {
          if(element['categori']==`${this.$route.params.categori}`){
                  this.DataFiltre.push(element)
          }
      });
      //filtrage si click voir tout de meilleur vente
     if(`${this.$route.params.type}`=="Meilleur Vente"){
       this.DataFiltre.forEach((element)=>{
         if(element['Nvente']>=takeNvente){
           this.DataShow.push(element)
         }
       })
       this.DataShow.sort((a,b)=>b.Nvente-a.Nvente)
       // filtrage aussi nouvel arrivage
     } else if(`${this.$route.params.type}`=="Nouvel Arrivage"){
        this.DataFiltre.forEach(element => {
         let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival){
               this.DataShow.push(element)
               
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip){
                 this.DataShow.push(element)
               }
             }
            
        });
    this.DataFiltre =this.DataShow.sort((a,b)=>b.Cree-a.Cree)
        //filtrage aussi tout le catologue
     } else if(`${this.$route.params.type}`=="Prix Reduit"){
         this.DataFiltre.forEach(element => {
           if(element['prix']<=150000){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Plus de Like"){
             this.DataFiltre.forEach(element => {
           if(element['liked']>=10){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Prix Reduit de votre Ville"){
          this.DataFiltre.forEach(element => {
           if(element['prix']<=150000 && element.ville==UserTown){
             this.DataShow.push(element)
           }
        });
         this.DataShow.sort((a,b)=>a.prix-b.prix)
     } else if (`${this.$route.params.type}`=="Nouvel Arrivage de votre ville"){
         this.DataFiltre.forEach(element => {
         let timestamp  = Timestamp.now()
             let DateNow = new Date(timestamp.seconds*1000)
             let ProductDate = new Date(element.Cree.seconds*1000)
             let TimeDiff=DateNow.getTime()-ProductDate.getTime()
             let result = TimeDiff/(1000 * 3600 * 24)
             element.Cree = ProductDate
             if(result<=Price.NdaynewArrival && element.ville==UserTown){
               this.DataShow.push(element)
               
             } else{
               //gestion cas de premium
               if(element.premium==true && result<=Price.NdaynewArivalVip && element.ville==UserTown){
                 this.DataShow.push(element)
               }
             }
     })
            this.DataShow= this.DataShow.sort((a,b)=>b.Cree-a.Cree)
     } else if (`${this.$route.params.type}`=="Meilleur Vente de votre ville"){
         this.DataFiltre.forEach((element)=>{
         if(element['Nvente']>=50 && element.ville==UserTown){
           this.DataShow.push(element)
         }
       })
       this.DataShow.sort((a,b)=>b.Nvente-a.Nvente)
     }else if (`${this.$route.params.type}`=="Tous les produits"){
       this.DataFiltre.forEach(element => {
           if(element.ville==UserTown){
             this.DataShow.push(element)
           }
       });
     }
      this.SuccesPage=true
      this.error=false
      this.loader=false
    } 
    
    } catch (erro){
      this.loader=false
      this.SuccesPage=false
      this.error=true
    }
   
  
    
 
   },
  async GetIdProduits(id){
    if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    return
  }
     this.$router.push({name:'ProductDetailPage',params:{id:id,prix:"none"}})
   },
   doRefresh(event){
    this.loader=true
    this.SuccesPage=false
    this.DataShow.reverse()
    setTimeout(()=>{
      this.loader=false
      this.SuccesPage=true
      event.target.complete()
    },3000)
   }
 }
});
</script>
<style scoped>
.c3{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.g3 ion-card img {
   width: 180px;
  height: 180px;
  object-fit: fill;
}
.g3{
  width: 50%;
  height: 50%;
}
.erreur{
  text-align: center;
}
.path{
  text-align: center;
  color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

</style>
