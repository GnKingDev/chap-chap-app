<template>
 <ion-page>
      <ion-header class="ion-no-border">
       <ion-toolbar>
              <ion-back-button slot="start" default-href="/tabs/tab1"></ion-back-button>
               <MenuName :title="nom" />
       </ion-toolbar>
       <ion-toolbar>
         <ion-segment :value="SegmentValue" @ionChange="segmentChanged($event)" v-if="SuccesPage">
           <ion-segment-button value="Produit">
             <ion-label>Produit</ion-label>
           </ion-segment-button>
           <ion-segment-button value="Fournisseur">
             <ion-label>Fournisseur</ion-label>
           </ion-segment-button>
         </ion-segment>
       </ion-toolbar>
      </ion-header>
    <ion-content>
       
      <LoaderPage v-if="loader" />
      
        
         <div class="c1" v-if="SegmentValue=='Produit'" >
           <div class="g1" v-for="data in search " :key="data.id"   >

               <ion-card @click="GetIdProduits(data.id)" :button="true">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF </h6>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>

         <div class="c1" v-if="SegmentValue=='Fournisseur'" >
           <div class="g1" v-for="data in searchFour " :key="data.id"   >

               <ion-card @click="GetIFour(data.id)" :button="true">
                <img :src="data.Photo.link" />
                 <ion-card-content>
                <h6 >{{data.NomMagasin}} </h6>
                <h6 color="primary" > {{data.Ville}}  </h6>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>
     
      
       
   <div class="Pasfavoris" v-if="Pasfavoris && SegmentValue=='Produit' ">
       <h2>Vous n'avez pas de favoris pour le moment</h2>
   </div>
    <div class="Pasfavoris" v-if="PasfavorisFour && SegmentValue=='Fournisseur'">
       <h2>Vous n'avez pas de favoris pour le moment</h2>
   </div>

     <div align="center" v-if=" error">
         <ion-img :src="require('../images/erreurImage.png')" ></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import{IonToolbar,IonPage,IonContent,IonCard,IonCardContent,IonImg,IonHeader,loadingController,IonBackButton,alertController,IonButton,IonSegment,IonSegmentButton,IonLabel}from'@ionic/vue'
import{getFirestore,getDoc,doc} from "firebase/firestore"
import app from '@/firebase'
import MenuName from '@/components/MenuName.vue'
import LoaderPage from '@/components/LoaderPage.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth';
export default defineComponent ({
name:"MesFavoris",
components:{
  IonButton,
    IonPage,
    IonContent,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonImg,
    IonHeader,
    IonBackButton,
    MenuName,
    LoaderPage,
    IonSegment,
    IonSegmentButton,
    IonLabel
    
},
data(){
    return{
        loadingController,
        alertController,
        error:false,
        SuccesPage:false,
        Pasfavoris:false,
        PasfavorisFour:false,
        resultat:undefined,
        AllData:[],
        recherche:"",
        nom:"Mes Favoris",
        loader:true,
        refresh:false,
        SegmentValue:'Produit',
        FourData:[]
        
    }
},
 async ionViewDidEnter(){
  const attendre=await loadingController.create({message:"Veillez activer votre internet"})
    window.addEventListener("offline",()=>{
        attendre.present()
    })
    window.addEventListener("offline",()=>{
        attendre.dismiss()
    })
},

async beforeCreate(){
  try {
    this.SuccesPage=false
    this.error=false
    this.loader=true
      
   const db = await getFirestore(app)
   const auth = await getAuth(app)
     const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   //controle utilisateur
   let Useruid
   await onAuthStateChanged(auth,(user)=>Useruid=user.uid)
   //fin controle user
   const refUser= await doc(db,"USERS",`${Useruid}`)
   const data= await getDoc(refUser)
   if(data.exists()){
    const takeData = data.data()
    if(takeData.MesLike[0]){
     takeData.MesLike.forEach(async element => {
         const refproduits = await doc(db,"PRODUITS",`${element}`)
        const Produit= await getDoc(refproduits)
        if(Produit.exists()){
            this.AllData.push(Produit.data())
            //ajout des produits
            this.AllData.forEach(element => {
               if(!element.passed){
                  element.prix=parseInt(element.prix)
            let r = element.prix*2/100
            console.log(element.prix)
            console.log(r)
      if(r<1000){
         element.prix=element.prix+r+Price.a
         element.RealPrice=element.prix-(r+Price.a)
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
          element.RealPrice=element.prix-(r+Price.b)
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
         element.RealPrice=element.prix-(r+Price.c)
       }
       element.passed=true 
                }
            });
        }
      });
      this.Pasfavoris=false
     
      
    } else{
      this.Pasfavoris=true
      this.loader=false
      this.SuccesPage=true
    } 
    //gestion favosis fournisseurs 
    if(takeData.abonement[0]){
      takeData.abonement.forEach(async element => {
         const refFour = doc(db,"FOURNISSEURS",`${element}`)
         const FourInfo = await getDoc(refFour)
         if(FourInfo.exists()){
            this.FourData.push(FourInfo.data())
         }
      });
    } else{
     this.PasfavorisFour=true
     this.loader=false
     this.SuccesPage=true
    }
      this.loader=false
      this.SuccesPage=true
    
   }
    
  
   
  } catch (e) {
      this.error=true
      this.SuccesPage=false
      this.loader=false
     this.refresh=false
  }
},
computed:{
  search(){
      if(this.recherche && this.SegmentValue=="Produit"){
           return  this.AllData.filter(item=>{
                return this.recherche
                .toLowerCase()
                .split("")
                .every(v=>item.nom.toLowerCase().includes(v))
            })
      } else{
          return this.AllData
      }
  },
  searchFour(){
    if(this.recherche && this.SegmentValue=="Fournisseur"){
      return this.FourData.filter(item=>{
        return this.recherche
          .toLowerCase()
          .split("")
          .every(v=>item.NomMagasin.toLowerCase().includes(v))
      })
    } else{
      return this.FourData
    }
  }
},
methods:{
   async   TryAgain(){
  if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    this.SuccesPage=false
         this.loader=false
         this.refresh=false
    return
  }

      
  try {
    this.SuccesPage=false
    this.error=false
    this.loader=true
      this.SegmentValue='Produit'
   const db = await getFirestore(app)
   const auth = await getAuth(app)
     const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   //controle utilisateur
   let Useruid
   await onAuthStateChanged(auth,(user)=>Useruid=user.uid)
   //fin controle user
   const refUser= await doc(db,"USERS",`${Useruid}`)
   const data= await getDoc(refUser)
   if(data.exists()){
    const takeData = data.data()
    if(takeData.MesLike[0]){
     takeData.MesLike.forEach(async element => {
         const refproduits = await doc(db,"PRODUITS",`${element}`)
        const Produit= await getDoc(refproduits)
        if(Produit.exists()){
            this.AllData.push(Produit.data())
            //ajout des produits
             this.AllData.forEach(element => {
               if(!element.parsed){
                  element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000  && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
       element.parsed=true
               }
      
    });
        }
      });
      
     
      
    } else{
      this.Pasfavoris=true
      this.loader=false
      this.SuccesPage=true
    } 
    //gestion favosis fournisseurs 
    if(takeData.abonement[0]){
      takeData.abonement.forEach(async element => {
         const refFour = doc(db,"FOURNISSEURS",`${element}`)
         const FourInfo = await getDoc(refFour)
         if(FourInfo.exists()){
            this.FourData.push(FourInfo.data())
         }
      });
    } else{
     this.PasfavorisFour=true
     this.loader=false
     this.SuccesPage=true
    }
      this.loader=false
      this.SuccesPage=true
   }
    
  
   
  } catch (e) {
      this.error=true
      this.SuccesPage=false
      this.loader=false
     this.refresh=false
  }
    },
   // go to product detail page
  async  GetIdProduits(id){
  if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    return
  }
       this.$router.push({name:'ProductDetailPage',params:{id:id,prix:"none"}})
    },
    //go to fournisseur detail 
  async  GetIFour(id){
      if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    return
  }
     this.$router.push({name:"OneFourView",params:{id:id}})
    },
   //tabulation 
   segmentChanged(event){
     this.SegmentValue=event.detail.value
   }
   
}
})
</script>

<style scoped>
.c1{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.erreur{
  text-align: center;
}
.Pasfavoris{
  text-align: center;
  margin-top: 300px;
  color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.g1 ion-card img {
   width: 180px;
  height: 180px;
  object-fit: fill;
}
.g1{
  width: 50%;
  height: 50%;
}
</style>

