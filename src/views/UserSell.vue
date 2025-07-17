<template>
  <div class="user-sell">
    <div class="sell" v-for="(item, index) in userSellList" :key="index">
      <div class="right-content">
        <div style="font-weight: bold">订单{{ index + 1 }}</div>
        <div class="right-item">
          姓名：<span class="item-text">{{ item.demandInitiator }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div style="display: flex">
          <div class="right-item" style="margin-right: 20px">
            创建时间：<span class="item-text">{{
              item.createTime | formatTimer
            }}</span>
          </div>
          <div class="right-item">
            更新时间：<span class="item-text">{{
              item.updateTime | formatTimer
            }}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center">
          <div class="right-item item-text address" style="margin-right: 20px">
            收货地址：{{ item.address }}
          </div>
          <div class="item-content">
            <span class="price" style="margin-right: 20px"
              >￥ {{ item.totalPrice }}</span
            >
            <el-tag
              :type="item.purchaseStatus === 0 ? 'danger' : 'success'"
              size="mini"
              >{{ item.purchaseStatus === 0 ? "未发货" : "已发货" }}</el-tag
            >
          </div>
        </div>
      </div>
    </div>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'sell'"></pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination1.vue";
import {findPurchaseSell} from "@/apis/purchase";

export default {
  components: {Pagination},
  data() {
    return {
      total: 0,//一共多少条
      pageSize: 4,//一页显示的条数
      userSellList: [],
      currentPage:0
    };
  },
  methods:{
    //获取子组件传递过来的数据
    getFromChildren(val){
      this.userSellList=val;
    },
    getData(){
      let params={
        currentPage:1,//当前页
        pageSize:this.pageSize,
        uid:JSON.parse(localStorage.getItem("user")).id
      }
      console.log("param",params)
      findPurchaseSell(params).then(res=>{
        if(res.code==200){
          this.userSellList=res.data
          this.total = res.pageData.total;
        }
      })
    }
  },
  filters: {
    formatTimer: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    },
  },
  mounted() {
    this.getData()
  }
};
</script>

<style lang="less" scoped>
.user-sell {
  margin: 0 auto;
  width: 900px;
  // display: flex;
  // flex-direction: row;
  // justify-content: flex-start;
  // flex-wrap: wrap;
  background: #fff;
  padding: 0px 20px;
  .sell {
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 20px 0 10px;
    height: 140px;
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    img {
      width: 200px;
      height: 180px;
      margin-right: 10px;
      border-radius: 6px;
    }
    .right-content {
      padding-top: 10px;
      .right-item {
        line-height: 25px;
        height: 25px;
        .item-text {
          color: #666;
        }
      }
      .address {
        /*超出的部分隐藏*/
        overflow: hidden;
        /*文字用省略号替代超出的部分*/
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
      .price {
        font-size: 16px;
        color: red;
      }
      .item-content {
        display: flex;
        justify-content: space-between;
        align-content: center;
        // margin-top: 5px;
      }
    }
  }
}
</style>