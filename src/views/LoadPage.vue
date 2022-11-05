<template>
  <ion-page>
      <ion-content>

 
          <div class="image">
                <ion-img :src="require('../images/RICHE.jpg')"></ion-img>
          </div>
             
       <div class="loader" v-if="loader=='load'"></div>

        <div class="btnError" v-if="loader=='btnError'">
      <ion-button v-on:click="tryAgain()">
          Reessayer
      </ion-button>
        </div>
        
          <div class="footer ion-text-center">
              <p>Un Produit De L'entreprise <span>Online Guinee</span></p> 
          </div>
      </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage,IonImg,alertController,IonButton,} from '@ionic/vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from '@/firebase';
import { Geolocation } from '@capacitor/geolocation';
import store from '@/VerifyUserStore';
import { App } from '@capacitor/app';
import axios from 'axios';
import { doc, getDoc, getFirestore, increment, updateDoc } from '@firebase/firestore';
export default defineComponent ({
name:'LoadPage',
components:{
    IonPage,
    IonContent,
    IonImg,
    IonButton
   
},
data(){
    return{
     loader:"load",
     UserVille:"",
     Axioserror:false,
     localisatiError:false
    }
},

async ionViewDidEnter(){

    //a l'ouverture de l'application
    if(window.navigator.onLine==false){
      const alert =await alertController.create({
        header:"Veillez activer votre internet",
        subHeader:"Chap Chap a besion de votre internet pour bien fonctionner",
        backdropDismiss:false,
        buttons:[{
          text:"Ok compris",
          cssClass:"primary",
          handler:()=>{
            return
          }
        },{
          text:"Non",
          cssClass:"primary",
          handler:()=>{
            App.exitApp()
          }
        }]
      })
        alert.present()
       this.loader="btnError"
    }else{

      //si la connexion est acitve
      this.loader="load"
              Geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async(result)=>{
               try {
     await axios.get(`https://geocode.maps.co/reverse?lat=${result.coords.latitude}&lon=${result.coords.longitude}`).then(async(data)=>{
              let take = data.data
         const auth= await getAuth(app)
   await onAuthStateChanged(auth,async(user)=>{
         const db = await getFirestore(app)
        const reftest = doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA")
        const refAnalytique = doc(db,"ALLAUTHORISED","AppAnalitque")
        //pour le nombre de vue par jour ou par Moi pour l'analitique
        await updateDoc(refAnalytique,{
          Analitique:increment(1)
        })
        //fin
        await getDoc(reftest).then(async(data)=>{
       let data1 = data.data()
          await store.set("t",data1.test)
      })
            if(user){
              if(take.address.city){
                 await store.set("UserTown",`${take.address.city}`)
               }else{
                 if(take.address.town){
                   await store.set("UserTown",`${take.address.town}`)
                 } else{
                   const alert = await alertController.create({header:"chap chap n'est pas disponible dans votre localite",
                   backdropDismiss:true,
                   mode:"ios",
                  })
                   alert.present()
                   setTimeout(()=>App.exitApp(),2000)
                 }
               }
                this.$router.replace({path:"/tabs/tab1"})
                
            } else{
                if(take.address.city){
                 await store.set("UserTown",`${take.address.city}`)
               }else{
                 if(take.address.town){
                   await store.set("UserTown",`${take.address.town}`)
                 } else{
                   const alert = await alertController.create({header:"chap chap n'est pas disponible dans votre localite",
                   backdropDismiss:true,
                   mode:"ios",
                  })
                   alert.present()
                   setTimeout(()=>App.exitApp(),2000)
                 }
               }
                this.$router.replace({path:"/CreateAcountPage"})   
            }
        })

             })
     } catch (e) {
       this.Axioserror=true
       this.loader="btnError"
       const alert = await alertController.create({
         header:"erreur",
         subHeader:"verifier votre forfait internet ou erreur du reseaux",
         mode:"ios",
         backdropDismiss:false,
         buttons:[
          {
           text:"OK Compris",
           cssClass:"primary",
           handler:()=>{
            return
           }
         }]

       })
       alert.present()
     }
            }).catch(async()=>{
              this.localisatiError=true
              this.loader="btnError"
                const alert = await alertController.create({
         header:"erreur de localisation",
         subHeader:"Nous avons besion de votre localisation pour une meilleure experience utilisateur ? si oui cliquez sur reessayer",
         mode:"ios",
         backdropDismiss:false,
         buttons:[
          {
           text:"Oui",
           cssClass:"primary",
           handler:()=>{
             return
           }
         },{
           text:"Non",
           cssClass:"primary",
           handler:()=>{
             App.exitApp()
           }
         }]

       })
       alert.present()
             })
    }
    

   
},
methods:{
async  tryAgain(){
    if(window.navigator.onLine==false){
     const alert =await alertController.create({
        header:"Veillez activer votre internet",
        subHeader:"Chap Chap a besion de votre internet pour bien fonctionner",
        backdropDismiss:false,
        buttons:[{
          text:"Ok compris",
          cssClass:"primary",
          handler:()=>{
            return
          }
        },{
          text:"Non",
          cssClass:"primary",
          handler:()=>{
            App.exitApp()
          }
        }]
      })
        alert.present()
        return
    }
    this.loader="load"
    Geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async(result)=>{
               try {
     await axios.get(`https://geocode.maps.co/reverse?lat=${result.coords.latitude}&lon=${result.coords.longitude}`).then(async(data)=>{
              let take = data.data
         const auth= await getAuth(app)
   await onAuthStateChanged(auth,async(user)=>{
      const db = await getFirestore(app)
        const reftest = doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA")
          const refAnalytique = doc(db,"ALLAUTHORISED","AppAnalitque")
        //pour le nombre de vue par jour ou par Moi pour l'analitique
        await updateDoc(refAnalytique,{
          Analitique:increment(1)
        })
        //fin
        await getDoc(reftest).then(async(data)=>{
       let data1 = data.data()
          await store.set("t",data1.test)
      })
            if(user){
              if(take.address.city){
                 await store.set("UserTown",`${take.address.city}`)
               }else{
                 if(take.address.town){
                   await store.set("UserTown",`${take.address.town}`)
                 } else{
                   const alert = await alertController.create({header:"chap chap n'est pas disponible dans votre localite",
                   backdropDismiss:true,
                   mode:"ios",
                  })
                   alert.present()
                   setTimeout(()=>App.exitApp(),2000)
                 }
               }
                this.$router.replace({path:"/tabs/tab1"})
                
            } else{
                if(take.address.city){
                 await store.set("UserTown",`${take.address.city}`)
               }else{
                 if(take.address.town){
                   await store.set("UserTown",`${take.address.town}`)
                 } else{
                   const alert = await alertController.create({header:"chap chap n'est pas disponible dans votre localite",
                   backdropDismiss:true,
                   mode:"ios",
                  })
                   alert.present()
                   setTimeout(()=>App.exitApp(),2000)
                 }
               }
                this.$router.replace({path:"/CreateAcountPage"})   
            }
        })

             })
     } catch (e) {
        this.loader="btnError"
       const alert = await alertController.create({
         header:"erreur",
         subHeader:"verifier votre forfait internet ou erreur du reseaux ",
         mode:"ios",
         backdropDismiss:false,
         buttons:[
          {
           text:"OK Compris",
           cssClass:"primary",
           handler:()=>{
             return
           }
         }]

       })
       alert.present()
     }
            }).catch(async()=>{
              this.localisatiError=true
              this.loader="btnError"
                const alert = await alertController.create({
         header:"erreur de localisation",
         subHeader:"Nous avons besion de votre localisation pour une meilleure experience utilisateur veillez vous assurez ques vos services de locaisation sont actives",
         mode:"ios",
         backdropDismiss:false,
         buttons:[
          {
           text:"OK Compris",
           cssClass:"primary",
           handler:()=>{
             return
           }
         }]

       })
       alert.present()
             })

  }
}


})
</script>

<style scoped>
ion-content{
}
.footer{
     margin-top: 100px;
     color:#898585;
}
.footer p{
    font-family: Georgia, 'Times New Roman', Times, serif;
    text-align: center;
    padding: 2px;
}


.image{
    margin-top: 10%;
} 
.loader{
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #03a61c; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;  
  margin: auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.btnError{
    text-align: center;
}

</style>