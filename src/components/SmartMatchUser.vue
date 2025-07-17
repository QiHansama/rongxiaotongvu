<template>
  <div class="add-address">
    <!-- 按钮区域保持不变 -->
    <div class="title">
      <el-button
          type="success"
          style="margin-top: 10px"
          v-if="allIntentionData != ''"
          @click="lookIntention"
      >我的融资意向</el-button>
    </div>

    <el-button
        type="success"
        style="margin-top: 10px"
        v-if="allIntentionData == ''"
        @click="handleAddFinancier"
    >添加融资意向</el-button>

    <!-- 弹窗表单（恢复完整表单内容） -->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="showAdd"
        width="580px"
        :before-close="closeAdd"
    >
      <!-- 表单表格核心内容（之前被注释掉了，现在恢复） -->
      <el-form
          :model="intentionData"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >

        <!-- 新增user_id输入项 -->
        <el-form-item label="用户ID：" prop="userId">
          <el-input
              v-model="intentionData.userId"
              placeholder="请输入用户ID"
              type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="姓名：" prop="realName">
          <el-input v-model="intentionData.realName"></el-input>
        </el-form-item>
        <el-form-item label="金额(单位：元)：" prop="amount">
          <el-input v-model.number="intentionData.amount"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="intentionData.phone"></el-input>
        </el-form-item>
        <el-form-item label="用途：" prop="application">
          <el-input v-model="intentionData.application"></el-input>
        </el-form-item>
        <el-form-item label="农作物名称：" prop="item">
          <el-input v-model="intentionData.item"></el-input>
        </el-form-item>
        <el-form-item label="种植面积(单位：亩)：" prop="area">
          <el-input v-model.number="intentionData.area"></el-input>
        </el-form-item>
        <el-form-item label="意向借款期：" prop="repaymentPeriod">
          <el-select
              v-model="intentionData.repaymentPeriod"
              placeholder="请选择意向借款期"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="住址：" prop="address">
          <el-input v-model="intentionData.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="success" @click="submitFinancier">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 推荐融资人列表（优化样式） -->
    <div class="recommend-container">
      <div class="recommend-header">
        <h2>推荐融资人</h2>
        <div class="header-line"></div>
      </div>

      <!-- 融资人卡片列表 -->
      <div class="financier-grid">
        <!-- 无数据状态 -->
        <div class="empty-state" v-if="allRecommendData.length === 0">
          <div class="empty-icon">
            <i class="el-icon-user"></i>
          </div>
          <p>暂无推荐的融资人信息</p>
        </div>

        <!-- 融资人卡片 -->
        <div
            class="financier-card"
            v-for="(item, index) in allRecommendData"
            :key="index"
            @click="detailsClick(item.userName)"
        >
          <!-- 头像区域 -->
          <div class="card-header">
            <div class="avatar-wrapper">
              <img
                  :src="getAvatarUrl(item.avatar)"
              alt="融资人头像"
              class="avatar"
              @error="handleAvatarError"
              >
            </div>
            <h3 class="card-name">{{ item.realName || '未知用户' }}</h3>
          </div>

          <!-- 信息区域 -->
          <div class="card-body">
            <div class="info-item">
              <i class="el-icon-phone-outline info-icon"></i>
              <span class="info-text">{{ item.phone || '未提供' }}</span>
            </div>

            <div class="info-item">
              <i class="el-icon-location info-icon"></i>
              <span class="info-text">{{ item.address || '未提供' }}</span>
            </div>

            <div class="info-item">
              <i class="el-icon-shopping-basket info-icon"></i>
              <span class="info-text">{{ item.item || '未提供' }}</span>
            </div>

            <!-- 数据统计区域 -->
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-label">融资金额</span>
                <span class="stat-value">{{ item.amount !== -1 ? item.amount + '元' : '未填写' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">种植面积</span>
                <span class="stat-value">{{ item.area !== -1 ? item.area + '亩' : '未填写' }}</span>
              </div>
            </div>
          </div>

          <!-- 卡片底部 -->
          <div class="card-footer">
            <el-button type="text" size="small" class="contact-btn">
              <i class="el-icon-chat-line-round"></i> 联系
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectRecommned, addFinancier } from "@/apis/financier.js"; // 引入新接口

export default {
  data() {
    return {
      options: [
        { value: 6, label: "六个月" },
        { value: 12, label: "一年" },
        { value: 24, label: "两年" },
        { value: 36, label: "三年" }
      ],
      intentionData: {
        // 表单参数与后端Financier实体字段对应
        userId: "", // 用户ID（从登录信息获取，非手动输入）
        realName: "",
        content: "", // 原字段，可不使用
        plantName: "", // 原字段，可不使用
        phone: "",
        amount: null, // 数字类型
        application: "",
        item: "",
        area: null, // 数字类型
        repaymentPeriod: null, // 绑定到下拉框选择的value
        address: ""
      },
      allIntentionData: [],
      allRecommendData: [],
      showAdd: false,
      look: false,
      dialogTitle: "添加融资意向", // 弹窗标题

      defaultAvatar: require('../assets/img/wutu.gif') // 默认头像路径（转为模块引入，避免路径问题）
    };
  },
  created() {
    this.getAllIntention();
    this.getAllRecommned();
    // 从登录信息获取userId（假设登录用户信息存在localStorage）
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.intentionData.userId = userInfo.userId; // 自动填充当前用户ID
    }
  },
  methods: {


    // 生成头像URL（直接使用后端返回的完整地址）
    getAvatarUrl(avatarPath) {
      // 1. 若后端返回空地址，使用默认头像
      if (!avatarPath || avatarPath.trim() === '') {
        return this.defaultAvatar;
      }
      // 2. 否则直接使用后端返回的完整URL
      console.log("后端返回的完整头像URL：", avatarPath);
      return avatarPath;
    },
    // 加载失败时切换为默认头像
    handleAvatarError(e) {
      console.log("头像加载失败，切换为默认头像");
      e.target.src = this.defaultAvatar;
      e.target.onerror = null; // 避免重复触发错误事件
    },


    // // 生成完整的头像图片URL（直接使用数据库返回的地址拼接）
    // getAvatarUrl(avatarPath) {
    //   // 若数据库返回的头像地址为 null/空，则直接返回默认头像
    //   if (!avatarPath) {
    //     return this.defaultAvatar;
    //   }
    //   // 否则拼接服务器图片访问前缀（从store中获取配置的路径）
    //   return `${this.$store.state.imgShowRoad}/file/${avatarPath}`;
    // },
    // // 头像加载失败时的处理（如地址无效、图片不存在）
    // handleAvatarError(e) {
    //   // 加载失败时强制替换为默认头像
    //   e.target.src = this.defaultAvatar;
    // },




    // 点击“添加融资意向”按钮：打开弹窗
    handleAddFinancier() {
      this.dialogTitle = "添加融资意向";
      this.intentionData = {
        userId: this.intentionData.userId, // 保留当前用户ID
        realName: "",
        phone: "",
        amount: null,
        application: "",
        item: "",
        area: null,
        repaymentPeriod: null,
        address: ""
      };
      this.showAdd = true;
    },

    // 提交融资人信息（原updateIntention修改）
    async submitFinancier() {
      // 表单验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            // 构造提交参数（与后端Financier实体字段对应）
            const params = {
              userId: this.intentionData.userId,
              realName: this.intentionData.realName,
              phone: this.intentionData.phone,
              amount: this.intentionData.amount,
              application: this.intentionData.application,
              item: this.intentionData.item,
              area: this.intentionData.area,
              repaymentPeriod: this.intentionData.repaymentPeriod, // 直接使用intentionData中的值
              address: this.intentionData.address
              // avatar可留空，后端允许为null
            };

            // 调用添加融资人接口
            const res = await addFinancier(params);

            if (res.flag) { // 后端返回flag为true表示成功
              this.$message.success("添加成功");
              this.showAdd = false;
              // 刷新列表
              this.getAllRecommned();
              this.getAllIntention();
            } else {
              this.$message.error(res.message || "添加失败");
            }
          } catch (error) {
            console.error("添加融资人失败：", error);
            this.$message.error("网络错误，请重试");
          }
        }
      });
    },

    // 其他原方法（保持不变）
    getAllRecommned() {
      selectRecommned().then((res) => {
        console.log("推荐融资人列表：", res);
        this.allRecommendData = res.data || [];
      }).catch((err) => {
        console.log(err);
      });
    },
    getAllIntention() {
      // 原逻辑不变，若需查询当前用户的融资意向，可调用对应接口
    },
    lookIntention() {
      this.look = !this.look;
    },
    closeAdd() {
      this.showAdd = false;
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.add-address {
  padding: 20px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

/* 推荐区域标题 */
.recommend-container {
  margin-top: 30px;
}

.recommend-header {
  margin-bottom: 25px;

  h2 {
    font-size: 19px;
    color: #333;
    font-weight: 600;
    margin: 0 0 8px 0;
    display: inline-block;
  }

  .header-line {
    height: 3px;
    width: 80px;
    background-color: #42b983;
    border-radius: 3px;
  }
}

/* 卡片网格布局 */
.financier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 卡片样式 */
.financier-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
}

/* 卡片头部 */
.card-header {
  background-color: #f8faf8;
  padding: 18px 0;
  text-align: center;

  .avatar-wrapper {
    width: 80px;
    height: 80px;
    margin: 0 auto 12px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-name {
    font-size: 18px;
    color: #333;
    margin: 0;
    font-weight: 500;
  }
}

/* 卡片内容 */
.card-body {
  padding: 18px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;

  .info-icon {
    color: #42b983;
    margin-right: 8px;
    width: 18px;
    text-align: center;
  }

  .info-text {
    color: #666;
    line-height: 1.4;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 统计数据区域 */
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* 卡片底部 */
.card-footer {
  padding: 12px 18px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  text-align: right;

  .contact-btn {
    color: #42b983;
    padding: 0;

    &:hover {
      color: #359e6d;
      text-decoration: underline;
    }
  }
}

/* 无数据状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: #999;

  .empty-icon {
    font-size: 60px;
    margin-bottom: 15px;
    color: #e0e0e0;
  }

  p {
    font-size: 16px;
    margin: 0;
  }
}
</style>