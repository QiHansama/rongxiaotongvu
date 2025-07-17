<template>
  <div class="user-password">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码：" prop="name">
        <el-input
          v-model="ruleForm.password"
          style="width: 300px" show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="name">
        <el-input
          v-model="ruleForm.newPassword"
          style="width: 300px" show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="name">
        <el-input
          v-model="ruleForm.confirmNewPassword"
          style="width: 300px" show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      style="margin-left: 300px"
      type="success"
      @click="changePasswordClick"
      >修改密码</el-button
    >
  </div>
</template>

<script>
import {updatePassword} from "@/apis/user";

export default {
  data() {
    return {
      user: {},
      ruleForm: {
        id:"",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },
  methods: {
    changePasswordClick() {
      if (this.ruleForm.newPassword === this.ruleForm.confirmNewPassword) {
        updatePassword({
          id:this.user.id,
          password: this.ruleForm.password,
          newPassword: this.ruleForm.newPassword,
          confirmNewPassword:this.ruleForm.confirmNewPassword
        }).then((res) => {
          if (res.code===200) {
           this.$message({
             type:"success",
             message:res.message
           })
            //修改密码后退出登录
            this.$store.commit("loginUserNickname", "");
            this.$store.commit("removeStorage");
            this.$router.push("/home");
          } else {
            this.$message({
              type:"error",
              message:res.message
            })
          }
        });
      } else {
        alert("新密码与确认密码不一致");
      }
    },
  },
  // 页面加载时初始化
  mounted() {
    // 从localStorage读取用户信息（含id）
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
};
</script>

<style lang="less" scoped>
.user-password {
  width: 900px;
  float: left;
  padding: 20px;
  background: #fff;
  height: 100%;
}
</style>