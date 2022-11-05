import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import WelComePage from  '../views/WelComePage.vue'
import HistoriqueAchat from '../views/HistoriqueAchat.vue'
import CreateAcountPage from '../views/CreateAcountPage.vue'
import UserProfil from '../views/UserProfil.vue'
import LoadPage from '../views/LoadPage.vue'
import TabsPage from "../views/TabsPage.vue"
import ProductDetailPage from '@/views/ProductDetailPage.vue'
import HommeFemmeAllProduct from '@/views/HommeFemmeAllProduct.vue'
import PanierPage from '@/views/PanierPage.vue'
import ServiceClient from '@/views/ServiceClient.vue'
import AproposPage from '@/views/AproposPage.vue'
import MesLike from '@/views/MesFavoris.vue'
import FournisseurPartie from '@/views/FournisseurPartie.vue'
import MessaGes from '@/views/MessaGes.vue'
import ConverSation from '@/views/ConverSation.vue'
import CodeU from '@/views/CodeU.vue'
import OneFourview from '@/views/OneFourView.vue'
import FlasH from '@/views/FlasH.vue'
const routes : Array<RouteRecordRaw>=[
  {
    path: '/',
    redirect: '/LoadPage'
  },
  {
    path: '/FournisseurPartie/:value',
    name: 'FournisseurPartie',
    component: FournisseurPartie
  },
  {
    path: '/ServiceClient',
    name: 'ServiceClient',
    component: ServiceClient
  },
  {
    path: '/ConverSation/:index/:id/:index2',
    name: 'ConverSation',
    component: ConverSation
  },
  {
    path: '/MesFavoris',
    name: 'MesFavoris',
    component: MesLike
  },
  {
    path: '/WelComePage/:VerifyCode/:UserNumberPhone/:UserName/:UserTown',
    name: 'WelcomePage',
    component:WelComePage
  },
  {
    path: '/HistoriqueAchat',
    name: 'HistoriqueAchat',
    component:HistoriqueAchat
  },
  {
    path: '/CodeU',
    name: 'CodeU',
    component:CodeU
  },
  {
    path: '/OneFourView/:id',
    name: 'OneFourView',
    component:OneFourview
  },
  {
    path: '/Messages',
    name: 'MessaGes',
    component:MessaGes
  },
  {
    path: '/CreateAcountPage',
    name: 'CreateAcountPage',
    component:CreateAcountPage
  },
  {
    path: '/LoadPage',
    name: 'LoadPage',
    component:LoadPage
  },
  {
    path: '/AproposPage',
    name: 'AproposPage',
    component:AproposPage
  },
  {
    //product detaill page
    path: '/ProductDetailPage/:id/:prix',
    name:'ProductDetailPage',
    component: ProductDetailPage
  },
       //AffichageDeTousLesProduitHommeOUFemme
  {
    path: '/HommeFemmeAllProduct/:categori/:type',
    name:'HommeFemmeAllProduct',
    component: HommeFemmeAllProduct
  },
 

  //la tabulation
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      //gestion tabulation
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/ShopIn.vue'),
        
      },
      
      {
        path: 'tab2/:id',
        name:"Resto",
        component: () => import('@/views/RestoFood.vue')
      },
     
      {
        path: 'tab3',
        name:'PanierPage',
        component: PanierPage
      },
      {
        path: 'tab4',
        name: 'UserProfile',
        component:UserProfil
      },
      {
        path: 'tab5/:id',
        name: 'FlasH',
        component:FlasH
      },

      //fin gestion tabulation

     
    
    ]
    
  },
 
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
