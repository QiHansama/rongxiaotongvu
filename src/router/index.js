import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import FrontPage from "@/views/FrontPage.vue";
import Details from "@/views/Details.vue";
import publishedGoods from "@/views/PublishedGoods.vue";
import publishGoods from "@/views/PublishGoods.vue";
import HomeGoods from "@/views/HomeGoods.vue";
import ShopCart from "@/views/ShopCart.vue";
import HomeGuide from "@/views/HomeGuide.vue";
import GuideDetail from "@/views/guideDetail.vue";
import AllExpert from "@/views/AllExpert.vue";
import QuestionForm from "@/views/QuestionForm.vue";
import AppointmentForm from "@/views/AppointmentForm.vue";
import Financing from "@/views/Financing.vue";
import FinancingDetails from "@/views/FinancingDetails.vue";
import SmartMatchUser from "@/components/SmartMatchUser.vue";
import HomePurchase from "@/views/HomePurchase.vue";
import purchaseDetails from "@/views/purchaseDetails.vue";
import AboutUs from "@/views/AboutUs.vue";
import User from "@/views/User.vue";
import UserInfo from "@/views/UserInfo.vue";
import userAddress from "@/views/UserAddress.vue";
import userPassword from "@/views/UserPassword.vue";
import PublishedGoods from "@/views/PublishedGoods.vue";
import publishedNeeds from "@/views/PublishedNeeds.vue";
import expertQuestion from "@/views/expertQuestion.vue";
import expertAppoint from "@/views/expertAppoint.vue";
import userBuy from "@/views/UserBuy.vue";
import userSell from "@/views/UserSell.vue";
import userFinance from "@/views/UserFinance.vue";
import PublishGoods from "@/views/PublishGoods.vue";
import PublishNeeds from "@/views/PublishNeeds.vue";
import PublishNav from "@/components/PublishNav.vue";
import HomeKnowledge from "@/views/HomeKnowledge.vue";
import KnowledgeDetail from "@/views/KnowledgeDetail.vue";



Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect:"/home"
  },
  {
    path:"/home",
    component:Home,
    children: [
      {
        path: 'knowledge',
        component: HomeKnowledge
      },
      {
        path: 'knowledge/:id',
        component: KnowledgeDetail
      },
      {
        path: "addMessage",
        component: PublishNav,
        children: [
          {
            path: 'publishgoods',
            component: PublishGoods
          },
          {
            path: 'publishneeds',
            component: PublishNeeds
          }
        ]
      },

      {
        path: '',
        redirect: 'front'
      },
      {
        path: 'front',
        component: FrontPage
      },
      {
        path: 'details',
        component: Details
      },
      {
        path: 'publish',
        component:publishGoods
      },
      {
        path: 'goods',
        component: HomeGoods
      },
      {
        path: 'shopcart',
        component: ShopCart
      },
        //朱鑫豪
      {
        path: "guide",
        component: HomeGuide
      },
      {
        path: "guide/:id",
        component: GuideDetail
      },
      {
        path: 'allExpert',
        component: AllExpert
      },
      {
        path: "question",
        component: QuestionForm
      },
      {
        path: "appointment",
        component: AppointmentForm
      },
// 新增：融资匹配页面路由（子路由）
      {
        path: "smartMatch", // 访问路径：/home/smart-match
        component: SmartMatchUser,
        meta: {
          title: "融资意向与推荐" // 页面标题
        }
      },
      {
        path: "financing",
        component: Financing
      },
      {
        path: "financingDetails",
        component: FinancingDetails,
      },
      {
        path: 'purchase',
        component: HomePurchase
      },
      {
        path:"purchaseDetails",
        component:purchaseDetails
      },
      {
        path: "aboutUs",
        component: AboutUs
      },





      {
        path:"user",
        component: User,
        children:[
          {
            path: '',
            redirect: 'userinfo'
          },
          {
            path: 'userinfo',
            component: UserInfo
          },
            {
              path: "userAddress",
              component: userAddress
            },
            {
              path:"userPassword",
              component: userPassword
            },
            {
              path: "publishedGoods",
              component: PublishedGoods
            },
            {
              path:"publishedNeeds",
              component:publishedNeeds
            },
            {
              path:"expertQuestion",
              component: expertQuestion
            },
            {
              path: "expertAppoint",
              component:expertAppoint
            },
            {
              path: "userBuy",
              component: userBuy
            },
            {
              path: "userSell",
              component: userSell
            },
            {
              path: "userFinance",
              component: userFinance
            }

        ]
      },
    ]
  },



  //注册
  {
    path:"/register",
    component:Register
  },
    //登录
  {
    path:"/login",
    component: Login
  }
]

const router = new VueRouter({


  routes,
  mode:"hash"
})

export default router
