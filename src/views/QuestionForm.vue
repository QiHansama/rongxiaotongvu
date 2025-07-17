<template>
  <div class="question-form-container">
    <div class="form-wrapper">
      <h2 class="form-title">提交问题</h2>

      <!-- 提问表单 -->
      <el-form
          ref="questionForm"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="el-form"
      >
        <!-- 标题输入 -->
        <el-form-item label="标题" prop="title">
          <el-input
              v-model="formData.title"
              placeholder="请输入标题"
              maxlength="50"
              show-word-limit
          ></el-input>
        </el-form-item>

        <!-- 内容输入 -->
        <el-form-item label="内容" prop="content">
          <el-input
              v-model="formData.content"
              placeholder="请输入详细问题内容"
              type="textarea"
              rows="5"
              maxlength="500"
              show-word-limit
          ></el-input>
        </el-form-item>

        <!-- 作物名称 -->
        <el-form-item label="作物名称" prop="plantName">
          <el-input
              v-model="formData.plantName"
              placeholder="请输入农作物名称"
              maxlength="20"
          ></el-input>
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input
              v-model="formData.phone"
              placeholder="请输入联系人手机号"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g,'')"
          ></el-input>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitQuestion">提交问题</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { submitQuestion } from '@/apis/questions'; // 导入提交问题的API

export default {
  data() {
    return {
      // 表单数据（与后端UserQuestionDTO字段对应）
      formData: {
        title: '',         // 标题
        content: '',       // 内容
        plantName: '',     // 作物名称
        phone: ''          // 手机号
      },
      // 表单验证规则（与后端校验逻辑对应）
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, message: '标题长度不能少于2个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入问题内容', trigger: 'blur' },
          { min: 5, message: '内容长度不能少于5个字符', trigger: 'blur' }
        ],
        plantName: [
          { required: true, message: '请输入作物名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 提交表单
    submitQuestion() {
      this.$refs.questionForm.validate(async (valid) => {
        if (valid) {
          try {
            // 调用后端提交接口（与后端@PostMapping("/submit")对应）
            const res = await submitQuestion(this.formData);
            if (res.code === 200) {
              this.$message.success('问题提交成功！');
              this.goBack(); // 提交成功后返回列表页
            } else {
              this.$message.error(res.msg || '提交失败，请重试');
            }
          } catch (error) {
            this.$message.error('网络错误，提交失败');
          }
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.questionForm.resetFields();
    },
    // 返回上一页
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.question-form-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.form-wrapper {
  width: 700px;
  margin: 0 auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-title {
  margin: 0 0 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 20px;
}

.el-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}

// 保持与项目中专家列表按钮样式一致
::v-deep .el-button--primary {
  background-color: #67c23a;
  border-color: #67c23a;

  &:hover {
    background-color: #52c41a;
    border-color: #52c41a;
  }
}
</style>