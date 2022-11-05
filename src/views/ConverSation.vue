<template>
  <ion-page>
<ion-header class="ion-no-border">
    <div class="header ion-padding" v-if="img">
        <div class="info">
               <ion-back-button default-href="tabs/tab1" mode="md" ></ion-back-button>
               <ion-avatar>
                   <img :src="MessageInfo.linkPhoto"  />
               </ion-avatar>
               <span class="detail">
                   <h1>{{MessageInfo.nomProd}}</h1>
               </span>
        </div>
    </div>
</ion-header>
<ion-content>
     <div class="chat-page">
        <div class="msg-inbox">
            <div class="chats">
                <div class="msg-page">
                  <div v-for="(message,index) in AllMessage" :key="index">

                    <div class="received-chats" v-if="message.type=='Four'">
                        <div class="received-chats-img">
                            <img :src="MessageInfo.FourPhoto" alt="">
                            </div>
                            <div class="received-msg">
                                <div class="received-msg-inbox">
                                    <p>{{message.message}}</p>
                                    <span class="time">{{message.time}}</span>
                                </div>
                            </div>
                    </div>

               
                   
                   
                     <div class="outgoing-chats" v-if="message.type=='client'">
                            <div class="outgoing-chats-msg">
                                    <p>{{message.message}}</p>
                                    <span class="time">{{message.time}} envoyer</span>
                            </div>

                               <div class="outgoing-chats-img">
                            <img :src="MessageInfo.UserPhoto" alt="">
                            </div>
                    </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</ion-content>
<ion-footer class="ion-padding">
          <ion-item :disabled="btnSend">
              <ion-textarea placeholder="tapez votre message" v-model="chat"></ion-textarea>
             <ion-icon :icon="paperPlane" class="icon" color="primary" @click="SendMessage"></ion-icon>
          </ion-item>
            
          
</ion-footer>
  </ion-page>
</template>

<script>
import app from '@/firebase'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc, getFirestore, onSnapshot, Timestamp, updateDoc } from '@firebase/firestore'
import {IonPage,IonHeader,IonContent,IonFooter,IonIcon,IonItem,IonBackButton,IonAvatar,IonTextarea,loadingController, alertController, toastController, onIonViewDidEnter} from '@ionic/vue'
import { defineComponent } from '@vue/runtime-core'
import {mic,paperPlane} from 'ionicons/icons'
export default defineComponent({
  name:"ConverSation",
  components:{
      IonPage,
      IonHeader,
      IonContent,
     IonFooter,
     IonIcon,
     IonBackButton,
     IonAvatar,
     IonTextarea,
     IonItem
    
  },
  data(){
      return{
           mic,
          paperPlane,
          MessageInfo:{},//pour le head et corp du message
          taketoSend:[],
          AllMessage:[],
            chat:"",
            FourMessage:[],
            btnSend:false,
            img:false

      }
  },
 
 async beforeCreate(){
    const attendre = await loadingController.create({message:"patientez s'il vous plait"})
    attendre.present()
    try {
        const db = await getFirestore(app)
        const refuser = await doc(db,"USERS",`${this.$route.params.id}`)
        const data = await getDoc(refuser)
        if(data.exists()){
            let take = data.data()
            this.taketoSend=take.Message
             if(this.taketoSend[this.$route.params.index].newPrice.isActive==true){
         let dateNow = new Date(Timestamp.now().seconds*1000)
         let reduitDate= new Date(take.Message[this.$route.params.index].newPrice.duree.seconds*1000)
         let timeDiff = dateNow.getTime()-reduitDate.getTime()
         let result = timeDiff/(1000 * 3600 * 24)
         if(result<=1){
            const alert = await alertController.create({
             header:"Vous avez eu une reduction sur ce produit",
             subHeader:"cliquez sur je profite pour payer le produit avec cette reduction elle expire dans 24 heures",
             backdropDismiss:false,
             buttons:[{
                 text:"Je profite",
                 cssClass:"primary",
                 handler:()=>{
                  this.$router.push({name:"ProductDetailPage",params:{id:take.Message[this.$route.params.index].idProduit,prix:'yes'}})
                 }
             },{
                 text:"pas maintenant",
                 cssClass:"primary",
                 handler:()=>{
                     return
                 }
             }]
         })
         alert.present()
         }
        
     }

           take.Message[this.$route.params.index].message.forEach(element => {
                if(element.type=='Four'){
                    element.vue=true
                }
           });
            await updateDoc(refuser,{
                Message:take.Message
            })
             
            this.MessageInfo=take.Message[this.$route.params.index]
            
            this.AllMessage=take.Message[this.$route.params.index].message
            this.img=true
            //pour le fournisseur
         const refFour = await doc(db,"FOURNISSEURS",`${this.MessageInfo.idFour}`)
         const four = await getDoc(refFour)
         if(four.exists()){
           let take = four.data()
           this.FourMessage=take.Message
         }
         attendre.dismiss()
        }
    } catch (error){
        const alert = await alertController.create({message:"erreur"})
         alert.present()
        this.$router.back()
        attendre.dismiss()
    }
  },
 async onIonViewDidEnter(){
  const auth = getAuth(app)
  const db = getFirestore(app)
  onAuthStateChanged(auth,async(user)=>{
      const refuser = doc(db,"USERS",user.uid)
     onSnapshot(refuser,async(newdata)=>{
         if(newdata.exists()){
            let take = newdata.data()
             this.taketoSend=take.Message
               if(this.taketoSend[this.$route.params.index].newPrice.isActive==true){
         let dateNow = new Date(Timestamp.now().seconds*1000)
         let reduitDate= new Date(take.Message[this.$route.params.index].newPrice.duree.seconds*1000)
         let timeDiff = dateNow.getTime()-reduitDate.getTime()
         let result = timeDiff/(1000 * 3600 * 24)
         if(result<=1){
            const alert = await alertController.create({
             header:"Vous avez eu une reduction sur ce produit",
             subHeader:"cliquez sur je profite pour payer le produit avec cette reduction elle expire dans 24 heures",
             backdropDismiss:false,
             buttons:[{
                 text:"Je profite",
                 cssClass:"primary",
                 handler:()=>{
                  this.$router.push({name:"ProductDetailPage",params:{id:take.Message[this.$route.params.index].idProduit,prix:'yes'}})
                 }
             },{
                 text:"pas maintenant",
                 cssClass:"primary",
                 handler:()=>{
                     return
                 }
             }]
         })
         alert.present()
         }
        
     }
             take.Message[this.$route.params.index].message.forEach(element => {
        if(element.type=='Four'){
            if(element.vue==false){
                this.AllMessage.push(element)
                element.vue=true
            }
        }
    });
        await updateDoc(refuser,{
        Message:take.Message
    })
         }
     })
  })
  }, 
 
  methods:{
      async SendMessage(){
          if(window.navigator.onLine==false){
              return
          }
          if(this.chat=="" || !this.chat){
              return
          }
          try {
              this.btnSend=true
              let timstamp = new Date(Date.now())
             this.taketoSend[this.$route.params.index].message.push({
                  vue:true,
                time:timstamp.toLocaleDateString("fr-FR"),
                type:"client",
                message:this.chat
             })
             this.FourMessage[this.$route.params.index2].message.push({
                vue:false,
                time:timstamp.toLocaleDateString("fr-FR"),
                type:"client",
                message:this.chat,
             })
              
             const db =  getFirestore(app)
             const refuser =  doc(db,"USERS",`${this.$route.params.id}`)
              updateDoc(refuser,{
                 Message:this.taketoSend
             }).then(async()=>{
                 const refFour = await doc(db,"FOURNISSEURS",`${this.MessageInfo.idFour}`)
                  updateDoc(refFour,{
                  Message:this.FourMessage
                 })
             })
                  this.btnSend=false
                     this.chat=""
          } catch (error) {
              const toast = await toastController.create({message:"message non envoye",duration:3000})
              this.taketoSend[this.$route.params.index].message.pop()
              this.FourMessage[this.$route.params.index2].message.pop()
              toast.present()
              this.btnSend=false
          }
          
          
      }
  }
  
})
</script>

<style lang="scss" scoped >
.icon{
    font-size: 40px;
}
.msg-bottom{
    position: relative;
    height: 10%;
    background: #03A61c;
}
.input-groupj{
    float: right;
    margin-top: 13px;
    margin-right: 20px;
    outline: none !important;
    border-radius: 20px;
    width: 61% !important;
    background: #fff;
}
.outgoing-chats-msg p{
background: #03A61c none repeat scroll;
color: #fff;
border-radius: 10px;
font-size: 14px;
margin: 0;
color: #fff;
padding: 5px 10px 5px 12px;
width: 100%;
}
.outgoing-chats-msg{
    float: left;
    width: 46%;
    margin-left: 45%;
}
.outgoing-chats{
    overflow: hidden;
    margin: 26px 20px;
}
.outgoing-chats-img{
    display: inline-block;
    width: 20px;
    float: right;
}
.chat-page{
    padding:0 0 50px 0;
}
.msg-inbox{
  overflow: hidden;
  padding-bottom: 30px;
}
.chats{
    padding: 30px 15px 0 25px;
}
.msg-page{
    height: 100%;
    overflow-y: auto;
}
.received-chats-img{
    display: inline-block;
    width: 20px;
    float: left;
}
.received-msg{
    display: inline-block;
    padding: 0 0 0 10px;
    vertical-align: top;
    width: 92%;
    
}
.received-msg-inbox{
    width: 57%;
}
.received-msg-inbox p {
    background: #efefef none repeat scroll 0 0 ;
    border-radius: 10px;
    color: #646464;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
    
}
.time{
    color: #777;
    display: block;
    font-size: 12px;
    margin: 8px 0 0 ;
}

img{
    max-width: 100%;
    border-radius: 50%;
}

ion-header{
    ion-avatar{
        width: 100% !important;
        height: 100% !important;
    }
    .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        letter-spacing: 1px;
        height: 10vh;
        background-color: #03A61c;
         border-bottom-left-radius: 40px;
         border-bottom-right-radius: 40px;
        ion-back-button{
            font-size: 1.6rem;
            color: #fff;
        }
        .info{
            display: flex;
            align-items: center;
            ion-avatar{
                max-width: 51px;
                max-height: 51px;
                margin-left: 15px;
            }
            .detail{
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                h1,p{
                    margin: 0;
                    color: #fff;
                    margin-left: 10px;
                }
                h1{
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                p{
                    opacity: 0.7;
                    margin-top: 3px;
                    font-size: 0.8rem;
                }
            }
        }
    }
}
</style>