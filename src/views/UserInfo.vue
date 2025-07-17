<template>
  <div class="user-info">
    <!-- 仅在user.id存在时渲染头像组件，避免userId为undefined -->
    <div v-if="user.id">
      <user-avatar
          :cUserAvatar="userinfo.avatar"
          :userId="user.id"
          @update-avatar="handleAvatarUpdate"
      ></user-avatar>
    </div>
    <div v-else>
      <p>加载用户信息中...</p >
    </div>

    <el-form :model="userinfo" ref="ruleForm" label-width="80px" style="margin-top:40px">
      <el-form-item label="昵称：" prop="nickName">
        <el-input v-model="userinfo.nickName" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="realName">
        <el-input v-model="userinfo.realName" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="userinfo.phone" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="身份证：" prop="identityNum">
        <el-input v-model="userinfo.identityNum" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="userinfo.address" style="width:300px"></el-input>
      </el-form-item>
    </el-form>
    <el-button style="margin-left: 310px;" type="success" @click="updateInfo">修改</el-button>
  </div>
</template>

<script>
import UserAvatar from "../components/UserAvatar.vue";
import { findByIdInfo, updateUserInfo } from "@/apis/user";

export default {
  components: { UserAvatar },
  data() {
    return {
      user: {}, // 存储localStorage中的用户信息（含id）
      userinfo: {
        avatar: "",
        nickName: "",
        realName: "",
        phone: "",
        identityNum: "",
        address: "",
        id: ""
      }
    };
  },
  methods: {
    // 处理子组件传递的新头像地址
    handleAvatarUpdate(newAvatar) {
      this.userinfo.avatar = newAvatar;
      // 立即调用后端接口保存头像
      const params = {
        avatar: newAvatar,
        nickName: this.userinfo.nickName,
        realName: this.userinfo.realName,
        phone: this.userinfo.phone,
        identityNum: this.userinfo.identityNum,
        address: this.userinfo.address,
        id: this.user.id
      };
      updateUserInfo(params).then(res => {
        if (res.code === 200) {
          this.$message.success("修改成功！");
          // 更新缓存（确保后端数据与本地缓存一致）
          localStorage.setItem(`user_avatar_${this.user.id}`, this.userinfo.avatar || "");
        } else {
          this.$message.error(`修改失败：${res.message}`);
        }
      })
    },

    // 从接口获取用户详情
    findById() {
      if (!this.user.id) {
        console.log("123",this.user.id)
        console.error("未获取到用户ID，无法加载用户信息");
        return;
      }

      // 先读取本地缓存的头像（避免接口返回空时覆盖）
      const localAvatar = localStorage.getItem(`user_avatar_${this.user.id}`);

      // 调用接口获取用户信息
      findByIdInfo(this.user.id).then(res => {
        console.log(123132)
        if (res.code === 200) {
          this.userinfo = res.data;
          console.log("==",this.userinfo)
          // 接口头像为空时，用本地缓存的头像
          if (localAvatar && !this.userinfo.avatar) {
            this.userinfo.avatar = localAvatar;
          }
          // 同步缓存（确保接口返回新头像时更新缓存）
          localStorage.setItem(`user_avatar_${this.user.id}`, this.userinfo.avatar || "");
        } else {
          this.$message.error(`获取用户信息失败：${res.message}`);
        }
      })
    },

    // 提交修改用户信息
    updateInfo() {
      if (!this.userinfo.id) {
        this.$message.error("用户信息未加载完成，无法修改");
        return;
      }

      const params = {...this.userinfo};
      updateUserInfo(params).then(res => {
        if (res.code === 200) {
          this.$message.success("修改成功！");
          // 更新缓存（确保后端数据与本地缓存一致）
          localStorage.setItem(`user_avatar_${this.user.id}`, this.userinfo.avatar || "");
        } else {
          this.$message.error(`修改失败：${res.message}`);
        }
      })
    }
  },

  // 页面加载时初始化
  mounted() {
    // 从localStorage读取用户信息（含id）
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    // 加载用户详情
    this.findById();
  }
};
</script>

<style lang="less" scoped>
.user-info {
  margin: 0 auto;
  width: 900px;
  float: left;
  padding-left: 20px;
  background: #fff;
  min-height: 600px;
  padding-top: 20px;

  /* 加载状态样式 */

  p {
    margin-top: 20px;
    color: #666;
  }
}
</style>