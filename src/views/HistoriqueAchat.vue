<template>
  <ion-page>
      <ion-header class="ion-no-border">
       <ion-toolbar>
              <ion-back-button slot="start" default-href="/tabs/tab1"></ion-back-button>
              <MenuName :title="nom" />
       </ion-toolbar>
      </ion-header>
    <ion-content>
      <LoaderPage v-if="loader" />
      <div v-if="succesPage">
              <ion-item v-for="historique in Data"  :key="historique.date">
         
          <ion-thumbnail slot="start" v-if="historique.type=='produit' || historique.type=='produit' ">
            <img :src="historique.LinkPhoto"  />
          </ion-thumbnail>
         
           <ion-label class="ion-text-wrap">
             <h3>ref Achat: <span> {{historique.idAchat}} </span> </h3>
               <h3> Produit Achete: <span>{{historique.nomProd}}</span></h3>
                <h3>Prix: <span>{{historique.prix.toLocaleString('en-US')}} GNF</span></h3>
                <h3>Date Achat: <span> {{historique.date}} </span> </h3>
                  <h3 v-if="historique.type=='produit'">Numero Fournisseur: <span>{{historique.numero}}</span> </h3>
                  <h3 v-if="historique.type=='produit'">Ville du produit: <span>{{historique.ville}} </span> </h3>
                   <h3 v-if="historique.type=='produit'">nombre: <span>{{historique.nombre}} </span> </h3>
                   <h3 v-if="historique.type=='produit'">taille: <span>{{historique.taille}} </span> </h3>
                   <h3 v-if="historique.type=='produit'">couleur: <span>{{historique.couleur}} </span> </h3>
           </ion-label>
           </ion-item>
      </div>
      
       
   <div class="PasAchat" v-if="PasAchat">
       <h2>Vous n'avez pas effectue d'achat pour le moment</h2>
   </div>

     <div   v-if=" error" align="center">
         <ion-img :src="require('../images/erreurImage.png')" ></ion-img>
       <ion-button  @click="TryAgain()">
         Reessayer
       </ion-button>
     </div>

    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, } from 'vue';
import { IonContent, IonHeader, IonPage , IonToolbar,IonImg ,IonButton,IonBackButton,IonItem,alertController,loadingController,IonLabel,IonThumbnail} from '@ionic/vue';
import app from'@/firebase'
import{getFirestore,getDoc,doc, onSnapshot} from "firebase/firestore"
import MenuName from '@/components/MenuName.vue'
import LoaderPage from '@/components/LoaderPage.vue'
import { getAuth,onAuthStateChanged } from '@firebase/auth';
export default defineComponent({
  name:"HistoriqueAchat",
  components:{
      IonPage,
      IonContent,
      IonHeader,
      IonToolbar,
      IonBackButton,
      MenuName,
      LoaderPage,
      IonImg,
      IonButton,
      IonItem,
      IonLabel,
      IonThumbnail
  }, 
  data(){
        return{
          //ionic
          loadingController,
          Data:[],
          nom:"Historique Achat",
          loader:true,
          userUId:"",
          //v-if
          succesPage:false,
          error:false,
          PasAchat:false

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
     const db = await getFirestore(app)
     const auth = await getAuth(app)
     await onAuthStateChanged(auth,async(user)=>{
      const refUser = await doc(db,"USERS",user.uid)
      onSnapshot(refUser,(newData)=>{
        if(newData.exists()){
          let take = newData.data()
          this.Data=take.Historique
          
        }
      })
     })
    
},
   async beforeCreate(){

  try {
    this.succesPage=false
    this.error=false
    this.loader=true
     const db = await getFirestore(app)
     const auth = await getAuth(app)
     //controle user
     let user
    await onAuthStateChanged(auth,(User)=>{
      user=User.uid
      this.userUId=User.uid
    })
     //fin controle user
     const refUser= await doc(db,"USERS",`${user}`)
     const data = await getDoc(refUser)
     if(data.exists()){
         const takeData=data.data()
          if(takeData.Historique){
            this.Data=takeData.Historique
            this.loader=false
            this.succesPage=true
          } else{
            this.PasAchat=true
            this.loader=false
          }
         
     }
  } catch (erro) {
    this.error=true
    this.loader=false
  }
    

  },
 
  methods:{
  async   TryAgain(){
  if(window.navigator.onLine==false){
    const alert =await alertController.create({message:"Veillez activer votre internet"})
    alert.present()
    return
  }
  try {
    this.succesPage=false
    this.error=false
    this.loader=true
     const db = await getFirestore(app)
     const auth = await getAuth(app)
     //controle user
     let user
    await onAuthStateChanged(auth,(User)=>{
      user=User.uid
    })
     //fin controle user
     const refUser= await doc(db,"USERS",`${user}`)
     const data = await getDoc(refUser)
     if(data.exists()){
         const takeData=data.data()
          if(takeData.Historique){
            this.Data=takeData.Historique
            this.loader=false
            this.succesPage=true
          } else{
            this.PasAchat=true
            this.loader=false
          }
         
     }
  } catch (erro) {
    this.error=true
    this.loader=false
  }
    }
  }
  
})
</script>

<style scoped>
.PasAchat{
        display: block;
             position: absolute;
            background-position: center;
            text-align: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.erreur{
  text-align: center;
}
ion-label h3 span {
  color: #03A61c;
}


</style>