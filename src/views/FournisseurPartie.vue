<template>
   <ion-page>
   <AllFourView v-if="this.$route.params.value=='all' || this.$route.params.value=='allv'" :Routename="this.$route.params.value" />
    </ion-page>
</template>

<script>
import {defineComponent} from "vue"
import AllFourView from '@/components/AllFourView.vue'
import{IonPage, loadingController} from "@ionic/vue"
export default defineComponent({
name:"FournisseurPartie",
components:{IonPage,AllFourView},
data(){
    return{
        LeRoute:"",
        idFour:"none",
        showContent1:false,
        showContent2:false,
        loadingController
    }
},
beforeCreate(){
    this.LeRoute= `${this.$route.params.value}`
    if(this.LeRoute!='allv' && this.LeRoute!="all"){
        this.showContent2=true
    } else{
        this.showContent1=true
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
})
</script>

<style scoped>

</style>