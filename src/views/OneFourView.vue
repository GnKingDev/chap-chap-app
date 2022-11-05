<template>
<ion-page>
  <ion-header>
      <ion-toolbar>
        
          <ion-back-button default-href="/tabs/tab1" slot="start"></ion-back-button>
        
          <LogoName :town="Fourinfo.NomMagasin +' '+ Fourinfo.Ville " v-if=" showContent=='succes'" />
      </ion-toolbar>
           <ion-grid class="main-header" v-if=" showContent=='succes'">
      <div align="center" >
    <ion-avatar >
          <img :src="Fourinfo.Photo.link" />
      </ion-avatar>
      </div>
     
  </ion-grid>
  <ion-row class="row" v-if=" showContent=='succes'">
      <ion-col size="6">
          <ion-item lines="none" class="ion-text-center">
              <ion-label>
                  {{count}}
                  <p>Produits</p>
              </ion-label>
          </ion-item>
      </ion-col>
      <ion-col size="6">
          <ion-item lines="none" class="ion-text-center">
              <ion-label>
                  {{Fourinfo.AbonementUser.length}}
                  <p>Abonnes</p>
              </ion-label>
          </ion-item>
      </ion-col>
  </ion-row>
       <div align="center" class="LesBtn"  v-if=" showContent=='succes'" >
   <ion-button v-on:click="Abonnement(Fourinfo.id)" :disabled="btnAbon"  mode="ios">
        {{textAbon}}
      </ion-button>
 </div>
  </ion-header>
  <ion-content>
      <LoaderPage v-if="showContent=='load'" />
       <div class="for-all" v-if=" showContent=='succes'" >
      

        <div class="ion-text-center note">
        <ion-note>{{ PromoText}}</ion-note>
        </div>
       
     
     <ion-toolbar mode="ios">
         <ion-title>Ces produits</ion-title>
     </ion-toolbar>
         <div class="c2"  >
           <div class="g2" v-for="(data,index) in Fourproduct" :key="data.id"   >

               <ion-card @click="GetProductid(data.id)" :button="true" mode="ios">
                <img :src="data.LinkPhoto" />
                 <ion-card-content>
                <h6 >{{data.nomProd}} </h6>
                <h6 color="primary" > {{data.prix.toLocaleString('en-US')}} GNF</h6>
                 <div class="ForNew" v-if="New[index]==true">
                   <ion-chip class="active">
                     <ion-label>New</ion-label>
                   </ion-chip>
                </div>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>
     </div>

       <div v-if=" showContent=='erreur'" align="center" >
         <ion-img :src="require('../images/erreurImage.png')"  ></ion-img>
       <ion-button id="BtnErreur"  @click="trybefore()">
         Reessayer
       </ion-button>
     </div>
  </ion-content>
</ion-page>
</template>

<script>
import {defineComponent} from 'vue'
import LogoName from "@/components/LgoName.vue"
import LoaderPage from "@/components/LoaderPage.vue"
import SignalMessage from '@/components/SignalMessage.vue'
import {IonHeader,alertController,IonButton,IonImg,IonCard,IonCardContent,IonContent,IonToolbar,IonTitle,IonBackButton,IonAvatar,IonItem,IonLabel,toastController,IonChip,IonPage,IonCol,IonRow, modalController,loadingController,IonNote,IonGrid} from "@ionic/vue"
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, Timestamp, updateDoc, where } from '@firebase/firestore'
import app from '@/firebase'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import store from '@/VerifyUserStore'
export default defineComponent ({
name:"OneFourView",
components:{IonHeader,LogoName,LoaderPage,IonContent,IonToolbar,IonTitle,IonCard,IonCardContent,IonImg,IonButton,IonBackButton,IonAvatar,IonLabel,IonItem,IonChip,IonPage,IonCol,IonRow,IonGrid,IonNote},
data(){
    return{
        alertController,
        toastController,
        Fourproduct:[],
        Fourinfo:{},
        showContent:'load',
        textAbon:"s'abonner",
        UserNumberPhone:"",
        btnAbon:false,
        Userid:"",
        New:[],
        PromoText:"Pas de Promo pour cette boutique pour le moment",
        LinkPhoto:"",
        count:0,
        text:"",
    }
},
ionViewWillEnter(){
  store.get("t").then((value)=>{
    if(value==false){
      this.text="numero de telephone"
    }else{
      this.text="Email"
    }
  })
  
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
async beforeCreate(){
      try {
          this.showContent="load"
          const db = await getFirestore(app)
           const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
             var Price ={}
           const AlgoPrice = await getDoc(refAlgorthmePrix)
           if(AlgoPrice.exists()) Price=AlgoPrice.data()
          const refFour = await doc(db,"FOURNISSEURS",`${this.$route.params.id}`)
          const FourInfo = await getDoc(refFour)
          if(FourInfo.exists()) this.Fourinfo=FourInfo.data()
          //prendre tous les produits du fournisseurs
          const q = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",`${this.$route.params.id}`))
          const ProductFour = await getDocs(q)
          ProductFour.forEach((element)=>this.Fourproduct.push(element.data()))
          let timestamp=Timestamp.now()
           let dateNow = new Date(timestamp.seconds*1000)
           if(this.Fourinfo.promo){
              let promoDate = new Date(this.Fourinfo.promo.PromoCodeDate.seconds*1000)
              let timeDiff = dateNow.getTime()-promoDate.getTime()
           let  resultat = timeDiff/(1000*3600*24)
              if(resultat<=this.Fourinfo.promo.promoNday){
               
                this.PromoText=`Cette boutique est en promotion du ${promoDate.toLocaleDateString("fr-FR")} et expire dans ${this.Fourinfo.promo.promoNday} jours`

              }
            }
          //pour l'ajout des prix 
          this.Fourproduct.forEach((element,index) => {
              //verification si le produit est nouvelle
              let ProductDate = new Date(element.Cree.seconds*1000)
              let TimeDff = dateNow.getTime()-ProductDate.getTime()
              let resultat = TimeDff/(1000 * 3600 * 24)
              if(resultat<=30){
               this.New[index]=true
              }
             //fin verification         
                 element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
              this.count++
          });
          //contorole abonnement 
          const auth = await getAuth(app)
          await onAuthStateChanged(auth,async(user)=>{
            if(user){
              const refUserAbon = await doc(db,"USERS",`${user.uid}`)
              const UserInfo = await getDoc(refUserAbon)
              let take
              if(UserInfo.exists()){
                take=UserInfo.data()
              let verify= this.Fourinfo.AbonementUser.includes(take.UserNumberPhone)
              this.UserNumberPhone=take.UserNumberPhone
              this.Userid=user.uid
              if(verify==true){
                if(take.abonement.includes(this.Fourinfo.id)==false){
                  await updateDoc(refUserAbon,{
                    abonement:arrayUnion(this.Fourinfo.id)
                  })
                }
                this.textAbon="se desabonne"
              }
              }
            }
          })
          //fin controle abonnemnt
          this.showContent='succes'
      } catch (error) {
          this.myalert("erreur reessayer")
          this.showContent="erreur"
          console.log(error.message)
      }
},
methods:{
  async  trybefore(){
    if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer internet"})
      alert.present()
      return
    }
      try {
          this.showContent="load"
          const db = await getFirestore(app)
           const refAlgorthmePrix= await doc(db,"APPINFO","AlgorithmeDEPrix")
             var Price ={}
           const AlgoPrice = await getDoc(refAlgorthmePrix)
           if(AlgoPrice.exists()) Price=AlgoPrice.data()
          const refFour = await doc(db,"FOURNISSEURS",`${this.$route.params.id}`)
          const FourInfo = await getDoc(refFour)
          if(FourInfo.exists()) this.Fourinfo=FourInfo.data()
          this.LinkPhoto=this.Fourinfo.Photo.link
          //prendre tous les produits du fournisseurs
          const q = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",`${this.$route.params.id}`))
          const ProductFour = await getDocs(q)
          ProductFour.forEach((element)=>this.Fourproduct.push(element.data()))
          let timestamp=Timestamp.now()
           let dateNow = new Date(timestamp.seconds*1000)
           if(this.Fourinfo.promo){
              let promoDate = new Date(this.Fourinfo.promo.PromoCodeDate.seconds*1000)
              let timeDiff = dateNow.getTime()-promoDate.getTime()
           let  resultat = timeDiff/(1000*3600*24)
              if(resultat<=this.Fourinfo.promo.promoNday){
               
                this.PromoText=`Cette boutique est en promotion du ${promoDate.toLocaleDateString("fr-FR")} et expire dans ${this.Fourinfo.promo.promoNday} jours`

              }
            }
          //pour l'ajout des prix 
          this.Fourproduct.forEach((element,index) => {
              //verification si le produit est nouvelle
              let ProductDate = new Date(element.Cree.seconds*1000)
              let TimeDff = dateNow.getTime()-ProductDate.getTime()
              let resultat = TimeDff/(1000 * 3600 * 24)
              if(resultat<=30){
               this.New[index]=true
              }
             //fin verification         
                 element.prix=parseInt(element.prix)
       let r = element.prix*2/100
       if(r<1000){
         element.prix=element.prix+r+Price.a
       } else if (r>=1000 && r<10000){
         element.prix=element.prix+r+Price.b
       } else if (r>=10000){
         element.prix=element.prix+r+Price.c
       }
              this.count++
          });
          //contorole abonnement 
          const auth = await getAuth(app)
          await onAuthStateChanged(auth,async(user)=>{
            if(user){
              const refUserAbon = await doc(db,"USERS",`${user.uid}`)
              const UserInfo = await getDoc(refUserAbon)
              let take
              if(UserInfo.exists()){
                take=UserInfo.data()
              let verify= this.Fourinfo.AbonementUser.includes(take.UserNumberPhone)
              
              this.UserNumberPhone=take.UserNumberPhone
              this.Userid=user.uid
              if(verify==true){
                if(take.abonement.includes(this.Fourinfo.id)==false){
                  await updateDoc(refUserAbon,{
                    abonement:arrayUnion(this.Fourinfo.id)
                  })
                }
                this.textAbon="se desabonne"
              }
              }
            }
          })
          //fin controle abonnemnt
          this.showContent='succes'
      } catch (error) {
          this.myalert("erreur reessayer")
          this.showContent="erreur"

      }
    },
     async myalert(text){
       const alert = await alertController.create({message:`${text}`})
       alert.present()
       setTimeout(()=>alert.dismiss(),2000)
    },
  async  GetProductid(id){
       if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer internet"})
      alert.present()
      return
    }
      this.$router.push({name:'ProductDetailPage',params:{id:id,prix:"none"}})
    },
   async Abonnement(id){
      if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"Veillez activer internet"})
      alert.present()
      return
    }
     if(!id   ||this.Userid=="" ||this.UserNumberPhone==""){
       return
     }
        try {
          this.btnAbon=true
        if(this.textAbon=="s'abonner"){
         const alert = await alertController.create({
           header:`Voulez vous abonner à ${this.Fourinfo.NomMagasin} ?`,
           subHeader:`Vous allez recevoir des messages sur votre ${this.text} concernant les activites de ${this.Fourinfo.NomMagasin} exemple: en cas de reduction sur le prix de ses produits `,
           mode:"ios",
           backdropDismiss:false,
           buttons:[{
             text:"oui m'abonne",
             cssClass:"primary",
             handler:async()=>{
              this.btnAbon=true
              const db = await getFirestore(app)
              const refUser = await doc(db,"USERS",`${this.Userid}`)
              const refFour = await doc(db,"FOURNISSEURS",`${id}`)
              //mise en jour utilisateur
              await updateDoc(refUser,{
                abonement:arrayUnion(id)
              })
              //mise en jour fournisseurs
              await updateDoc(refFour,{
                AbonementUser:arrayUnion(this.UserNumberPhone)
              }).then(async()=>{
                const toast = await toastController.create({message:"abonne avec succes",duration:2000})
                this.textAbon='se desabonne'
                this.btnAbon=false
                toast.present()
                
              })
             }
           },{
             text:"annule",
             cssClass:"primary",
             handler:()=>{
               this.btnAbon=false
               return
             }
           }]

         })
         alert.present()
         
        } else if (this.textAbon=='se desabonne'){
            const alert = await alertController.create({
           header:`Voulez vous  desabonne à ${this.Fourinfo.NomMagasin} ?`,
           subHeader:`Vous allez plus recevoir des messages sur votre ${this.text} concernant les activites de ${this.Fourinfo.NomMagasin} exemple: en cas de reduction sur le prix de ses produits `,
           mode:"ios",
           backdropDismiss:false,
           buttons:[{
             text:"me desabonne",
             cssClass:"primary",
             handler:async()=>{
              this.btnAbon=true
              const db = await getFirestore(app)
              const refUser = await doc(db,"USERS",`${this.Userid}`)
              const refFour = await doc(db,"FOURNISSEURS",`${id}`)
              //mise en jour utilisateur
              await updateDoc(refUser,{
                abonement:arrayRemove(id)
              })
              //mise en jour fournisseurs
              await updateDoc(refFour,{
                AbonementUser:arrayRemove(this.UserNumberPhone)
              }).then(async()=>{
                const toast = await toastController.create({message:"desabonne avec succes",duration:2000})
                this.textAbon="s'abonner"
                this.btnAbon=false
                toast.present()
                
              })
             }
           },{
             text:"annule",
             cssClass:"primary",
             handler:()=>{
               this.btnAbon=false
              return
             }
           }]

         })
         alert.present()
        }
        } catch (error) {
          const toast = await toastController.create({message:"erreur reessayer",duration:2000})
          toast.present()
        }
    },


}
})
</script>

<style scoped lang="scss" >
.LesBtn{
  ion-button{
    margin: 6px;
  }
}
.note1{
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
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
.note{
  padding: 15px;
  background: #eee;
  margin: 10px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
}

.c2{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}
.g2{
  width: 50%;
  height: 50%;
}
.g2 ion-card img {
    width: 180px;
  height: 180px;
  object-fit: fill;
}

.erreur{
  text-align: center;
}
.Centrer ion-chip{
    margin: auto;
}
.Centrer ion-label{
    text-align: center;
}
.item-avatar  {     
width:30% !important;  
height : 30% !important;  
 
}
.Centrer ion-label ion-button{
    
}
#BtnErreur{
  text-align: center;
}
.active{
  background-color: #03A61c;
  color: white;
}
.PromoText{
   background-color: #03A61c;
  color: white;
  text-align: center;
  margin: 6px;
}

</style>