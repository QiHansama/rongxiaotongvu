<template>
  <div class="pagination">
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="this.cPageSize"
        :total="this.cTotal"
        :current-page.sync="pageCode"
        @current-change="currentChange"
        v-if="this.cTotal != 0">
    </el-pagination>
  </div>
</template>

<script>
import {findAllNeeds1, findAllOrders1} from "@/apis/order";
import {findAllFinance} from "@/apis/finance";
import {findPurchaseBuy, findPurchaseSell} from "@/apis/purchase";
import {findAllAppointment} from "@/apis/appointment";
import {findAllQuestion} from "@/apis/question";

export default {
  data() {
    return {
      TableType:"",
      questionArray:[],
      appointArray:[],
      pageGoods: [],
      userSellList:[],
      pageNeeds:[],
      FinanceAllData:[],
      userBuyList: [],
      // totalPageNum:0,
      pageCode:0//页码
    };
  },
  mounted() {
    //计算 页码
    // this.totalPage()
  },
  props: {
    cTotal: {
      type: Number,
    },
    cPageSize: {
      type: Number,
    },
    cTableType:{
      type: String,
    }
  },
  methods: {
    currentChange(val) {
      //val 就是点击的那个页码
      this.pageCode=val
      console.log("val",val)
      let params = {
        currentPage: val,//当前页
        pageSize: this.cPageSize
      }
      if(this.cTableType=="order"){
        findAllOrders1(params).then(res => {
          this.pageGoods=res.data
          //子组件向父组件传数据
          this.$emit("toParent",this.pageGoods)
          this.$store.commit("updateOrder", JSON.parse(res.data.orderId));
        });
      }
      if(this.cTableType=="finance"){
        findAllFinance(params).then(res=>{
          this.FinanceAllData=res.data
          this.$emit("toParent",this.FinanceAllData)
        })
      }
      if(this.cTableType=="needs"){
        findAllNeeds1(params).then(res=>{
          this.pageNeeds=res.data
          this.$emit("toParent",this.pageNeeds)
        })
      }
      if(this.cTableType=="sell"){
        let param= {
          currentPage: val,//当前页
          pageSize: this.cPageSize,
          uid:JSON.parse(localStorage.getItem("user")).id
        }
        findPurchaseSell(param).then(res=>{
          this.userSellList=res.data
          this.$emit("toParent",this.userSellList)
        })
      }
      if(this.cTableType=="buy"){
        let param= {
          currentPage: val,//当前页
          pageSize: this.cPageSize,
          uid:JSON.parse(localStorage.getItem("user")).id
        }
        findPurchaseBuy(param).then(res=>{
          this.userBuyList=res.data
          this.$emit("toParent",this.userBuyList)
        })
      }
      if(this.cTableType=="appointment"){
        findAllAppointment(params).then(res=>{
          this.appointArray=res.data
          this.$emit("toParent",this.appointArray)
        })
      }
      if(this.cTableType=="question"){
        findAllQuestion(params).then(res=>{
          this.questionArray=res.data
          this.$emit("toParent",this.questionArray)
        })
      }
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  width: 100%; // 移除固定宽度1500px，改为自适应
  margin: 40px auto; // 居中显示
  text-align: center; // 分页按钮居中
  padding-left: 200px; // 移除固定左偏移400px
  .el-pagination {
    width: 40px;
    height: 40px;
  }
}
</style>