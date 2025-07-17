<template>
  <div class="login-box">
    <div class="login">
      <div class="header">
        <!-- <a href="/">
        <img src="/public/img/logo3.png" alt="" />
      </a> -->
        <h1>用户登录</h1>
      </div>
      <div id="login_form">
        <div class="form-group">
          <label for="username">帐号</label>
          <input
            type="text"
            class="form-control"
            id="username"
            name="username"
            placeholder="请输入账号"
            v-model="acount"
          />
        </div>
        <div class="form-group">
          <label for="">密码</label>

          <input
            type="password"
            class="form-control"
            id=""
            name="password"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <div class="checkbox">
          <label> <input type="checkbox" />记住密码 </label>
        </div>
        <button class="btn btn-success btn-block" @click="loginBtn">
          登录
        </button>
      </div>
      <div class="message">
        <p>没有账号? <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
/*import { userLogin } from "../api/user";*/
import {request} from "@/utils/request";
import {userLogin} from "@/apis/user";
export default {
  name: "Login",
  data() {
    return {
      acount: "",
      password: "",
    };
  },
  methods: {
   /* loginBtn(){
      request({
        method:"post",
        data:{
          userName:this.acount,
          password:this.password
        },
        url:"/user/Login"
      }).then(res=>{
        console.log("res",res)
      })
    }*/
    loginBtn(){
      let params={
        userName:this.acount,
        password:this.password
      }
      userLogin(params).then(result=>{
        if (result.code===200){
          //显示登录成功
          this.$message({
            type:"success",//成功响应
            message:result.message
          });
          //存储用户数据和 token
          localStorage.setItem("user",JSON.stringify(result.data));
          localStorage.setItem("token",result.data.token)
          //存储登录用户的名称 vuex存储
          this.$store.commit("loginUserNickname",result.data.userName)
       //跳转到主页
          this.$router.replace("/")
        }else {
          this.$message({
            type:"error",//失败响应
            message:result.message
          });
        }
        console.log("result",result)
      });
    }
  },
/*  mounted() {
    //刷新页面
    location.reload()
  },*/
  created() {},
};
</script>

<style lang="less" scoped>
@import url("../../node_modules/bootstrap/dist/css/bootstrap.css");

.login-box {
  box-sizing: border-box;
   //width: 1897px;
  height: 735px;
  padding-top: 150px;
  background: url("../assets/img/rice.png");
  background-size: 100% 100%;
  .login {
    width: 340px;
    margin: 0 auto;
    color: #333;
    .header {
      height: 40px;
      text-align: center;
      h1 {
        font-size: 26px;
        margin: 0;
        color: white;
      }
    }
    #login_form {
      padding: 20px;
      margin-bottom: 15px;
      border: 1px solid #d8dee2;
      border-radius: 5px;
      background-color: #fff;
    }
    .message {
      padding: 10px;
      padding-bottom: 0;
      color: white;
      border: 1px solid #d8dee2;
      border-radius: 5px;
      text-align: center;
    }
  }
}
</style>
