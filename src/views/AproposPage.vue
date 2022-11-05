<template>
  <ion-page>
   <ion-header class="ion-no-border">
       <ion-toolbar>
         <ion-back-button defaultHref="/tabs/tab1" slot="start"></ion-back-button>
         <MenuName :title="nom" />
       </ion-toolbar>
      </ion-header>
    <ion-content>
     <ion-img :src="require('../images/RICHE.jpg')"></ion-img>
      <ion-text class="text ion-padding" >
        <p>Cette application a ete concus par Richard Sagno Fondacteur de Online Guinee 
          passionez par la programation et l'evolution de la technologie, au regard des constats effectues l'internet est un outil accessible par la majeur partie de la population alors pourquoi ne pas utiliser cet outil pour creer un marche virtuel accessible la ou le reseaux est disponible  </p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,  IonContent,IonBackButton,IonText,IonImg } from '@ionic/vue';
import MenuName from '@/components/MenuName.vue'
export default defineComponent({
  name: 'AproposPage',
  components: {  IonHeader, IonContent, IonPage ,IonToolbar,IonBackButton,MenuName,IonText,IonImg},
  data(){
    return{
      nom:"A propos"
    }
  }
});
</script>
<style scoped>
.text{
  text-align: center;
  
   color: #898585;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>