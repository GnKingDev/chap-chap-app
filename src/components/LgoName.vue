<template>
  <ion-title color="primary" class="LogoTitle">{{town}}</ion-title>
</template>

<script>
import { defineComponent } from 'vue';
import{IonTitle}from'@ionic/vue'
export default defineComponent ({
name:"LogoName",
components:{
    IonTitle
},
props:['town']

})
</script>

<style scoped>
.LogoTitle{
    font-family: 'Times New Roman', Times, serif;
    
}
</style>