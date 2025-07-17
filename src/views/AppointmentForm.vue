<template>
  <div class="appointment-container">
    <h2 class="page-title">专家预约</h2>

    <el-form
        ref="appointmentForm"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="appointment-form"
    >
      <!-- 地址 -->
      <el-form-item label="地址" prop="address">
        <el-input
            v-model="formData.address"
            placeholder="请输入详细地址"
            maxlength="100"
            show-word-limit
        ></el-input>
      </el-form-item>

      <!-- 种植作物 -->
      <el-form-item label="种植作物" prop="plantCrop">
        <el-input
            v-model="formData.plantCrop"
            placeholder="请输入种植的作物名称"
            maxlength="50"
        ></el-input>
      </el-form-item>

      <!-- 作物详细 -->
      <el-form-item label="作物详细" prop="cropDetail">
        <el-input
            v-model="formData.cropDetail"
            placeholder="请输入作物的生长阶段、品种等详细信息"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
        ></el-input>
      </el-form-item>

      <!-- 作物条件 -->
      <el-form-item label="作物条件" prop="cropCondition">
        <el-input
            v-model="formData.cropCondition"
            placeholder="请输入作物当前的生长状况、问题等"
            type="textarea"
            rows="3"
        ></el-input>
      </el-form-item>

      <!-- 土壤条件 -->
      <el-form-item label="土壤条件" prop="soilCondition">
        <el-input
            v-model="formData.soilCondition"
            placeholder="请输入土壤类型、肥力、pH值等信息"
            type="textarea"
            rows="3"
        ></el-input>
      </el-form-item>

      <!-- 面积 -->
      <el-form-item label="面积" prop="area">
        <el-input
            v-model="formData.area"
            placeholder="请输入种植面积（如：5亩、100平方米）"
            maxlength="20"
        ></el-input>
      </el-form-item>

      <!-- 电话 -->
      <el-form-item label="电话" prop="phone">
        <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
            maxlength="11"
            oninput="value=value.replace(/[^\d]/g,'')"
        ></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交预约</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {submitAppointment} from "@/apis/appointment";// 导入预约API

export default {
  data() {
    return {
      formData: {
        address: '',         // 地址
        plantCrop: '',       // 种植作物
        cropDetail: '',      // 作物详细
        cropCondition: '',   // 作物条件
        soilCondition: '',   // 土壤条件
        area: '',            // 面积
        phone: ''            // 电话
      },
      // 表单验证规则（与后端校验对应）
      formRules: {
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        plantCrop: [
          { required: true, message: '请输入种植作物', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
        ]
        // 其他字段非必填，无需验证规则
      }
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      this.$refs.appointmentForm.validate(async (valid) => {
        if (valid) {
          try {
            // 调用后端预约接口（与Controller地址对应）
            const res = await submitAppointment(this.formData);
            if (res.code === 200) {
              this.$message.success('预约提交成功！专家将尽快联系您');
              this.goBack(); // 提交成功后返回上一页
            } else {
              this.$message.error(res.msg || '预约提交失败');
            }
          } catch (error) {
            console.error('预约接口调用失败:', error);
            this.$message.error('网络错误，请稍后重试');
          }
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs.appointmentForm.resetFields();
    },

    // 返回上一页
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.appointment-container {
  width: 800px;
  margin: 20px auto;
  padding: 0 20px;

  .page-title {
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  .appointment-form {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-button--primary {
    background-color: #67c23a;
    border-color: #67c23a;

    &:hover {
      background-color: #52c41a;
    }
  }
}
</style>