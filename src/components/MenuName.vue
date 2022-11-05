<template>
  <ion-title color="primary" class="MenuItemTitle">{{title}} </ion-title>
</template>

<script>
import { defineComponent } from 'vue';
import{IonTitle}from'@ionic/vue'
export default defineComponent ({
name:"MenuName",
components:{
    IonTitle,
    
},
props:['title']
})
</script>
<style scoped>
.LogoTitle{
    font-family: 'Times New Roman', Times, serif;
    
}
</style>