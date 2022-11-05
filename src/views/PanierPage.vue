<template>
  <ion-page>
      <ion-header>
          <ion-toolbar mode="ios">
              <ion-buttons slot="start">
                  <ion-menu-button menu="Menu"></ion-menu-button>
              </ion-buttons>
              <LogoName town="chap chap"/>
              <ion-icon slot="end"  :icon="cart" color="primary" class="headIcon"></ion-icon>
          </ion-toolbar>
      </ion-header>
    <ion-content>
         <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)" pullFactor="0.8" pullMin="60" pullMax="120" v-if="refresh">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
         <LoaderPage v-if="loader" />

         <h1 class="title" v-if="succesPage">Panier</h1>
   <div class="cart-items" v-if="succesPage" >
      

          <ion-card mode="ios" v-for="(panier,index) in PanierShow" :key="index" >
      <ion-card-content>
        <div class="item-img">
          <img :src="panier.LinkPhoto" alt="PanierImg">
        </div>
        <div class="item-info">
          <p>{{panier.nomProd}}</p>
          <p v-for="(i,index2) in taille" :key="index2" class="color"> {{index==index2 ? 'taille '+i:''}} </p>
              <p>{{panier.prix.toLocaleString('en-US')}} GNF</p>
              <p>{{panier.ville}}</p>
          <div class="qty-selector">
            <ion-button v-on:click="Ajouter(index,panier.prix,panier.nomProd,panier.couleur,panier.ville,panier.IdFournisseur,panier.RealPrice,panier.NumeroPhoneOrange)" fill="clear">
              +
            </ion-button>
            <ion-label> {{ indexElement==index ? allIndex[index]:NomCompteur[index] }} </ion-label>
            <ion-button v-on:click="Diminuer(index,panier.prix,panier.nomProd,panier.couleur,panier.ville,panier.IdFournisseur,panier.RealPrice,panier.NumeroPhoneOrange)" fill="clear">
              -
            </ion-button>
            <ion-icon :icon="trash" color="danger" class="icondanger" @click="suppOnepanier(index,panier.id)" ></ion-icon>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
        
        


    
  </div>
 
<div class="noneInPanier" v-if="enCasPanierVide">
    <h1>RIEN DE LE PANIER</h1>
</div>

   <div   v-if=" error" align="center">
         <ion-img :src="require('../images/erreurImage.png')"></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

    </ion-content>

     <ion-footer v-if="succesPage">
    <ion-toolbar>
      <ion-text  slot="start">
          <h5>SommeTotal: <span class="SommeTotal">{{sommeTotat.toLocaleString('en-US')}} </span> GNF</h5>
      </ion-text>
      <ion-button v-on:click="OpenPopOver()" :disabled="ButonAchat" slot="end">
          Achete
      </ion-button>
    </ion-toolbar>
  </ion-footer>

  </ion-page>
</template>

<script >
import { defineComponent } from 'vue';
import { IonPage,  IonToolbar,  IonContent,IonHeader,IonImg,loadingController,IonIcon,toastController,IonFooter,alertController,IonRefresher,IonRefresherContent, popoverController,IonText,IonButtons,IonMenuButton,IonLabel,IonButton,IonCard,IonCardContent, modalController,} from '@ionic/vue';
import{addCircle,removeCircle,trash,cart}from 'ionicons/icons'
import { doc, getDoc,getFirestore,updateDoc, } from "firebase/firestore";
import app from '@/firebase';
import LogoName from '@/components/LgoName.vue'
import initAchatInPanier from '@/components/initAchatInPanier.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoaderPage from "@/components/LoaderPage.vue"

export default defineComponent({
  name: 'PanierPaeg',
  components: {    
   IonContent, 
   IonPage,
   IonToolbar,
   IonHeader,
   IonImg,
   IonText,
   LogoName,
   IonFooter,
   LoaderPage,
   IonButtons,
   IonMenuButton,
   IonLabel,
   IonButton,
   IonRefresher,
   IonRefresherContent,
   IonCard,
   IonCardContent,
   IonIcon
   
   },
   data(){
     return{
         //icon
         popoverController,
         loadingController,
         alertController,
         addCircle,
         removeCircle,
         trash,
         toastController,
         cart,
       //segmentAutoSelect
       SelectAuto:"Shop",
       //data
       UserData:{},
       PanierShow:[],
       taille:[],
       //v if
       error:false,
       succesPage:false,
       enCasPanierVide:false,
       loader:true,
       refresh:true,
       //compteur du nombre de produit
       compteur:0,
       sommeTotat:0,
       indexElement:undefined,
       NomCompteur:[],
       allIndex:[],
       takeIndex:[],
       //user id
       IdUser:undefined,
       //les variable pour init achat
       InitAchat:[],
       SommeTotalPerFour:[],
       EndPoint:{},
     }
   },
   
   computed:{
      ButonAchat(){
          if(this.sommeTotat==0){
              return true
          } else{
              return false

          }
      }
   },
 async beforeCreate(){
      try {
         this.refresh=true
     this.error=false
     this.succesPage=false
     this.loader=true
     this.SelectAuto=`${this.$route.params.SR}`
      const db= await getFirestore(app)
      const auth = await getAuth(app)
        ///gestion du prix a ajouter
       const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   //fin prix a ajouter
    const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
      let user
   await onAuthStateChanged(auth,(ui)=>user=ui.uid)
   const refUser= await doc(db,"USERS",`${user}`)
   //prendre les favoris de l'utilisateur
   const dataUser = await getDoc(refUser)
   if(dataUser.exists()){
       this.UserData=dataUser.data()
       //parcour des favoris de l'utilisateurs
       let compter = 0
       if(this.UserData.Panier[0]){
      this.UserData.Panier.forEach(async element => {
         compter=compter+1
        const refPanier= await doc(db,"PRODUITS",`${element.id}`)
      const panier =   await getDoc(refPanier)
          if(panier.exists()){
               this.PanierShow.push(panier.data())
                          this.taille.push(element.taille)
                          this.succesPage=true
                          this.loader=false
                          this.error=false
                          this.enCasPanierVide=false
                          this.refresh=true
                      
                      
              this.PanierShow.forEach(element => {
                if(!element.passed){
                  element.prix=parseInt(element.prix)
                 let r = element.prix*2/100
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

       


      
        for(let index=0; index<=compter; index++){
              this.NomCompteur[index]=0
            this.InitAchat[index]={nom:"",couleur:"",index:"",taille:"",nombre:"",ville:""}
            this.SommeTotalPerFour[index]={nomProd:"",idF:"",sommetotal:"",payprod:[] }
          }
      
     
   } else{
       this.enCasPanierVide=true
       this.loader=false
   }
      //valeur par defaut dans ionchip nombre de ce produit
      
      //fin valeur par defaut
   }

      } catch (e) {
          
          this.enCasPanierVide=false
          this.error=true
          this.succesPage=false
          this.loader=false
          this.refresh=false
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
   
   methods:{
       //ouverture du pop over  pour l'achat
     async  OpenPopOver(){
       let real=[]
       this.InitAchat=this.InitAchat.filter(e=>e.nom!="")
       this.InitAchat.forEach(element => {
         let i = this.SommeTotalPerFour.findIndex(e=>e.idF==element.idF)
         this.SommeTotalPerFour[i].payprod.push(JSON.stringify({nom:element.nom,couleur:element.couleur,taille:element.taille,nombre:element.nombre}))
         this.SommeTotalPerFour[i].ServerPay.push({nom:element.nom,couleur:element.couleur,taille:element.taille,nombre:element.nombre})
       });
       
       console.log(this.SommeTotalPerFour)
        const popForAchat = await modalController.create({
          component:initAchatInPanier,
            componentProps:{content:this.InitAchat,SommeTotal:this.sommeTotat,userInfo:this.UserData,EndPoint:this.EndPoint,PerFour:this.SommeTotalPerFour},
            backdropDismiss:false,
            cssClass:"PaymentModa1",
        })
        console.log(this.SommeTotalPerFour)
       
        popForAchat.present()
        popForAchat.onDidDismiss().then(()=>{
          this.SommeTotalPerFour.forEach((element,index) => {
            element.payprod=[]
            element.ServerPay=[]
          });
          console.log('richard')
        })
       },
       //reeassayer si erreur
     async   TryAgain(){
       if(window.navigator.onLine==false){
         const alert = await alertController.create({message:"Veillez activer votre internet"})
         alert.present()
         return
       }
       try {
         this.refresh=true
     this.error=false
     this.succesPage=false
     this.loader=true
     this.SelectAuto=`${this.$route.params.SR}`
      const db= await getFirestore(app)
      const auth = await getAuth(app)
        ///gestion du prix a ajouter
       const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   //fin prix a ajouter
    const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
      let user
   await onAuthStateChanged(auth,(ui)=>user=ui.uid)
   const refUser= await doc(db,"USERS",`${user}`)
   //prendre les favoris de l'utilisateur
   const dataUser = await getDoc(refUser)
   if(dataUser.exists()){
       this.UserData=dataUser.data()
       //parcour des favoris de l'utilisateurs
       let compter = 0
       if(this.UserData.Panier[0]){
      this.UserData.Panier.forEach(async element => {
         compter=compter+1
        const refPanier= await doc(db,"PRODUITS",`${element.id}`)
      const panier =   await getDoc(refPanier)
          if(panier.exists()){
               this.PanierShow.push(panier.data())
                          this.taille.push(element.taille)
                          this.succesPage=true
                          this.loader=false
                          this.error=false
                          this.enCasPanierVide=false
                          this.refresh=true
                      
                      
              this.PanierShow.forEach(element => {
                if(!element.passed){
                  element.prix=parseInt(element.prix)
       let r = element.prix*2/100
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

       


      
        for(let index=0; index<=compter; index++){
              this.NomCompteur[index]=0
            this.InitAchat[index]={nom:"",couleur:"",index:"",taille:"",nombre:"",ville:""}
            this.SommeTotalPerFour[index]={nomProd:"",idF:"",sommetotal:"",payprod:[] }
          }
      
     
   } else{
       this.enCasPanierVide=true
       this.loader=false
   }
      //valeur par defaut dans ionchip nombre de ce produit
      
      //fin valeur par defaut
   }

      } catch (e) {
          
          this.enCasPanierVide=false
          this.error=true
          this.succesPage=false
          this.loader=false
          this.refresh=false
      }
      
     
     
          
     },
     //ajout du nombre  de ce produit
     Ajouter(index,prix,nom,couleur,ville,id,RealPrice,numero){
         let i =0
       if(this.allIndex[index]){
          this.allIndex[index]=this.allIndex[index]+1
          this.NomCompteur[index]=this.allIndex[index]
         
       }
       if(!(this.allIndex[index])){
           i=i+1
           this.allIndex[index]=i
           this.NomCompteur[index]=this.allIndex[index]
       }
       this.sommeTotat=this.sommeTotat+prix
       //ajout de la taille 
       let take = this.taille[index]
     this.InitAchat[index]={nom:nom,couleur:couleur,index:index,taille:take,nombre:this.NomCompteur[index],ville:ville,idF:id,}
     let i1 = this.SommeTotalPerFour.findIndex(e=>e.idF==id)
     if(i1==-1){
       this.SommeTotalPerFour[index]={idF:id,payprod:[],sommetotal:prix,wePay:RealPrice,numero:numero,ServerPay:[]}
       this.SommeTotalPerFour=this.SommeTotalPerFour.filter(e=>e.idF!="")
     } else {
       this.SommeTotalPerFour[i1].sommetotal=this.SommeTotalPerFour[i1].sommetotal+prix
       this.SommeTotalPerFour[i1].wePay=this.SommeTotalPerFour[i1].wePay+RealPrice

     }
  
     },
     //dimunition du nombre de ce produit
     Diminuer(index,prix,nom,couleur,ville,id,RealPrice,){
        if(this.allIndex[index]){
             let take = this.taille[index]
            if(this.allIndex[index]>0){
            this.allIndex[index]=this.allIndex[index]-1
            this.NomCompteur[index]=this.allIndex[index]
            this.InitAchat[index]={nom:nom,couleur:couleur,index:index,taille:take,nombre:this.NomCompteur[index],ville:ville}
              let i = this.SommeTotalPerFour.findIndex(e=>e.idF==id)
              this.SommeTotalPerFour[i].sommetotal=this.SommeTotalPerFour[i].sommetotal-prix
              this.SommeTotalPerFour[i].wePay=this.SommeTotalPerFour[i].wePay-RealPrice
              if(this.NomCompteur[index]==0){
                this.SommeTotalPerFour=this.SommeTotalPerFour.filter(e=>e.sommetotal!=0)
                 this.InitAchat= this.InitAchat.filter(e=>e.nombre!=0)
              }
            
            }
            
        }
        //gestion prix deu panier
        if(this.sommeTotat){
            if(this.sommeTotat>0){
                this.sommeTotat=this.sommeTotat-prix
            }
        }
     },
     //suprression dans les panier
   async  suppOnepanier(index,id){
      if(window.navigator.onLine==false){
         const alert = await alertController.create({message:"Veillez activer votre internet"})
         alert.present()
         return
       }
       try {
           const alert1 = await toastController.create({
             message:"element supprimer avec succes",
             duration:1000
         })
         this.PanierShow.splice(index,1)
         let TakeNewPanier=this.UserData.Panier.filter(p=>p.id!=id)
        const db = await getFirestore(app)
        const auth = await getAuth(app)
        let user
       await onAuthStateChanged(auth,(ui)=>user=ui.uid)
            const refUser =await doc(db,"USERS",`${user}`)
             await updateDoc(refUser,{
                 Panier:TakeNewPanier
             }).then(()=>{
                alert1.present()
             })
       } catch (error) {
            const alert1 = await toastController.create({
             message:"element non supprimer ",
             duration:1000
         })
         alert1.present()
       }
          
     },
     
    async doRefresh(event){
       if(window.navigator.onLine==false){
         const alert = await alertController.create({message:"Veillez activer votre internet"})
         alert.present()
         return
       }
     try {
       this.PanierShow=[]
       this.taille=[]
       this.allIndex=[]
       this.NomCompteur=[]
       this.takeIndex=[]
       this.sommeTotat=0
       this.InitAchat=[]
       this.SommeTotalPerFour=[]
         this.refresh=true
     this.error=false
     this.succesPage=false
     this.loader=true
     this.SelectAuto=`${this.$route.params.SR}`
      const db= await getFirestore(app)
      const auth = await getAuth(app)
        ///gestion du prix a ajouter
       const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
         var Price ={}
   const AlgoPrice = await getDoc(refAlgorthmePrix)
   if(AlgoPrice.exists()) Price=AlgoPrice.data()
   //fin prix a ajouter
    const refRootPho = await doc(db,"ALLAUTHORISED","Root")
    const t = await getDoc(refRootPho)
    if(t.exists()){
      let take = t.data()
      this.EndPoint=take
    }
      let user
   await onAuthStateChanged(auth,(ui)=>user=ui.uid)
   const refUser= await doc(db,"USERS",`${user}`)
   //prendre les favoris de l'utilisateur
   const dataUser = await getDoc(refUser)
   if(dataUser.exists()){
       this.UserData=dataUser.data()
       //parcour des favoris de l'utilisateurs
       let compter = 0
       if(this.UserData.Panier[0]){
      this.UserData.Panier.forEach(async element => {
         compter=compter+1
        const refPanier= await doc(db,"PRODUITS",`${element.id}`)
      const panier =   await getDoc(refPanier)
          if(panier.exists()){
               this.PanierShow.push(panier.data())
                          this.taille.push(element.taille)
                          this.succesPage=true
                          this.loader=false
                          this.error=false
                          this.enCasPanierVide=false
                           event.target.complete();
                          this.refresh=true
                      
                      
              this.PanierShow.forEach(element => {
                if(!element.passed){
                  element.prix=parseInt(element.prix)
       let r = element.prix*2/100
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

       


      
        for(let index=0; index<=compter; index++){
              this.NomCompteur[index]=0
            this.InitAchat[index]={nom:"",couleur:"",index:"",taille:"",nombre:"",ville:""}
            this.SommeTotalPerFour[index]={nomProd:"",idF:"",sommetotal:"",payprod:[] }
          }
      
     
   } else{
       this.enCasPanierVide=true
       this.loader=false
        event.target.complete();
   }
      //valeur par defaut dans ionchip nombre de ce produit
      
      //fin valeur par defaut
   }

      } catch (e) {
          
          this.enCasPanierVide=false
          this.error=true
          this.succesPage=false
          this.loader=false
           event.target.complete();
          this.refresh=false
      }
      
     }
    
     
   }
});

</script>
<style  scoped lang="scss">
ion-content{
  --padding-top:16px;
  --padding-bottom:16px;
  --padding-start:26px;
  --padding-end:26px;
}
.title{
  margin-top: 0;
  color: #434343;
}
.cart-items{
  ion-card{
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
    ion-card-content{
      display: flex;
      position: relative;

      .item-img{
        display: flex;
        align-items: center;
        margin-right: 16px;
        img{
         object-fit: cover;
         width: 110px;
         height: 110px;
         box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.16)
        }
      }
      .item-info{
        p{
          font-size: 16px;
        }
        p:nth-child(1){
          color: #434343;
        }
        p:nth-child(2){
          color: #919191;
        }
        
        .qty-selector{
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f6f6f6;
          border-radius: 5px;
          margin-top: 10px;
          ion-button{
            --color:#565656;
            font-size: 16px;
            margin-left: 8px;
            margin-right: 8px;
            font-size: 20px;
          }
          ion-label{
            color: #565656 !important;
            font-size: 16px;
          }
        }
      }
    }
  }
}
.headIcon{
  font-size: 40px;
}
.noneInPanier{
    text-align: center;
    padding-top: 60%;
}
.noneInPanier h1{
    color: #ddd;
}

.color{
    color: #898585;
}
.prix{
    text-align: center;
}
.SommeTotal{
    color: #03A61c;
}
.icondanger{
  font-size: 30px;
}
</style>