<template>
 <ion-page>
  <ion-header class="ion-no-border">
      <ion-toolbar >
          <ion-back-button default-href="/tabs/tab1"  slot="start" ></ion-back-button>
          <LogoName town="chap chap" />
      </ion-toolbar>
      <ion-toolbar v-if="load=='succes'">
          <ion-searchbar placeholder="ex:nom de la boutique" v-model="recherche" v-if="load=='succes'" mode="ios"></ion-searchbar>
      </ion-toolbar>
        <div v-if="load=='succes'" class="path">
        <ion-label >{{path}} > {{path2}} </ion-label>
        </div>
        <div class="forFiltre ion-padding" v-if="load=='succes'">
          <h6>filtre les Boutiques</h6>
          <ion-segment value="1" >
            <ion-segment-button value="1" @click="ActiveFitre(1)">
              <ion-label>Homme</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2" @click="ActiveFitre(2)">
              <ion-label>Femme</ion-label>
            </ion-segment-button>
            <ion-segment-button value="3" @click="ActiveFitre(3)">
              <ion-label>Autre</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
  </ion-header>
  <ion-content>
      <LoaderPage v-if="load=='load'" />
   <div class="for-all" v-if="load=='succes'" >
     <div class="c4"  >
           <div class="g4" v-for="data in  ifserach" :key="data.id"  >

               <ion-card @click="GetFourid(data.id)" :button="true" mode="ios">
                <img :src="data.Photo.link" />
                 <ion-card-content>
                <h6 >{{data.NomMagasin}} </h6>
                <h6 color="primary" > {{data.Ville}}</h6>
                 </ion-card-content>
               </ion-card>
              
           </div>
         </div>
        
     </div>

       <div v-if="load=='erreur'" align="center" >
         <ion-img :src="require('../images/erreurImage.png')"  ></ion-img>
       <ion-button  @click="trybefor()">
         Reessayer
       </ion-button>
     </div>

  </ion-content>
 </ion-page>
</template>

<script>
import {defineComponent} from 'vue'
import LogoName from '@/components/LgoName.vue'
import LoaderPage from '@/components/LoaderPage.vue'
import {IonCard,IonCardContent,IonContent,IonToolbar,IonImg,IonLabel,IonHeader,IonSearchbar,IonButton,alertController,IonBackButton,IonPage,IonSegmentButton,IonSegment,} from "@ionic/vue"
import { collection, getDocs, getFirestore, where,query} from '@firebase/firestore'
import app from '@/firebase'
import store from '@/VerifyUserStore'
export default defineComponent ({
name:"AllFourView",
components:{IonContent,LogoName,LoaderPage,IonImg,IonSearchbar,IonButton,IonToolbar,IonLabel,IonHeader,IonBackButton,IonPage,IonSegmentButton,IonSegment,IonCard,IonCardContent},
data(){
    return{
        load:"load",
        DataFiltre:[],
        DataShow:[],
        //les path
        path:"Fournisseur",
        path2:"",
        Usertown:"",
        recherche:"",
        isActive:0,
        H:0,
        F:0,
        Autre:0,
        New:[],
        
    }
},
watch:{
  H:function(){
    this.Homme()
  },
  F:function(){
    this.Femme()
  },
  Autre:function(){
    this.autre()
  }
},
props:['Routename'],
async beforeCreate(){

        try {
            this.load="load"
             await store.get("UserTown").then((value)=>this.Usertown=value)
            const db = await getFirestore(app)
            const q = await query( collection(db,"FOURNISSEURS"),where('active',"==",true) )
            const AllFour = await getDocs(q)
            let take = []
            AllFour.forEach((element)=>{
               take.push(element.data())

            })
            //la gestion du routeur
            if(this.Routename=="allv"){
              take.forEach(element => {
                  if(element.Ville==this.Usertown && element.NombreDEPub>0){
                    this.DataFiltre.push(element)
                  }
              });
              this.DataFiltre.forEach(element => {
                  if(element.Ville==this.Usertown && element.NombreDEPub>0){
                      this.DataShow.push(element)
                  }
              });
              this.path2='de votre ville'
            } else if (this.Routename=="all"){
              this.DataFiltre=take
              this.DataFiltre.forEach(element => {
                if(element.NombreDEPub>0){
                   this.DataShow.push(element)
                }
              });
                
                this.path2='tout'
            }
            this.load="succes"
        } catch (error) {
            this.myalert('erreur internet ')
            this.load="erreur"
            
        }
},
computed:{
  ifserach(){
     if(this.recherche){
    return   this.DataShow.filter(iteme=>{
         return this.recherche
         .toLowerCase()
         .split('')
         .every(v=>iteme.NomMagasin.toLowerCase().includes(v))
       })
     } else{
       return this.DataShow
     }
  }
},
methods:{
  //pour le filtrage
  Homme(){
    this.DataShow=this.DataFiltre.filter(e=>e.TypeMagasin=="Homme")
  },
  Femme(){
    this.DataShow=this.DataFiltre.filter(e=>e.TypeMagasin=="Femme")
  },
  autre(){
  this.DataShow=this.DataFiltre.filter(e=>e.TypeMagasin=="Autre")
  },
   async trybefor(){
       if(window.navigator.onLine==false){
         const alert = await alertController.create({message:"Veillez activer votre internet"})
         alert.present()
         return
       }
        try {
            this.load="load"
             await store.get("UserTown").then((value)=>this.Usertown=value)
            const db = await getFirestore(app)
            const q = await query( collection(db,"FOURNISSEURS"),where('active',"==",true) )
            const AllFour = await getDocs(q)
            AllFour.forEach((element)=>this.DataFiltre.push(element.data()))
            //la gestion du routeur
            if(this.Routename=="allv"){
              this.DataFiltre.forEach(element => {
                  if(element.Ville==this.Usertown){
                      this.DataShow.push(element)
                  }
              });
              this.path2='de votre ville'
            } else if (this.Routename=="all"){
                this.DataFiltre.forEach(element => {
                   this.DataShow.push(element)
                });
                this.path2='tout'
            }
            this.load="succes"
            console.log(this.DataFiltre,this.DataShow)
        } catch (error) {
            this.myalert('erreur internet ')
            this.load="erreur"
        }
    },
   async myalert(text){
       const alert = await alertController.create({message:`${text}`})
       alert.present()
       setTimeout(()=>alert.dismiss(),2000)
    },
   async GetFourid(id){
     if(window.navigator.onLine==false){
       this.myalert("activer votre internet")
       return
     }
 this.$router.push({name:"OneFourView",params:{id:id}})
    },
    //le filtrage
    ActiveFitre(e){
      this.isActive=e
      if(e==1){
        this.H++
      } else if (e==2){
        this.F++
      } else if (e==3){
        this.Autre++
      }
    }
    
}
})
</script>

<style scoped lang="scss">

.c4{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}
.g4{
  width: 50%; 
}
.g4 ion-card img {
    width: 180px;
  height: 180px;
  object-fit: fill;
}
.erreur{
  text-align: center;
}
.path{
  text-align: center;
  color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
ion-label{
  text-align: center;
}
.erreur{
  margin-top: 100px;
  text-align: center;
}
h6{
  color: #898585;
}
.forFiltre{
  text-align: center;
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
.active{
  background-color: #03A61c;
  color: white;
}
</style>