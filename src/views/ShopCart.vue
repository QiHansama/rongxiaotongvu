<template>
  <div class="cart">
    <receiving-address ref="address"></receiving-address>
    <el-table
      ref="multipleTable"
      :data="orderGoods"
      stripe:true
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px;"
      :reserve-selection="true"
      :row-key="(row) => { return row.id }"
      @selection-change="handleSelectionChange"
      :row-class-name="rowClassName">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          <div class="goods">
            <img :src="scope.row.picture" alt=""/>
            <div class="info">
              <h4 class="title">{{ scope.row.title }}</h4>
              <p class="content">{{ scope.row.content }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="120">
        <template slot-scope="scope">
          <p class="price">￥{{ scope.row.price }}</p>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="180">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.byNum" @change="handleChange($event,scope.row)" :min="1" :max="1000000000" style="width:120px;"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <el-button type="info" class="delete-bar" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <div style="margin-top: 20px" class="cancle">
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>-->
    <div class="submit">
      <div class="total-price">
        <span>总价:￥{{ totalprice }}</span>
        <span class="selected-count">(已选 {{ selectedCount }} 件商品)</span>
      </div>
      <el-button type="danger" @click="payment" class="place-order">提交订单</el-button>
    </div>


    <!-- 支付确认对话框 -->
    <el-dialog
        title="确认支付"
        :visible.sync="paymentDialogVisible"
        width="30%"
        center>
      <div style="text-align: center;">
        <img src="@/assets/img/22weima.png" alt="支付二维码" style="width: 200px; height: 200px; margin-bottom: 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">请扫描上方二维码完成支付</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPayment">取消支付</el-button>
        <el-button type="primary" @click="confirmPayment">确认支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ReceivingAddress from "../components/ReceivingAddress.vue";
import {allDeleteCart, deleteCart, getCartInfo, updateCart} from "@/apis/cart";
import {addDingdan} from "@/apis/Dingdan";
import { addressOne} from "@/apis/address";

export default {
  inject: ["reload"],
  components: { ReceivingAddress },
  data() {
    return {
      id:0,
      cartInfo:[],
      orderGoods:[],
      dataArray: [],
      multipleSelection: [], // 存储选中的商品
      totalprice: "0",
      purchaseStatus:1,
      addressData:{},
      paymentDialogVisible: false,
      tempSelectedGoods: [], // 临时存储支付前的选中商品
      isPaying: false // 是否正在支付中
    };
  },
  watch:{
    multipleSelection(val1,val2){
      console.log('11111val1',val1)
      console.log('1111val2',val2)
    },
    dataArray(val){
      console.log('222222val1',val)

    }
  },
  computed: {
    selectedCount() {
      return this.multipleSelection.length;
    }
  },
  methods: {


    // 处理多选框选中项变化
    handleSelectionChange(val) {
      if (!this.isPaying) { // 非支付状态下才更新选中状态
        this.multipleSelection = val;
        this.calculateTotalPrice();
      }
    },
// 计算选中商品的总价
    calculateTotalPrice() {
      let total = 0;
      this.multipleSelection.forEach(item => {
        total += item.price * item.byNum;
      });
      this.totalprice = total.toFixed(2); // 保留两位小数
    },


    //确认支付
    confirmPayment() {
      this.purchaseStatus = 2
      this.payment()
      this.paymentDialogVisible = false;
      this.isPaying = false; // 支付完成，解除锁定

      if (this.isPaying===false){
      // 获取所有选中商品的ID数组
      const selectedIds = this.multipleSelection.map(item => item.orderId);
      console.log('选中的商品ID:', selectedIds);
      allDeleteCart(selectedIds).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message
          })
          this.getMyCartInfo();
        } else {
          this.$message({
            type: "error",
            message: res.message
          })
        }
      })
    }
      window.location.reload();
      this.calculateTotalPrice();
    },
// 取消支付
    cancelPayment(){
      this.paymentDialogVisible = false;
      this.isPaying = false; // 取消支付，解除锁定
    },
    //提交订单
    payment(){
      if(this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一件商品');
        return;
      }
      // 支付前保存当前选中状态
      this.tempSelectedGoods = [...this.multipleSelection];
      this.isPaying = true;

      this.paymentDialogVisible = true;
      let params={
        totalPrice: this.totalprice,
        purchaseType:1,
        purchaseStatus:this.purchaseStatus,
        address:this.addressData.addressDetail//地址还没写
      }
      addDingdan(params).then(res=>{
        if (res.code ===200){
          this.$message({
            type: "success",
            message: res.message
          })
          this.getMyCartInfo();
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },
//删除订单
    deleteClick(row){
      console.log(row)
      deleteCart(row.orderId).then(res=>{
        if (res.code ===200){
          this.$message({
            type: "success",
            message: res.message
          })
          this.getMyCartInfo();
          this.calculateTotalPrice();
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },

   /* /!**
     * 处理数量变化
     * @param {Number} newValue - 变化后的新值
     * @param {Object} row - 当前行的商品数据
     *!/*/
    handleChange(newValue,row){
      console.log("变化后的新值",newValue)
      console.log("当前行的商品数据",row)
         let params={
           productId:row.orderId,
           count:newValue
         }
          updateCart(params).then(res=>{

            if (res.code ===200){
              this.$message({
                type: "success",
                message: res.message
              })
              this.getMyCartInfo();
              // 数量修改后重新计算总价
              this.calculateTotalPrice();
            }else {
              this.$message({
                type:"error",
                message:res.message
              })
            }
        /*    if (res.code === 200) {
              this.$message.success(res.message);
              this.getMyCartInfo();
            } else {
              this.$message.error(res.message);
            }*/
          })
    },

    getOneaddress(){
      addressOne().then(res=>{
        this.addressData=res.data;
        this.$refs.address.updateAddressData(res.data);
      })
    },
    //点击购物车显示所有个人购物车的内容
    getMyCartInfo(){
      getCartInfo().then(res=>{
        this.orderGoods=res.data
/*        let total =0;
        this.orderGoods.forEach((item,index)=>{
          total+=(item.price) *(item.byNum);
        })
        this.totalprice=total;*/
        this.cartInfo = res.pageData;

      })


    }
  },
  mounted() {
    this.getMyCartInfo();
    this.getOneaddress();
  },
  created() {
    if (this.$store.state.token == "") {
      alert;
    }
    this.getOrderList()
    this.$store.commit("updateActiveIndex", "6");
    selectDefaultByOwnName({})
      .then((res) => {
        this.addressData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1100px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .goods {
    display: flex;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      border-radius: 4px;
      object-fit: cover;
    }

    .info {
      flex: 1;

      .title {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: #333;
        line-height: 1.4;
        font-weight: 500;
      }

      .content {
        margin: 0;
        font-size: 12px;
        color: #999;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
      }
    }
  }

  .price {
    color: #f56c6c;
    font-weight: bold;
    font-size: 16px;
  }

  .el-input-number {
    width: 120px;

    .el-input__inner {
      text-align: center;
    }
  }

  .delete-bar {
    padding: 7px 10px;
    font-size: 12px;
  }

  .submit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .total-price {
      font-size: 18px;
      color: #333;

      .price {
        font-size: 20px;
        margin-left: 5px;
      }

      .selected-count {
        font-size: 14px;
        color: #999;
        margin-left: 10px;
      }
    }

    .place-order {
      width: 120px;
      height: 40px;
      font-size: 16px;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

/* 支付弹窗样式优化 */
.el-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }

  .el-dialog__body {
    padding: 20px;

    img {
      display: block;
      margin: 0 auto 15px;
      border: 1px solid #eee;
      padding: 10px;
    }

    p {
      margin-bottom: 15px;
      color: #666;

      &:last-child {
        margin-bottom: 0;
        font-size: 18px;
        color: #f56c6c;
        font-weight: bold;
      }
    }
  }

  .el-dialog__footer {
    padding-top: 15px;
    border-top: 1px solid #eee;

    .el-button {
      padding: 10px 20px;
    }
  }
}
</style>