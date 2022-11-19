<template>
  <ion-page>
      <ion-header class="ion-no-border">
          <ion-toolbar>
              <ion-buttons slot="start">
                  <ion-menu-button menu="Menu"></ion-menu-button>
              </ion-buttons>
               <LogoName :town="test ? 'Chap Chap': UserTown"/>
               <ion-icon slot="end" :icon="restaurant" class="icon-resto-home" color="primary"></ion-icon>
          </ion-toolbar>
          <div  v-if="UserTown=='Conakry' && SuccesPage && onlyResto " class="ion-padding" >
              <ion-segment :value="segmentValue" @ionChange="segmentChanged($event)">
                  <ion-segment-button value="All">
                      <ion-label>Tout</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="Proche">
                      <ion-label>Plus proche</ion-label>
                  </ion-segment-button>
              </ion-segment>
          </div>
      </ion-header>
      <ion-content>
          <div class="text ion-text-center" v-if="SuccesPage">
               l'eau ou le jus est achete avec un plat dans un meme restaurant 
          </div>
         <div v-if="SuccesPage">
          <div v-for="(R,index) in search" :key="index">
             <ion-toolbar mode="ios">
                 <ion-thumbnail slot="start">
                     <img :src="R.LinkPhoto" />
                 </ion-thumbnail>
            <ion-label class="ion-text-nowrap ion-padding">{{R.NomResto}}  {{R.Ville=="Conakry" && segmentValue=="Proche"  ? R.d+ " " + "mètres de vous" : " "}}  {{R.Ville=="Conakry" ? R.Quartier:""}} </ion-label>
             </ion-toolbar>

             <div class="iteme"> 
             <ion-card class="x"  v-for="(data,index2) in R.Foods" :key="index2" mode="ios" :disabled="data.active">
                <img :src="data.Foodphoto" />
                <ion-card-content>
                
               
                    <ion-label>Livraison gratuite</ion-label>
                    <ion-label class="prix">
                        <h6>{{data.FoodName}}</h6>
                        <h6>{{data.FoodPrice.toLocaleString('en-US')}} GNF</h6>
                         <h5>{{data.type}}</h5>
                    </ion-label>
             <ion-chip color="primary" mode="ios" class="chipForAjDim"  >
                 <ion-icon :icon="addCircle" color="primary" @click="add(data.idFood,data.FoodPrice,data.FoodName,R.NomResto,R.id,data.type,R.numero)"></ion-icon>
                <ion-label>{{indexElement==data.idFood ? compteur[data.idFood]:nomCompteur[data.idFood]}}</ion-label>
                 <ion-icon :icon="removeCircle" color="primary" @click="diminuer(data.idFood,data.FoodPrice,data.FoodName,R.NomResto,R.id,data.type,R.numero)"></ion-icon>
            </ion-chip>
                 </ion-card-content>
             </ion-card>
             </div>
        </div>
              
      </div>
           
             <div class="noneInResto" v-if="enCasRestoIndis">
         <h1>PAS DE RESTO DISPONIBLE DANS VOTRE VILLE POUR LE MOMENT</h1>
       </div>   
          
      
        

    <div align="center" v-if="error==true" >
         <ion-img :src="require('../images/erreurImage.png')"></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

      </ion-content>
       <ion-footer v-if="SuccesPage">
    <ion-toolbar >
      <ion-text  slot="start">
          <h5>SommeTotal: <span class="SommeTotal">{{SommeTotal.toLocaleString('en-US')}} </span> GNF</h5>
      </ion-text>
      <ion-button v-on:click="OpenPop()" :disabled="ButonAchat" slot="end">
          Achete
      </ion-button>
    </ion-toolbar>
  </ion-footer>
  </ion-page>
</template>

<script>

import { defineComponent, vShow } from 'vue';
import LogoName from '@/components/LgoName.vue'
import InitAchatInresto from '@/components/InitAchatInresto.vue'
import GarNiture from '@/components/GarNiture.vue'
import{IonPage,IonContent,IonHeader,IonToolbar,IonMenuButton,IonButtons,IonIcon,IonChip,IonLabel,IonButton,loadingController,IonFooter,IonCard,IonCardContent,IonThumbnail,IonImg,IonText,popoverController,alertController,IonSegment,IonSegmentButton,modalController,}from'@ionic/vue'
import { restaurant,addCircle,removeCircle,squareOutline, alert,} from 'ionicons/icons';
import { collection,getDocs,getFirestore,doc,getDoc, query, where} from "firebase/firestore"
import app from '@/firebase';
import store from '@/VerifyUserStore';
import { Geolocation } from '@capacitor/geolocation';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import router from '@/router';
export default defineComponent({
name:"RestoFood",
components:{
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonMenuButton,
    LogoName,
    IonButtons,
    IonIcon,
    IonLabel,
    IonFooter,
    IonButton,
    IonThumbnail,
    IonChip,
    IonImg,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardContent
},
data(){
    return{
        //icon
        popoverController,
        restaurant,
        addCircle,
        removeCircle,
        loadingController,
        squareOutline,
        alertController,
        //data
        AllRestoData:[],
        TakeFoodSelected:[],
        SommeTotalPerResto:[],
        SendFoodSelectedData:[],
        recherche:"",
        SommeTotal:0,
        iFiltre:0,
        filtreData:[],
        Allresto:[],//pour le filtarge en cas de click sur le tout
        //les watch au niveau des filtre
        UserTown:"",
        segmentValue:'All',
        //v-if
        error:false,
        SuccesPage:false,
        enCasRestoIndis:false,
        butonAchatUnique:false,
        onlyResto:true,
        addPrice:{},
        typePush:[],
        //compteur
        compteur:[],
        nomCompteur:[],
        indexElement:new Number,
        //variable pour icon
        icon:"squareOutline",
        indexForIcon:[],
        EndPoint:{},
        UserInfo:{},
        test:false,
        GarnitureName:[],
        Food:[]
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
computed:{
    //en cas de recherche 
    search(){
        if(this.recherche && this.segmentValue=='All'){
          return  this.filtreData.filter(item=>{
                return this.recherche
                .toLowerCase()
                .split("")
                .every(v=>item.NomResto.toLowerCase().includes(v))
            })
        }
        else{
            return this.filtreData
        }
          
    },
    //en cas ou la sommeTotal = 0 pour la desactivation du button Achat
    ButonAchat(){
        if(this.SommeTotal==0){
            return true
        } else{
            return false
        }
    }
},
async beforeCreate(){
    this.SuccesPage=false
    this.error=false
   const attendre = await loadingController.create({
        message:"patientez s'il vous plait"
    })
    attendre.present()
    let v1 =""
   store.get('t').then((value)=>{
       this.test=value
    })
  store.get('r').then((v)=>{
    v1=v
  })
  if(this.test==true){
    if(v1=='oui'){
     this.AllRestoData=[]
     setTimeout(()=>{
        this.enCasRestoIndis=true
     },3000)
    }else{
        const alert = await alertController.create({
            message:"Nous avons besion de votre service de localisation pour vous afficher uniquement les restaurants proches de vous ?",
            buttons:[{
                text:"Ok",
                cssClass:"primary",
                handler:()=>{
                    Geolocation.getCurrentPosition({enableHighAccuracy:true}).then((result)=>{
                         this.AllRestoData=[]
     setTimeout(()=>{
        this.enCasRestoIndis=true
        attendre.dismiss()
     },3000)
                    }).catch(()=>{
                        this.$router.back()
                        attendre.dismiss()
                    })
                }
            },{
                text:"Non",
                cssClass:"primary",
                handler:()=>{
                    this.$router.back()
                    attendre.dismiss()
                }
            }]
        })
        alert.present()
    }
 return
  }

    try {
        await store.get("UserTown").then((value)=>{
            this.UserTown=value
          })
        var compter=0
        const db = await getFirestore(app)
         const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
      const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   this.addPrice=Price
   const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
const refResto= query(collection(db,"RESTO"),where("Ville","==",this.UserTown))
//prendre les info user
const auth = getAuth(app)
await onAuthStateChanged(auth,async(user)=>{
    if(user){
        const refuser= doc(db,"USERS",user.uid)
        const u = await getDoc(refuser)
        if(u.exists()) this.UserInfo=u.data()
    }
})
//fin info user
let take = []
await getDocs(refResto).then(data=>{
    data.forEach((element)=>{
       take.push(element.data())
    })
})
take.forEach(element => {
    if(element.active==true){
         this.AllRestoData.push(element)
        this.filtreData.push(element)
        this.Allresto.push(element)
       
    }
});
   if(!this.AllRestoData[0]){
       this.enCasRestoIndis=true
       attendre.dismiss()
       return
   }
//ajouter no prix au restaurant

  this.filtreData.forEach(element => {
      this.Food.push(element.Foods)
         element.Foods.forEach(element => {
             if(element.type=="Garniture"){
              element.FoodPrice = element.FoodPrice+Price.Garniture
             } else if (element.type=="FastFood"){
                   element.FoodPrice = element.FoodPrice+Price.FastFood
             } else if (element.type=="Simple"){
                  element.FoodPrice = element.FoodPrice+Price.Simple
             } else if (element.type=='Glaces'){
                 element.FoodPrice = element.FoodPrice+Price.Glaces
             }else if (element.type=='Jus Simple'){
                 element.FoodPrice=element.FoodPrice+Price.JusSimple
             } else if (element.type=='Jus Naturel'){
                 element.FoodPrice=element.FoodPrice+Price.JusNaturel
             }
              compter=compter+1
         });
  });
//pour donner 0 par defaut dans les case a ajouter
 for(let index=0; index<=compter; index++){
     this.nomCompteur[index]=0
     this.TakeFoodSelected[index]={nom:"",RestoName:"",nombre:"",id:""}
     this.SommeTotalPerResto[index]={id:"",restoName:"",sommetotal:"",PayFood:[],WePay:0,ServerPayfood:[],numero:""}
 }
 
//controle affichage
if(this.AllRestoData.length!=0){
   this.SuccesPage=true
   this.error=false
    
}
//if only resto 
   if(this.$route.params.id!=='All'){
    this.AllRestoData = this.AllRestoData.filter(e=>e.id==`${this.$route.params.id}`)
      this.filtreData= this.filtreData.filter(e=>e.id==`${this.$route.params.id}`)
      this.onlyResto=false
   }
   this.filtreData=this.filtreData.reverse()
   
   attendre.dismiss()
    } catch (e) {
        this.SuccesPage=false
        this.error=true
        attendre.dismiss()
        console.log(e)
        
    }
},

methods:{
    //le restaurant le plus proche de vous 
   async segmentChanged(event){
       this.segmentValue=event.detail.value
       const attendre = await loadingController.create({message:"patienter s'il vous plait"})
      if(event.detail.value=="Proche"){
          this.filtreData=[]
          attendre.present()
         Geolocation.getCurrentPosition({enableHighAccuracy:true}).then((result)=>{
           this.AllRestoData.forEach(element => {
                var R = 6371;
            var dLat = this.deg2rad(element.Coord.lat-result.coords.latitude)
            var dLon = this.deg2rad(element.Coord.long-result.coords.longitude); 
            var a = 
         Math.sin(dLat/2) * Math.sin(dLat/2) +
         Math.cos(this.deg2rad(10.05531)) * Math.cos(this.deg2rad(-12.86569)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
         var d = R * c;
         d=d*1000
         d=d.toFixed()
         element.d=d
           });
           //controle des resto plusproche
           //fin resto
        this.filtreData=this.AllRestoData.sort((a,b)=>a.d-b.d)
        attendre.dismiss()
       }).catch(async()=>{
           this.segmentValue="All"
           attendre.dismiss()
           this.filtreData=this.AllRestoData
           const alert = await alertController.create({
               message:"assurez vous que vos services de localisation sont actives et revenir essayer",
               mode:"ios",
               buttons:[{
                   text:"ok"
               }]
           })
          alert.present()
       })
     }else if (event.detail.value=="All"){
         this.filtreData=this.AllRestoData
     }
    },
    deg2rad(deg) {
  return deg * (Math.PI/180)
},
    //fin restaurant le plus proche

    //open Popover
  async  OpenPop(){
      if(window.navigator.onLine==false){
          const alert = await alertController.create({message:"Veillez activer votre internet"})
           alert.present()
          
          return
      }
       
      this.SendFoodSelectedData=this.TakeFoodSelected.filter(e=>e.nom!="")
     
      this.SendFoodSelectedData.forEach(element => {
          let i = this.SommeTotalPerResto.findIndex(e=>e.id==element.id)
          this.SommeTotalPerResto[i].PayFood.push(JSON.stringify({nom:element.nom,nombre:element.nombre}))
          this.SommeTotalPerResto[i].ServerPayfood.push({nom:element.nom,nombre:element.nombre})
      });
    
     
   console.log(this.SommeTotalPerResto)

       const pop = await modalController.create({
           component:InitAchatInresto,
           componentProps:{content:this.SendFoodSelectedData,sommeTotat:this.SommeTotal,PerResto:this.SommeTotalPerResto,EndPoint:this.EndPoint,userInfo:this.UserInfo},
           backdropDismiss:false,
           cssClass:"PaymentModa1",
           animated:false
       })
       pop.present()
       pop.onDidDismiss().then(()=>{
         this.SommeTotalPerResto.forEach((element,index) => {
             element.PayFood=[]
             element.ServerPayfood=[]
         });
       })
    },
 async   TryAgain(){
       this.SuccesPage=false
    this.error=false
   const attendre = await loadingController.create({
        message:"patientez s'il vous plait"
    })
    attendre.present()
    try {
       await store.get("UserTown").then((value)=>{
            this.UserTown=value
          })
        var compter=0
        const db = await getFirestore(app)
         const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
      const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   this.addPrice=Price
   //les endpoint
   const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
   //fin endpoint
   const auth = getAuth(app)
await onAuthStateChanged(auth,async(user)=>{
    if(user){
        const refuser= doc(db,"USERS",user.uid)
        const u = await getDoc(refuser)
        if(u.exists()) this.UserInfo=u.data()
    }
})
const refResto= query(collection(db,"RESTO"),where("Ville","==",this.UserTown))
let take = []
await getDocs(refResto).then(data=>{
    data.forEach((element)=>{
       take.push(element.data())
    })
})
take.forEach(element => {
    if(element.active==true){
         this.AllRestoData.push(element)
        this.filtreData.push(element)
        this.Allresto.push(element)
       
    }
});
   if(!this.AllRestoData[0]){
       this.enCasRestoIndis=true
       attendre.dismiss()
       return
   }
//ajouter no prix au restaurant

  this.filtreData.forEach(element => {
         element.Foods.forEach(element => {
             if(element.type=="Garniture"){
              element.FoodPrice = element.FoodPrice+Price.Garniture
             } else if (element.type=="FastFood"){
                   element.FoodPrice = element.FoodPrice+Price.FastFood
             } else if (element.type=="Simple"){
                  element.FoodPrice = element.FoodPrice+Price.Simple
             } else if (element.type=='Glaces'){
                 element.FoodPrice = element.FoodPrice+Price.Glaces
             }else if (element.type=='Jus Simple'){
                 element.FoodPrice=element.FoodPrice+Price.JusSimple
             } else if (element.type=='Jus Naturel'){
                 element.FoodPrice=element.FoodPrice+Price.JusNaturel
             }
              compter=compter+1
         });
  });
//pour donner 0 par defaut dans les case a ajouter
 for(let index=0; index<=compter; index++){
     this.nomCompteur[index]=0
      this.TakeFoodSelected[index]={nom:"",RestoName:"",nombre:"",id:""}
      this.SommeTotalPerResto[index]={id:"",restoName:"",sommetotal:"",PayFood:[],WePay:0,ServerPayfood:[],numero:""}
 }
 
//controle affichage
if(this.AllRestoData.length!=0){
   this.SuccesPage=true
   this.error=false
    
}
//if only resto 
   if(this.$route.params.id!=='All'){
    this.AllRestoData = this.AllRestoData.filter(e=>e.id==`${this.$route.params.id}`)
      this.filtreData= this.filtreData.filter(e=>e.id==`${this.$route.params.id}`)
      this.onlyResto=false
   }
 this.filtreData=this.filtreData.reverse()
   attendre.dismiss()
    } catch (e) {
        this.SuccesPage=false
        this.error=true
        attendre.dismiss()
        
    }


    },
    //ajouter 
   async add(index,Prix,FoodName,NomResto,id,type,numero){
    
       this.indexElement=index
       if(this.compteur[index]) {
           this.compteur[index]=this.compteur[index]+1
           this.nomCompteur[index]=this.compteur[index]
           this.SommeTotal=this.SommeTotal+Prix
           
       }
       else {
          this.compteur[index]=1
          this.nomCompteur[index]=1
          this.SommeTotal=this.SommeTotal+Prix
       }
       let total=Prix
        
       if(type=='Garniture'){
           const i = this.filtreData.findIndex(e=>e.id==id)
           const pop = await popoverController.create({
               component:GarNiture,
               componentProps:{Garniture:this.filtreData[i].Garniture},
               backdropDismiss:false
           })
           pop.present()
           pop.onDidDismiss().then((data)=>{
            this.TakeFoodSelected[index]={nom:`${FoodName} Garniture: ${data.data.res}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
           })
          Prix=Prix-this.addPrice.Garniture
       } else if (type=='FastFood'){
           Prix=Prix-this.addPrice.FastFood
            this.TakeFoodSelected[index]={nom:`${FoodName}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
       } else if (type=='Simple'){
           Prix=Prix-this.addPrice.Simple
            this.TakeFoodSelected[index]={nom:`${FoodName}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
       } else if (type=="Jus Simple"){
           Prix=Prix-this.addPrice.JusSimple
            this.TakeFoodSelected[index]={nom:`${FoodName}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
       }else if (type=="Jus Naturel"){
           Prix=Prix-this.addPrice.JusNaturel
            this.TakeFoodSelected[index]={nom:`${FoodName}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
       }else if (type=="Glaces"){
           Prix=Prix-this.addPrice.Glaces
            this.TakeFoodSelected[index]={nom:`${FoodName}`,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
       }
      
   
    let i = this.SommeTotalPerResto.findIndex(e=>e.id==id)
    if(i==-1){
     this.SommeTotalPerResto[index]={id:id,restoName:NomResto,sommetotal:total,PayFood:[],WePay:Prix,numero:numero,ServerPayfood:[]}
     this.SommeTotalPerResto=this.SommeTotalPerResto.filter(e=>e.id!="")
    } else{
    this.SommeTotalPerResto[i].sommetotal=this.SommeTotalPerResto[i].sommetotal+total
    this.SommeTotalPerResto[i].WePay=this.SommeTotalPerResto[i].WePay+Prix
    }
    },
    //diminuer
    diminuer(index,prix,FoodName,NomResto,id,type){
        let total = prix
        if(this.compteur[index]){
            if(this.compteur[index]>0){
                    this.compteur[index]=this.compteur[index]-1
                     this.nomCompteur[index]=this.compteur[index]
                     this.SommeTotal=this.SommeTotal-prix
                this.TakeFoodSelected[index]={nom:FoodName,RestoName:NomResto,nombre:this.nomCompteur[index],id:id}
                 let i = this.SommeTotalPerResto.findIndex(e=>e.id==id)
       if(type=='Garniture'){
          prix=prix-this.addPrice.Garniture
       } else if (type=='FastFood'){
           prix=prix-this.addPrice.FastFood
       } else if (type=='Simple'){
           prix=prix-this.addPrice.Simple
       } else if (type=="Jus Simple"){
           prix=prix-this.addPrice.JusSimple
       }else if (type=="Jus Naturel"){
           prix=prix-this.addPrice.JusNaturel
       }else if (type=="Glaces"){
           prix=prix-this.addPrice.Glaces
       }
       this.SommeTotalPerResto[i].WePay=this.SommeTotalPerResto[i].WePay-prix
         this.SommeTotalPerResto[i].sommetotal=this.SommeTotalPerResto[i].sommetotal-total
             if(this.nomCompteur[index]==0){
                this.SommeTotalPerResto= this.SommeTotalPerResto.filter(e=>e.sommetotal!=0)
                  this.TakeFoodSelected = this.TakeFoodSelected.filter(e=>e.nombre!=0)

                 }
            }
        }
       
    },
    
   
}
})
</script>

<style scoped lang="scss">
div{
  ion-segment{
    --background: none;
    ion-segment-button{
        font-size: 1rem;
      border-width: 0;
      --padding-start: 7px !important ;
      --padding-bottom: 2px !important ;
      --padding-end: 7px !important ;
      --padding-top: 2px !important ;
       --background-checked:#03A61c ;
       --indicator-color :transparent !important;
       --color:#d1d1d1 ;
       --color-checked:#fff;
        font-weight: bold;
        border-radius: 22px;

    }
  }
}

.icon-resto-home{
    font-size: 28px;
}


.chipForAjDim ion-icon{
    font-size: 40px;
}
.erreur{
    text-align: center;
}
.SommeTotal{
    color: #03A61c;
}.prix{
    color: #898585;
}
.iteme {
  overflow: auto;
  white-space: nowrap;
}
.iteme .x{
  display: inline-block;
  margin: 4px;
  border-radius: 8px;
}
.iteme .x img{
    width:  150px;
    height:150px ;
    object-fit: fill;
}
.Filtre{
    background-color: #03A61c;
    color: white;
}
.ony_Conakry{
  text-align: center;
}
.noneInResto{
   display: block;
            position: absolute;
            background-position: center;
            text-align: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
               color: #898585;
}
</style>