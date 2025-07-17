<template>
  <div class="add-address">
    <div class="title">我的收货地址</div>
    <el-button type="success" style="margin-top:10px;" @click="handleAdd">添加地址</el-button>

    <!-- 地址列表 -->
    <div v-for="item in allAddressData" :key="item.id" class="default-address-container">
      <div>
        <div class="address-item">收货人：{{ item.consignee }}</div>
        <div class="address-item">收货地址：{{ item.addressDetail }}</div>
        <div class="address-item">收货手机号：{{ item.phone }}</div>
      </div>
      <div class="right-btn">
        <el-tag v-if="item.isDefault" type="success" class="mr-2">默认收货地址</el-tag>
        <div class="marginR20" @click="handleEdit(item)">编辑</div>
        <div class="marginR20" @click="handleDel(item)">删除</div>
      </div>
    </div>

    <!-- 1. 添加地址弹窗 -->
    <el-dialog title="添加地址" :visible.sync="showAddDialog" width="580px" :before-close="closeAddDialog">
      <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="收货人：">
          <el-input v-model="addForm.consignee"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：">
          <el-input v-model="addForm.addressDetail"></el-input>
        </el-form-item>
        <el-form-item label="收货手机号：">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-checkbox style="float:right;" v-model="addForm.isDefault">设为默认地址</el-checkbox>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取消</el-button>
        <el-button type="success" @click="submitAdd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 2. 编辑地址弹窗 -->
    <el-dialog title="编辑地址" :visible.sync="showEditDialog" width="580px" :before-close="closeEditDialog">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="收货人：">
          <el-input v-model="editForm.consignee"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：">
          <el-input v-model="editForm.addressDetail"></el-input>
        </el-form-item>
        <el-form-item label="收货手机号：">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-checkbox style="float:right;" v-model="editForm.isDefault">设为默认地址</el-checkbox>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="success" @click="submitEdit">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { addressAdd, addressAll, addressDelete, addressUpdate } from "@/apis/address";

export default {
  data() {
    return {
      // 添加地址表单数据
      addForm: {
        consignee: "",
        phone: "",
        addressDetail: "",
        isDefault: false,
        uid: ""
      },
      // 编辑地址表单数据
      editForm: {
        id: "", // 编辑时需要地址ID
        consignee: "",
        phone: "",
        addressDetail: "",
        isDefault: false,
        uid: ""
      },
      allAddressData: [], // 所有地址列表
      showAddDialog: false, // 添加弹窗开关
      showEditDialog: false, // 编辑弹窗开关
      user: {}, // 用户信息
    };
  },
  methods: {
    // 获取所有地址
    findAllAddress() {
      if (!this.user.id) return;
      addressAll(this.user.id).then(res => {
        this.allAddressData = res.data || [];
      });
    },

    // 打开添加弹窗
    handleAdd() {
      this.showAddDialog = true;
      // 重置添加表单
      this.addForm = {
        consignee: "",
        phone: "",
        addressDetail: "",
        isDefault: false,
        uid: this.user.id
      };
    },

    // 提交添加地址
    submitAdd() {
      addressAdd(this.addForm).then(res => {
        if (res.code === 200) {
          this.$message.success("添加成功");
          this.showAddDialog = false;
          this.findAllAddress(); // 刷新列表
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 关闭添加弹窗
    closeAddDialog() {
      this.showAddDialog = false;
    },

    // 打开编辑弹窗（传入当前地址数据）
    handleEdit(item) {
      this.showEditDialog = true;
      // 给编辑表单赋值
      this.editForm = {
        id: item.id,
        consignee: item.consignee,
        phone: item.phone,
        addressDetail: item.addressDetail,
        isDefault: item.isDefault,
        uid: this.user.id
      };
    },

    // 提交编辑地址
    submitEdit() {
      addressUpdate(this.editForm).then(res => {
        if (res.code === 200) {
          this.$message.success("修改成功");
          this.showEditDialog = false;
          this.findAllAddress(); // 刷新列表
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 关闭编辑弹窗
    closeEditDialog() {
      this.showEditDialog = false;
    },

    // 删除地址
    handleDel(item) {
      this.$confirm("确定删除该地址吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        addressDelete(item.id).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.findAllAddress(); // 刷新列表
          } else {
            this.$message.error(res.message);
          }
        });
      });
    }
  },
  mounted() {
    // 获取本地用户信息
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.findAllAddress(); // 加载地址列表
    } else {
      this.$message.warning("请先登录");
    }
  }
};
</script>

<style lang="less" scoped>
.add-address {
  width: 900px;
  float: left;
  padding: 20px;
  background: #fff;
  min-height: 100%;
  .title {
    border-bottom: 1px solid #f2f2f2;
    padding: 10px 0px;
    font-size: 18px;
  }
}
.default-address-container {
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 10px 20px;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  .address-item {
    line-height: 30px;
    height: 30px;
    margin-right: 50px;
  }
  .right-btn {
    display: flex;
    align-items: center; // 垂直居中
    .marginR20 {
      margin-right: 20px;
      cursor: pointer;
      color: #67c23a;
      &:hover {
        color: #035d1c;
        text-decoration: underline;
      }
    }
  }
}
</style>