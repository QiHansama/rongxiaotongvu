<template>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="cPageSize"
      :total="cTotal"
      :current-page.sync="pageCode"
      @current-change="currentChange"
      v-if="cTotal != 0">
    </el-pagination>

  </div>
</template>

<script>
/*import { pagination } from "../api/pagination";*/
import {findAllGoodsOrder, findAllOrder} from "@/apis/order";
import {findComments} from "@/apis/comment";
export default {
  data() {
    return {
      pageGoods: [],
      totalPageNum : 0,
      pageCode:0,

      // pageSize: 6,
    };

  },
  mounted() {

    //计算页码
   // this.totalPage();

  },
  props: {
    cUrl: {
      type: String,//字符串类型
    },
    cTotal: {
      type: Number,//数字类型
    },
    cPageSize: {
      type: Number,
    },
  },
  methods: {

    currentChange(val){
      //val就是点击的那个页码
      this.pageCode =val
      console.log("当前页",val)
      let params={
        orderId:   this.$route.query.orderId,
        currentPage:val,
        PageSize: this.cPageSize
      }



      findAllOrder(params).then(res=>{
        console.log(res)
        this.pageGoods =res.data
        console.log(this.pageGoods)
        //子主键向父主键传递数据
        this.$emit("toParent",this.pageGoods)
      })


      findAllGoodsOrder(params).then(res=>{
        console.log(res)
        this.pageGoods =res.data
        console.log(this.pageGoods)
        //子主键向父主键传递数据
        this.$emit("toParent1",this.pageGoods)

      })


      findComments(params).then(res=>{
        console.log("res",res)
        this.pageGoods =res.data.comments
        console.log("pageGoods",this.pageGoods)
        //子主键向父主键传递数据
        console.log("子主键向父主键传递数据",this.pageGoods)
        this.$emit("toParent2",this.pageGoods)

      })





    },



/*
    totalPage(){
      if(this.cTotal % this.cPageSize===0){
       this.totalPageNum=this.cTotal/this.cPageSize ;
      }else {
        this.totalPageNum=(this.cTotal/this.cPageSize) +1;
      }
    },
*/



  },
};
</script>

<style lang="less" scoped>
.pagination {
  box-sizing: border-box;
  padding-left: 600px;
  width: 1500px;
  margin-top: 50px;
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  bottom: 50px;
  .el-pagination {
    width: 40px;
    height: 40px;
  }
}
</style>
