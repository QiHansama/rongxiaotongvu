<template>
  <div>
    <div v-for="(item, index) in FinanceAllData" :key="index">
      <el-descriptions
          class="margin-top"
          :column="2"
          title="我的融资信息"
          border
          style="width: 100%"
      >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ item.realName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ item.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            身份证号
          </template>
          {{ item.num }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            融资金额
          </template>
          {{ item.money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            银行
          </template>
          {{ getBankName(item.bankId) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-release"></i>
            利率
          </template>
          {{ item.rate }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-warning-outline"></i>
            申请状态
          </template>
          <template>
            <el-tag type="danger" v-show="item.status === 0">申请中</el-tag>
            <el-tag type="danger" v-show="item.status === 1">驳回</el-tag>
            <el-tag type="danger" v-show="item.status === 2">通过</el-tag>
          </template>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            联合融资人1姓名
          </template>
          {{ item.partner }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联合融资人1手机号
          </template>
          {{ item.partnerPhone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            联合融资人1身份证
          </template>
          {{ item.partnerNum }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            联合融资人2姓名
          </template>
          {{ item.partner2 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联合融资人2手机号
          </template>
          {{ item.partnerPhone2 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            联合融资人2身份证
          </template>
          {{ item.partnerNum2 }}
        </el-descriptions-item>
        <template slot="extra">
          <el-button
              type="warning"
              size="small"
              @click="updateFinaceShow(item)"
          >修改
          </el-button
          >
          <el-button
              type="danger"
              size="small"
              @click="deleteFinace(item)"
          >删除
          </el-button
          >
        </template>
      </el-descriptions>
    </div>
    <el-dialog
        title="修改"
        :visible.sync="showUpdate"
        width="580px"
        :before-close="closeUpdate"
    >
      <el-form
          v-model="FinanceData"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <strong style="color: green">修改融资信息：</strong>
        <el-form-item label="融资额度：" prop="money">
          <el-input v-model="FinanceData.money"></el-input>
        </el-form-item>

        <el-form-item label="意向借款期：" prop="repaymentPeriod">
          <el-select v-model="value" placeholder="意向借款期：">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <strong style="color: green">融资人：</strong>
        <el-form-item label="姓名：" prop="realName">
          <el-input v-model="FinanceData.realName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="FinanceData.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idNum">
          <el-input v-model="FinanceData.num"></el-input>
        </el-form-item>

        <strong style="color: green">合伙人1：</strong>
        <el-form-item label="姓名：" prop="combinationName1">
          <el-input v-model="FinanceData.partner"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="combinationPhone1">
          <el-input v-model="FinanceData.partnerPhone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="combinationIdnum1">
          <el-input v-model="FinanceData.partnerNum"></el-input>
        </el-form-item>
        <strong style="color: green">合伙人2：</strong>
        <el-form-item label="姓名：" prop="combinationName1">
          <el-input v-model="FinanceData.partner2"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="combinationPhone1">
          <el-input v-model="FinanceData.partnerPhone2"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="combinationIdnum1">
          <el-input v-model="FinanceData.partnerNum2"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdate">取 消</el-button>
        <el-button type="success" @click="updateFinace">确定</el-button>
      </span>
    </el-dialog>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'finance'"></pagination>
  </div>
</template>
<script>
import {deleteFinanceById, findAllFinance, updateFinance} from "@/apis/finance";
import Pagination from "@/components/Pagination1.vue";

export default {
  components: {Pagination},
  data() {
    return {
      currentPage:1,
      finance:"",
      total: 0,//一共多少条
      pageSize: 2,//一页显示的条数
      size: "",
      title:"",
      FinanceAllData: [],
      FinanceData: {
        financeId: "",
        bankName: "",
        bankId: "",
        realName: "",
        phone: "",
        idNum: "",
        money: "",
        repayment: "",
        combinationName1: null,
        combinationPhone1: null,
        combinationIdnum1: null,
        combinationName2: null,
        combinationPhone2: null,
        combinationIdnum2: null,
      },
      showUpdate: false,
      options: [
        {
          value: 6,
          label: "六个月",
        },
        {
          value: 12,
          label: "一年",
        },
        {
          value: 24,
          label: "两年",
        },
        {
          value: 36,
          label: "三年",
        },
      ],
      value: "",
    };
  },
  methods: {
    getBankName(bankId) {
      if (bankId == "1001") {
        return "日照银行";
      }
      if (bankId == "1002") {
        return "青岛银行";
      }
      if (bankId == "1003") {
        return "中国银行";
      }
      if (bankId == "1004") {
        return "中国工商银行";
      }
      if (bankId == "1005") {
        return "华夏银行";
      }
      if (bankId == "1006") {
        return "中国建设银行";
      }
      if (bankId == "1007") {
        return "浦发银行";
      }
      if (bankId == "1008") {
        return "中国平安银行";
      }
      if (bankId == "1009") {
        return "中国民生银行";
      }

    },
    getFromChildren(val){
      this.FinanceAllData=val;
      console.log("val",this.FinanceAllData)
    },
    getData() {
      let params={
        currentPage:this.currentPage,//当前页
        pageSize:this.pageSize
      }
      findAllFinance(params).then(res=>{
        if(res.code==200){
          this.FinanceAllData=res.data
          console.log("data",this.FinanceAllData)
          this.total=res.pageData.total
          console.log("total",this.total)
        }
      })
    },
    updateFinaceShow(item) {
      this.showUpdate=true
      this.FinanceData={...item}

    },
    updateFinace() {
      let params={...this.FinanceData}
      updateFinance(params).then(res=>{
        if(res.code==200){
          this.$message({
            type:"success",
            message:res.message
          })
          this.showUpdate=false
          this.getData()
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
          this.showUpdate=false
          this.getData()
        }
      })
    },
    deleteFinace(item) {
      deleteFinanceById(item.id).then(res=>{
        if (res.code==200){
          this.$message({
            type:"success",
            message:res.message
          })
          this.getData()
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
          this.getData()
        }
      })
    },
    closeUpdate() {
      this.showUpdate = false;
    },
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
.el-descriptions {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
</style>