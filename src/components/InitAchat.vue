<template>
      <ion-content>
             <ion-label class="Info" v-if="nextBtn=='none'">
                 <h3>Vous souhaiter Achete</h3>
                  <h3>nom: <span> {{nom}} </span></h3>
                  <h3>Ville: <span> {{ville}} </span></h3>
                  <h3>Taille :<span> {{taille}} </span></h3>
                     <h3>Couleur : <span>{{couleur.name}}</span></h3>
                      <h3>Nombre de ce Produit : <span> {{nombreProduit}}</span> </h3>
                       <h3>Vous allez paye en total :  <span> {{sommeTotat.toLocaleString('en-US')}}</span> GNF</h3>
                     
             </ion-label>
              

             <div  class="Choix-de-payement-et Adrresse" v-if="nextBtn=='none'">
                 <ion-list>
                     <ion-radio-group name="auto"  @ionChange="getvalue($event)">
                         <ion-list-header>
                             <h6 class="ion-text-center">Choisir la methode de payment</h6>
                         </ion-list-header>
                         <ion-row>
                             <ion-col size="6">
                                  <ion-item lines="none">
                             <ion-thumbnail slot="start">
                             <img :src="require('../images/OM.jpg')" />
                              </ion-thumbnail>
                             <ion-radio value="OM" mode="md"></ion-radio>
                         </ion-item  >
                             </ion-col>
                             <ion-col size="6">
                                  <ion-item lines="none">
                              <ion-thumbnail slot="start">
                             <img :src="require('../images/MTN.jpg')" />
                              </ion-thumbnail>
                             <ion-radio value="MTN" mode="md"></ion-radio>
                            </ion-item>
                             </ion-col>
                         </ion-row>
                     </ion-radio-group>
                 </ion-list>
                  <ion-item>
                 <ion-label position="floating">{{label}}</ion-label>
                 <ion-input   v-model="Addresse" placeholder="Adresse pour la livraison" autofocus></ion-input>
              </ion-item>
             </div>

             <div class="Adresse-et-numerophone" v-if="nextBtn=='PayPart'">
                
                 <div v-if="OM">
              <ion-item lines="none">
                  <ion-thumbnail slot="start" class="orange" >
                      <img :src="require('../images/OM.jpg')" />
                  </ion-thumbnail>
              </ion-item>
              <ion-label class="payment-code">
                   <h3 v-if="ville!=Usertown">Lisez Ici : <span>Si le Produit ne se trouve pas dans la meme ville que vous vous prenez en charge les frais de livraison </span></h3>
                      <h3 class="ion-text-center ion-padding"> Pour Avoir Le code de payement TAPEZ sur ??a <a href="tel:*144*4*2*1#">*144*4*2*1#</a>  entre votre code secret et apres le code  s'affichera dans la page de payement entre juste votre numero orange money et ce code generer</h3>
                  </ion-label>
                  <div class="ion-margin" align="center">
                     
                  </div>
                  

                  <div class="btn ion-padding">
                       <ion-button v-on:click="AchatOm()" :disabled="initpay">
                          <i class="fa fa-spinner fa-spin"  v-if="initpay"></i> Proceder au payement 
                      </ion-button>
              <ion-button v-on:click="Back()" fill="outline" :disabled="initpay">
                 Retour
             </ion-button>
             </div>
                 </div>


                 <div v-if="MTN">
                       <ion-item lines="none">
                  <ion-thumbnail slot="start" class="orange" >
                      <img :src="require('../images/MTN.jpg')" />
                  </ion-thumbnail>
              </ion-item>
              <ion-label class="payment-code">
                      <h3 v-if="ville!=Usertown">Lisez Ici : <span>Si le Produit ne se trouve pas dans la meme ville que vous vous prenez en charge les frais de livraison </span></h3>
                  </ion-label>
                  <div class="SenePayementrequest" v-if="MtnRequest">
                      <ion-label>
                      <h3 class="ion-padding">Nous vous enverrons la demande de payement sur votre numero pour valider le payement</h3>
                      </ion-label>
                  <ion-item>
                      <ion-label>Numero MTN</ion-label>
                      <ion-input type="number" v-model="Numero"></ion-input>
                  </ion-item>
                  <ion-button v-on:click="SendRequestMTN()" class="ion-margin" :disabled="initpay" >
                     <i class="fa fa-spinner fa-spin"  v-if="initpay" ></i> Envoyer la demande
                  </ion-button>
                 </div>

                 <div align="center" v-if="MtnRequest==false" >
                    <ion-label class="payment-code">
                      <h3 class="ion-padding">Cliquez sur <a href="tel:*440#">*440#</a> pour valider le payement et apres cliquez sur verifier </h3>
                  </ion-label>
                  <ion-button v-on:click="Verify()" :disabled="initpay">
                        <i class="fa fa-spinner fa-spin"  v-if="initpay" ></i> verifier
                  </ion-button>
                 </div>
               <ion-button v-on:click="Back()" fill="outline" class="ion-margin" :disabled="initpay">
                   Retour
               </ion-button>
             </div>
             </div>
             <div class="succes" v-if="nextBtn=='SuccesPay'">
                 <img :src="require('../images/check.gif')" alt="">
                 <div align="center">
                  <h6 v-if="ville==Usertown" class="ion-padding">Votre Payement a ete effectue avec Succes ! le Produit sera livre dans peu de temps voici votre id de transaction {{AchatRef}} </h6>
                  <h6 v-if="ville!=Usertown" class="ion-padding">Votre Payement a ete effectue avec Succes ! le Produit sera livre dans une semaine cela depand de la distance entre votre ville et le produit voici votre id de transaction {{AchatRef}}</h6>
                  <ion-button v-on:click="Historique()">
                    Historique Achat 
                  </ion-button>
                  <ion-button v-on:click="Ferme()">
                    ok 
                  </ion-button>
                 </div>
             </div>
         <div class="btn ion-padding">
         <ion-button @click="next()" v-if="nextBtn=='none'">
           Suivant
         </ion-button>
           <ion-button v-on:click="Ferme()" fill="outline" v-if="nextBtn=='none'">
           ferme
         </ion-button>
         </div>
      </ion-content>
</template>

<script>
import {defineComponent} from 'vue'
import {IonContent,IonItem,IonThumbnail,IonLabel,IonButton,IonRadio,IonRadioGroup,IonList,IonListHeader,IonInput,modalController,IonRow,IonCol, toastController, alertController, loadingController} from '@ionic/vue'
import store from '@/VerifyUserStore';
import { arrayUnion, collection, doc, getFirestore, increment, onSnapshot, setDoc, Timestamp, updateDoc } from '@firebase/firestore';
import app from '@/firebase';
import { Browser } from '@capacitor/browser';
import { LocalNotifications } from '@capacitor/local-notifications';
import {v4 as uuidv4} from 'uuid';
export default defineComponent ({
name:"InitAchat",
components:{IonContent,IonItem,IonThumbnail,IonLabel,IonRadio,IonRadioGroup,IonList,IonListHeader,IonInput,IonButton,IonRow,IonCol},
props:['sommeTotat','nom','ville','taille','couleur',"nombreProduit",'lien','RealPrice','UserInfo','fourInfo','Product','EndPoint'],
data(){
    return{
        nextBtn:"none",
        Backbtn:"none",
        Usertown:"",
        label:"",
        Addresse:"",
        radioValue:"",
        OM:false,
        MTN:false,
        modalController,
        OTP:"",
        Numero:"",
        MtnRequest:true,
        initpay:false,
        AchatRef:"",
        MtnRefAcaht:"",

    }
},
methods:{
    //verfication achat MTn
    Historique(){
        this.$router.push('/HistoriqueAchat')
         modalController.dismiss()
    },
   async Verify(){
         this.initpay=true
        try {
             await  fetch(`${this.EndPoint.EPMTNstatus}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    body: JSON.stringify({
        'uid':`${this.MtnRefAcaht}`
    })
}).then(async(data)=>{
    if(data.status==201){
       data.json().then(async(dat)=>{
           if(dat.realres.status=='SUCCESSFUL'){
               const db = getFirestore(app)
        const refa = doc(db,"AllAchat",this.MtnRefAcaht)
        updateDoc(refa,{
          Status:'SUCCESS'
        })
         this.nextBtn='SuccesPay'
           this.initpay=true
          let D = new Date()
             D=D.toLocaleDateString("fr")
             const refUser=doc(db,"USERS",this.UserInfo.id)
             const refFour = doc(db,"FOURNISSEURS",this.fourInfo.id)
              updateDoc(refUser,{
                 Historique:arrayUnion({
                     nomProd:this.nom,
                     prix:this.sommeTotat,
                     date:D,
                     numero:this.fourInfo.NumeroPhoneOrange,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     nombre:this.nombreProduit,
                     couleur:this.couleur.name,
                     taille:this.taille,
                     idAchat:this.MtnRefAcaht,
                     type:"produit",
                 }),
                 NombreAchat:increment(1),
             })
              updateDoc(refFour,{
                 HistoriqueAchat:arrayUnion({
                      nom:this.nom,
                     prix:this.sommeTotat,
                     dateAchat:D,
                     numero:this.UserInfo.UserNumberPhone,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     qualite:this.Product.Qualite,
                     taille:this.taille,
                     couleur:this.couleur.name,
                     nombre:this.nombreProduit,
                     adresse:this.Addresse
                 }),
                 NombreAchat:increment(1),
                 MontantTotalAchat:increment(this.RealPrice)
             })

           }else{
                const toast = await toastController.create({message:"Payement Non effectuer",duration:2000})
                toast.present()
                  this.initpay=false
           }
       })
    }else{
         const toast = await toastController.create({message:"erreur reessayer",duration:2000})
        toast.present()
          this.initpay=false
    }
})
        } catch (error) {
            const toast = await toastController.create({message:"erreur reessayer",duration:2000})
             toast.present()
               this.initpay=false
        }
    },
    //verification achat MTN
    //iniation achat MTN MONey
  async  SendRequestMTN(){
      let regexNumber = /^(\+\d{3}\s?)?\(?6\d{2}\)?[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d{2}$/
      if(regexNumber.test(this.Numero)==false){
          const toast = await toastController.create({message:"numero incorrecte",duration:2000})
          toast.present()
          return
      }
   try {
        const db = getFirestore(app)
  const refAchat = doc(collection(db,"AllAchat"))
        let realprix=this.RealPrice/this.nombreProduit
       this.initpay=true
        let myuuid = uuidv4();
    this.MtnRefAcaht=refAchat.id
  await setDoc(refAchat,{
    Status:false,
    type:'Mobile',
    Type:'Produit',
    idAchat:refAchat.id,
    serviceNum:"666296999 628460034",
    timestamp:Timestamp.now(),
    taille:this.taille,
    couleur:this.couleur.name,
    nom:`${this.nom} couleur: ${this.couleur} taille: ${this.taille} nombre: ${this.nombreProduit}`,
    Livre:"non",
    NumberPhone:this.UserInfo.UserNumberPhone,
    FourNumberPhone:this.fourInfo.NumeroPhoneOrange,
    Wepay:this.RealPrice,
    nombre:this.nombreProduit,
    LivreAdress:this.Addresse,
    RealPrice:realprix,
    Sommetotal:this.sommeTotat,
    For:this.Product.IdFournisseur,
     payementMethode:"MobileMoney",
    refId:myuuid
  })
   fetch(`${this.EndPoint.EPMTNinit}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    body: JSON.stringify({
        'uid': `${myuuid}`,
        'amount': `${this.sommeTotat}`,
        'AchatId': `${refAchat.id}`,
        'numero': `${this.Numero}`
    })
}).then(async(data)=>{
    if(data.status==201){
        this.MtnRequest=false
        this.initpay=false
    }else{
        const toast = await toastController.create({message:"erreur reessayer",duration:2000})
        toast.present()
        this.initpay=false
    }
})
   } catch (error) {
       const toast = await toastController.create({message:"erreur reessayer",duration:2000})
        toast.present()
       this.initpay=false
   }
    },
    //fin initiation achat MTN MOney
    Back(){
    this.MtnRequest=true
     this.radioValue=""
     this.OM=false,
     this.MTN=false
     this.nextBtn='none'
     this.Numero=""

    },
  async Ferme(){
        await modalController.dismiss();
    },
    getvalue(event){
        if(event.detail.value=="OM"){
            this.OM=true
            this.MTN=false
            this.radioValue=event.detail.value
        } else{
            this.MTN=true
            this.OM=false
            this.radioValue=event.detail.value
        }
    },
    //button Achat pour orange Money
   async AchatOm(){
         const db = getFirestore(app)
  const refAchat = doc(collection(db,"AllAchat"))
       
       try {
        let realprix=this.RealPrice/this.nombreProduit
       this.initpay=true
  await setDoc(refAchat,{
    Status:false,
    type:'Mobile',
    Type:'Produit',
    idAchat:refAchat.id,
    serviceNum:"666296999 628460034",
    timestamp:Timestamp.now(),
    taille:this.taille,
    couleur:this.couleur.name,
    nom:`${this.nom} couleur: ${this.couleur} taille: ${this.taille} nombre: ${this.nombreProduit}`,
    Livre:"non",
    NumberPhone:this.UserInfo.UserNumberPhone,
    FourNumberPhone:this.fourInfo.NumeroPhoneOrange,
    Wepay:this.RealPrice,
    nombre:this.nombreProduit,
    LivreAdress:this.Addresse,
    RealPrice:realprix,
    Sommetotal:this.sommeTotat,
    For:this.Product.IdFournisseur,
     payementMethode:"OrangeMoney",
  })
  await fetch(`${this.EndPoint.EPOrange}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
   
    body: JSON.stringify({
        'orderId': refAchat.id,
       'amount': this.sommeTotat,
     'Rurl': refAchat.id,
     'CancelUrl' : refAchat.id,
     'AchatId': refAchat.id,
    })
   }).then(async(data)=>{
  if(data.status==201){
   data.json().then(async(dat)=>{
     if(dat.realres.message=="OK"){
        await updateDoc(refAchat,{
        PayInfo:dat.realres
  })
  let res = dat.realres
   this.initpay=false
   let Status = false
  await Browser.open({url:res.payment_url,toolbarColor:'#03A61c',}).then(async()=>{
    onSnapshot(refAchat,async(newdata)=>{
        if(newdata.exists()){
            let take = newdata.data()
            if(take.Status=='SUCCESS'){
                Status=true
             this.nextBtn='SuccesPay'
             LocalNotifications.schedule({
                 notifications:[
                     {
                    title:`Payement effectuer `,
                     body:"Vous pouvez fermer cette partie",
                       id:Math.floor(Math.random()*10)
                     }
                 ]
             })
             let D = new Date()
             D=D.toLocaleDateString("fr")
             const refUser=doc(db,"USERS",this.UserInfo.id)
             const refFour = doc(db,"FOURNISSEURS",this.fourInfo.id)
              updateDoc(refUser,{
                 Historique:arrayUnion({
                     nomProd:this.nom,
                     prix:this.sommeTotat,
                     date:D,
                     numero:this.fourInfo.NumeroPhoneOrange,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     nombre:this.nombreProduit,
                     couleur:this.couleur.name,
                     taille:this.taille,
                     idAchat:refAchat.id,
                     type:"produit",
                 }),
                 NombreAchat:increment(1),
             })
              updateDoc(refFour,{
                 HistoriqueAchat:arrayUnion({
                      nom:this.nom,
                     prix:this.sommeTotat,
                     dateAchat:D,
                     numero:this.UserInfo.UserNumberPhone,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     qualite:this.Product.Qualite,
                     taille:this.taille,
                     couleur:this.couleur.name,
                     nombre:this.nombreProduit,
                     adresse:this.Addresse
                 }),
                 NombreAchat:increment(1),
                 MontantTotalAchat:increment(this.RealPrice)
             })
            }
        }
    })
  })
  Browser.addListener("browserFinished",async()=>{
    const attendre = await loadingController.create({message:"attendre"})
      attendre.present()
          if(Status==true || Status=="Failed"){
              if(Status=="Failed"){
                  const toast = await toastController.create({message:"payement non effectuer",duration:2000})
                  toast.present()
                  attendre.dismiss()
              }
              attendre.dismiss()
              return
          }else{
            fetch(`${this.EndPoint.EPOtransac}`,{
                method:"POST",
                 headers: {
                 'Content-Type': 'application/json',
                  'Accept': 'application/json'
                 },
                 body: JSON.stringify({
                     'id':refAchat.id
                 })
            }).then(async(data)=>{
                if(data.status==201){
                 data.json().then(async(dat)=>{
                    if(dat.realres.status=="SUCCESS"){
                        this.nextBtn="SuccesPay"
                         let D = new Date()
                         D=D.toLocaleDateString("fr")
                const refUser=doc(db,"USERS",this.UserInfo.id)
                 const refFour = doc(db,"FOURNISSEURS",this.fourInfo.id)
                        attendre.dismiss()
                         updateDoc(refUser,{
                 Historique:arrayUnion({
                     nomProd:this.nom,
                     prix:this.sommeTotat,
                     date:D,
                     numero:this.fourInfo.NumeroPhoneOrange,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     nombre:this.nombreProduit,
                     couleur:this.couleur.name,
                     taille:this.taille,
                     idAchat:refAchat.id,
                 }),
                 NombreAchat:increment(1),
             })
              updateDoc(refFour,{
                 HistoriqueAchat:arrayUnion({
                      nom:this.nom,
                     prix:this.sommeTotat,
                     dateAchat:D,
                     numero:this.UserInfo.UserNumberPhone,
                     ville:this.Product.ville,
                     LinkPhoto:this.couleur.lien,
                     qualite:this.Product.Qualite,
                     taille:this.taille,
                     couleur:this.couleur.name,
                     nombre:this.nombreProduit,
                     adresse:this.Addresse
                 }),
                 NombreAchat:increment(1),
                 MontantTotalAchat:increment(this.RealPrice)
             })

                    }else{
                        attendre.dismiss()
                        const alert = await alertController.create({message:"payement non effectuer"})
                        alert.present()
                    }
                 })
                }else{
                    attendre.dismiss()
                     const alert = await alertController.create({message:"erreur serveur reessayer"})
                    alert.present()
                }
            })
          }
     
  })
     }else{
       this.initpay=false
        const alert = await alertController.create({message:"erreur serveur reessayer"})
                    alert.present()
       
     }
 
 })
  }else{
    this.initpay=false
    const alert = await alertController.create({message:"erreur serveur reessayer"})
                    alert.present()
  }
 
})
       } catch (error) {
            const alert = await alertController.create({message:`Erreur de serveur ou si vous avez ete facture et que Chap Chap n'a pas reconnu le payement veillez contacter le service client avec cette reference ${refAchat.id} faite une capture d'ecran`,backdropDismiss:false,buttons:[{text:"ok",cssClass:"primary",}]})
                    alert.present()
       }
      
     
    },
    //fin Button Achat pour orange money
    //debut pour les button MTN
   async next(){
        if(this.OM==false && this.MTN==false){
        const toast = await toastController.create({message:"Veillez choisir une methode de payment",duration:3000})
        toast.present()
        return
        } else{
            if(this.Addresse==""){
                 const toast = await toastController.create({message:"Veillez donner une adresse de livraison",duration:3000})
        toast.present()
        return
            }
            this.nextBtn='PayPart'
        }
    }
},

   
async mounted(){
  await store.get("UserTown").then((value)=>this.Usertown=value)
  if(this.ville==this.Usertown){
      this.label=" le nom de la ou vous ??te"
  } else{
      this.label="La ville de livraison"
      this.Addresse=this.Usertown
  }
}
})

</script>

<style scoped>
.Info{
 padding-left: 2px;
}
.Info h3 span{
    color: #03A61c;
}
.btn ion-button{
    margin: 8px;
}
.payment-code span{
    color: #03A61c;
}
.label{
   color: #898585; 
}
h3{
    color: #898585;
    text-align: center;
}
.Adresse-et-numerophone:focus-visible{
    transition: 0.2s;
}

</style>