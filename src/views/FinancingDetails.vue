<template>
  <div class="details-box2">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 银行详情数据展示（字段名已修正） -->
    <div v-if="!loading && bankInfo.id" class="bank-info">
      <!-- 1. 银行名称 -->
      <div class="title">
        <strong>{{ bankInfo.name }}</strong>
      </div>

      <!-- 2. 银行介绍 -->
      <div class="field-item">
        <span class="field-label">银行介绍：</span>
        <span class="field-value">{{ bankInfo.introduce || '暂无介绍' }}</span>
      </div>

      <!-- 3. 银行电话 -->
      <div class="field-item">
        <span class="field-label">联系电话：</span>
        <span class="field-value">{{ bankInfo.phone || '暂无电话' }}</span>
      </div>

      <!-- 4. 融资金额范围（字段名：money） -->
      <div class="field-item">
        <span class="field-label">融资金额范围：</span>
        <span class="field-value">{{ bankInfo.money || '暂无数据' }}</span>
      </div>

      <!-- 5. 年利率 -->
      <div class="field-item">
        <span class="field-label">年利率：</span>
        <span class="field-value">{{ bankInfo.rate ? bankInfo.rate + '%' : '暂无数据' }}</span>
      </div>

      <!-- 6. 还款期限（字段名：repayment） -->
      <div class="field-item">
        <span class="field-label">还款期限：</span>
        <span class="field-value">{{ bankInfo.repayment || '暂无数据' }}</span>
      </div>

      <!-- 贷款类型选择 -->
      <div class="title loan-type-title">
        <br />
        <strong>请选择贷款类型</strong><br />
        <el-button type="success" @click="individual" v-if="!Already">个人贷款</el-button>
        <el-button type="success" @click="combination" v-if="!Already">组合贷款</el-button>
        <el-button type="warning" v-if="Already" disabled>已申请贷款</el-button>
      </div>
    </div>

    <!-- 个人贷款弹窗 -->
    <el-dialog
        :title="title"
        :visible.sync="showIndividual"
        width="580px"
        :before-close="closeIndividual"
    >
      <el-form
          v-model="individualForm"
          ref="individualForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="individualForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="申请金额：" prop="money">
          <el-input v-model="individualForm.money" placeholder="请输入申请金额"></el-input>
        </el-form-item>
        <el-form-item label="年利率：" prop="rate">
          <span class="rate-value">{{ bankInfo.rate }}%</span>
        </el-form-item>
        <el-form-item label="借款期限：" prop="repayment">
          <el-select v-model="individualForm.repayment" placeholder="选择借款期限">
            <el-option
                v-for="item in termOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="individualForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idNum">
          <el-input v-model="individualForm.idNum" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="上传材料：" prop="photo">
          <el-upload
              class="upload-demo"
              drag
              :action="upurl"
              :limit="3"
              :headers="upheaders"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :file-list="fileList"
              ref="upload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="image-container">
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeIndividual">取消</el-button>
        <el-button type="success" @click="handleApplyOne">申请</el-button>
      </span>
    </el-dialog>

    <!-- 组合贷款弹窗 -->
    <el-dialog
        :title="title"
        :visible.sync="showCombination"
        width="580px"
        :before-close="closeCombination"
    >
      <el-form
          v-model="combinationForm"
          ref="combinationForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <strong style="color: green">申请信息：</strong>
        <el-form-item label="申请金额：" prop="money">
          <el-input v-model="combinationForm.money" placeholder="请输入申请金额"></el-input>
        </el-form-item>
        <el-form-item label="年利率：" prop="rate">
          <span class="rate-value">{{ bankInfo.rate }}%</span>
        </el-form-item>
        <el-form-item label="借款期限：" prop="repayment">
          <el-select v-model="combinationForm.repayment" placeholder="选择借款期限">
            <el-option
                v-for="item in termOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 用户1信息 -->
        <strong style="color: green">用户1：</strong>
        <el-form-item label="姓名：" prop="realName">
          <el-input v-model="combinationForm.partner" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="combinationForm.partnerPhone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idNum">
          <el-input v-model="combinationForm.partnerNum" placeholder="请输入身份证号"></el-input>
        </el-form-item>

        <!-- 用户2信息 -->
        <strong style="color: green">用户2：</strong>
        <el-form-item label="姓名：" prop="combinationName1">
          <el-input v-model="combinationForm.partner2" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="combinationPhone1">
          <el-input v-model="combinationForm.partnerPhone2" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="combinationIdnum1">
          <el-input v-model="combinationForm.partnerNum2" placeholder="请输入身份证号"></el-input>
        </el-form-item>

        <el-form-item label="上传材料：" prop="photo">
          <el-upload
              class="upload-demo"
              drag
              :action="upurl"
              :limit="3"
              :headers="upheaders"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :file-list="fileList"
              ref="upload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCombination">取消</el-button>
        <el-button type="success" @click="handleApplyMulti">申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBankById } from "@/apis/bank";
import {addFinanceName} from "@/apis/finance";
/*import {addFinanceName} from "@/apis/financier";*/

export default {
  data() {
    return {
      bankId: this.$route.query.bankId, // 从路由获取银行ID
      loading: false,
      // 银行数据（仅保留6个展示字段）
      bankInfo: {
        id: "",
        name: "", // 银行名称
        introduce: "", // 银行介绍
        phone: "", // 银行电话
        money: "", // 融资金额范围
        rate: "", // 年利率
        repayment: "" // 还款期限
      },
      // 借款期限选项
      termOptions: [
        { value: 6, label: "六个月" },
        { value: 12, label: "一年" },
        { value: 24, label: "两年" },
        { value: 36, label: "三年" }
      ],
      // 个人贷款表单
      individualForm: {
        name: "",
        money: "",
        repayment: "",
        phone: "",
        idNum: "",
        file:"",
        bankId:"",
        uid:""
      },
      // 组合贷款表单
      combinationForm: {
        bankId:"",
        uid:"",
        partner:"",
        partnerPhone:"",
        money: "",
        partnerNum:"",
        repayment: "",
        partner2:"",
        partnerPhone2:"",
        partnerNum2:"",
        file:""
      },
      // 文件上传相关
      fileList: [],
      upheaders: {
          "token":window.localStorage.getItem("token")
      },
      upurl: "http://localhost:9003/order/upload",
      // 状态控制
      Already: false,
      title: "个人贷款申请",
      showIndividual: false,
      showCombination: false
    };
  },

  mounted() {
    let item =sessionStorage.getItem("url")
    this.combinationForm.file=item
    this.individualForm.file=item
    this.fetchBankDetail();
    this.checkAppliedStatus();
  },

  methods: {
    // 获取银行详情（仅加载需要的字段）
    // 获取银行详情（重点：确保接口数据正确映射到money和repayment）
    async fetchBankDetail() {
      if (!this.bankId) {
        this.$message.error("参数错误，无法获取银行信息");
        return;
      }
      this.loading = true;
      try {
        const res = await getBankById(this.bankId);
        if (res.code === 200) {
          const data = res.data;
          // 明确将接口数据映射到对应字段（重点修正）
          this.bankInfo = {
            id: data.id,
            name: data.name || "",
            introduce: data.introduce || "",
            phone: data.phone || "",
            money: data.money || "", // 直接使用接口返回的money字段
            rate: data.rate || "",
            repayment: data.repayment || "" // 直接使用接口返回的repayment字段
          };
        } else {
          this.$message.error(res.message || "获取银行信息失败");
        }
      } catch (err) {
        console.error("获取银行详情失败：", err);
        this.$message.error("网络错误，请重试");
      } finally {
        this.loading = false;
      }
    },

    // 检查是否已申请（兼容写法）
    async checkAppliedStatus() {
      try {
        const res = await selectFinaceUser({ bank_id: this.bankId });
        // 替换可选链为传统判断
        if (res.flag && res.data && res.data.applied) {
          this.Already = true;
        }
      } catch (err) {
        console.log("检查申请状态失败：", err);
      }
    },

    // 打开个人贷款弹窗
    individual() {
      this.title = "个人贷款申请";
      this.showIndividual = true;
      this.showCombination = false;
    },

    // 打开组合贷款弹窗
    combination() {
      this.title = "组合贷款申请";
      this.showCombination = true;
      this.showIndividual = false;
    },

    // 关闭弹窗
    closeIndividual() {
      this.showIndividual = false;
      this.$store.state.mutiFile = "";
    },
    closeCombination() {
      this.showCombination = false;
      this.$store.state.mutiFile = "";
    },

    // 提交个人贷款申请
    handleApplyOne() {
      this.showIndividual = true;
      var params={
        realName: this.individualForm.name,
        money: this.individualForm.money,
        repayment:this.individualForm.repayment,
        phone: this.individualForm.phone,
        num: this.individualForm.idNum,
        bankId:this.$route.query.bankId,
        uid:JSON.parse(localStorage.getItem("user")).id,
        file:this.individualForm.file
      }
      addFinanceName(params).then(res=>{
        if(res.code==200){
          this.$message({
            type:"success",
            message:res.message
          })
          this.showIndividual = false;
        }else {
          this.$message({
            type:"success",
            message:res.message
          })
          this.showIndividual = false;
        }
      })
    },
    // 提交组合贷款申请
    handleApplyMulti() {
      let param={
        bankId:this.$route.query.bankId,
        uid:JSON.parse(localStorage.getItem("user")).id,
        partner:this.combinationForm.partner,
        partnerPhone:this.combinationForm.partnerPhone,
        money: this.combinationForm.money,
        partnerNum:this.combinationForm.partnerNum,
        repayment: this.combinationForm.repayment,
        partner2:this.combinationForm.partner2,
        partnerPhone2:this.combinationForm.partnerPhone2,
        partnerNum2:this.combinationForm.partnerNum2,
        file:this.combinationForm.file
      }
      addFinanceName(param).then(res=>{
          if (res.code==200){
            this.$message({
              type:"success",
              message:res.message
            })
            this.showCombination=false
          }else {
            this.$message({
              type:"error",
              message:res.message
            })
            this.showCombination=false
          }
      })
    },

    // 文件上传变更
    handleChange(file, fileList) {

    },

    // 文件上传成功
    handleSuccess(res, file, fileList) {
      // 1. 获取上传成功的文件路径（假设res.data为文件URL）
      const fileUrl = res.data;
      // 2. 根据当前打开的弹窗类型，赋值给对应表单
      if (this.showIndividual) {
        // 个人贷款表单
        this.individualForm.file = fileUrl;
      } else if (this.showCombination) {
        // 组合贷款表单（新增逻辑）
        this.combinationForm.file = fileUrl;
      }
      // 3. 更新文件列表（可选，用于展示已上传文件）
      this.fileList = fileList;
    },

    // 移除上传文件（兼容写法）
    handleRemove(file, fileList) {
      this.fileList = fileList;
      // 替换可选链为传统判断
      const fileName = file.response && file.response.data;
      if (fileName) {
        this.$store.state.mutiFile = this.$store.state.mutiFile.replace(fileName + " ", "");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.details-box2 {
  width: 1100px;
  margin: 10px auto;
  background: #fff;
  min-height: 400px;
  padding: 20px 30px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 6px;

  .loading {
    text-align: center;
    padding: 50px 0;
    color: #666;
    font-size: 16px;
  }

  .bank-info {
    line-height: 1.6;
  }

  .title {
    font-size: 22px;
    color: #2c3e50;
    margin: 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
    font-weight: 600;
  }

  .field-item {
    margin: 15px 0;
    padding: 10px 0;
    border-bottom: 1px dashed #f0f0f0;

    .field-label {
      display: inline-block;
      width: 120px;
      color: #666;
      font-weight: 500;
      vertical-align: top;
    }

    .field-value {
      color: #333;
      max-width: calc(100% - 120px);
      display: inline-block;
    }
  }

  // 贷款类型选择区样式
  .loan-type-title {
    margin-top: 30px;
    text-align: center;

    strong {
      display: block;
      margin-bottom: 15px;
      color: #34495e;
    }

    .el-button {
      margin: 0 10px;
      padding: 8px 24px;
    }
  }

  // 弹窗表单样式
  .demo-ruleForm {
    margin-top: 10px;

    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .rate-value {
    color: #e74c3c;
    font-weight: bold;
  }

  .upload-demo {
    margin-top: 8px;
    border: 1px dashed #ddd;
    padding: 20px;
    border-radius: 4px;
  }

  .dialog-footer {
    text-align: center;
    padding: 10px 0;
  }
}
</style>