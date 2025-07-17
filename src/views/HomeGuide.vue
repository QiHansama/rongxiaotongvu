<template>
  <div class="home-guide-container">
    <!-- 左侧：问答列表（含模糊查询） -->
    <div class="left-guide">
      <div class="question-container">
        <!-- 问答搜索框（模糊查询入口） -->
        <div class="question-search">
          <el-input
              v-model="questionSearch"
              placeholder="输入关键词搜索问题/答案..."
              clearable
              @input="handleQuestionSearch"
              @keyup.enter.native="handleQuestionSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleQuestionSearch"></el-button>
          </el-input>
        </div>

        <!-- 搜索结果统计 -->
        <div class="question-header">
          <h3>
            {{ questionSearch ? `搜索结果: "${questionSearch}"` : '问题与解答' }}
          </h3>
          <span class="count">
            {{ filteredQuestions.length }} 条记录
          </span>
        </div>

        <!-- 模糊查询结果列表 -->
        <div class="question-list">
          <!-- 循环渲染过滤后的问题 -->
          <div
              class="question-item"
              v-for="(item, index) in filteredQuestions"
              :key="item.id || index"
              :class="{ 'answered': item.status === 1 }"
          >
            <!-- 问题部分（关键词高亮） -->
            <div class="question-content">
              <div class="question-title">
                <span class="index">{{ index + 1 }}.</span>
                <span v-html="highlightKeyword(item.title)"></span>
                <span class="tag" v-if="item.plantName">{{ item.plantName }}</span>
              </div>
              <div class="question-detail">
                <span class="label">问题：</span>
                <span v-html="highlightKeyword(item.question)"></span>
              </div>
            </div>

            <!-- 答案部分（已回答才显示，关键词高亮） -->
            <div class="answer-content" v-if="item.status === 1">
              <div class="answer-header">
                <i class="el-icon-comment"></i>
                <span>专家解答</span>
              </div>
              <div class="answer-detail">
                <span v-html="highlightKeyword(item.answer)"></span>
              </div>
            </div>

            <!-- 状态标签 -->
            <div class="status-tag">
              <span v-if="item.status === 0">未回答</span>
              <span v-if="item.status === 1">已回答</span>
              <span v-if="item.status === 2">已关闭</span>
            </div>

            <!-- 时间信息 -->
            <div class="time-info">
              <span>提问时间：{{ item.createTime ? formatTime(item.createTime) : '未知' }}</span>
              <span v-if="item.status === 1">回答时间：{{ item.updateTime ? formatTime(item.updateTime) : '未知' }}</span>
            </div>
          </div>

          <!-- 空状态（无搜索结果时） -->
          <div class="empty-state" v-if="filteredQuestions.length === 0 && !loading">
            <el-empty :description="questionSearch ? '未找到匹配内容' : '暂无相关问答'"></el-empty>
          </div>

          <!-- 加载中状态 -->
          <div class="loading-state" v-if="loading">
            <el-loading-spinner></el-loading-spinner>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：专家列表（使用getAllExperts接口） -->
    <div class="right-guide">
      <!-- 顶部快捷入口 -->
      <div class="btn-content" v-if="!$store.getters.isAdmin&&!$store.getters.isExpert">
        <a  style="cursor: pointer;">在线问答</a> |
        <a  style="cursor: pointer;">专家预约</a>
      </div>

      <!-- 推荐专家 -->
      <div class="professioner-item">
        <div class="section-title">
          <strong>推荐专家</strong>
          <a @click="AllExBtn" class="more-link">查看全部 <i class="el-icon-arrow-right"></i></a>
        </div>

        <div class="expert-item" v-for="(item,index) in recommendExperts" :key="item.uid || index">

          <img
              :src="item.avatarUrl || defaultAvatar"
          alt="专家头像"
          class="expert-avatar"
          @error="handleAvatarError(item)"
          />

          <div class="expert-info">
            <div class="info-row">
              <span class="label">姓名：</span>
              <span class="value">{{item.realName || '未填写'}}</span>
              <span class="label ml-20">职称：</span>
              <span class="value">{{item.position || '无'}}</span>
            </div>
            <div class="info-row">
              <span class="label">专业：</span>
              <span class="value">{{item.profession || '未填写'}}</span>
              <span class="label ml-20">电话：</span>
              <span class="value">{{formatPhone(item.phone)}}</span>
            </div>
            <div class="info-row">
              <span class="label">单位：</span>
              <span class="value">{{item.belong || '未填写'}}</span>
            </div>
            <div class="expert-actions" v-if="!$store.getters.isAdmin&&!$store.getters.isExpert">
              <button class="action-btn" @click="handleQuestion(item)">去提问</button>
              <button class="action-btn" @click="handleAppointment(item)">去预约</button>
            </div>
          </div>
          <div class="divider" v-if="index !== recommendExperts.length - 1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GuideSource from "../components/GuideSource.vue";
import { getAllExperts } from "@/apis/expert"; // 引入新接口
import { getQuestionList } from "@/apis/questions";

export default {
  components: { GuideSource },
  data() {
    return {
      // 原始问答数据（全部）
      allQuestions: [],
      questionSearch: "",
      loading: false,
      defaultAvatar: require('../assets/img/bg1.png'), // 与 allExpert 页面保持一致的默认头像

      // 专家数据
      expertArray: [], // 用于推荐专家
      allExperts: [], // 存储所有专家（从getAllExperts接口获取）
      expertSearchValue: ""
    };
  },
  computed: {
    // 模糊查询过滤后的问题列表
    filteredQuestions() {
      if (!this.questionSearch.trim()) {
        return this.allQuestions;
      }
      const keyword = this.questionSearch.trim().toLowerCase();
      return this.allQuestions.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(keyword);
        const questionMatch = item.question && item.question.toLowerCase().includes(keyword);
        const answerMatch = item.answer && item.answer.toLowerCase().includes(keyword);
        return titleMatch || questionMatch || answerMatch;
      });
    },

    // 专家相关计算属性
    recommendExperts() {
      return this.expertArray.slice(0, 5); // 推荐前5位专家
    },
    hasExpertSearch() {
      return this.expertSearchValue.trim() !== "";
    },
    showGoods() {
      return this.hasExpertSearch ? this.expertSearchGoods : this.allExperts;
    },
    expertSearchGoods() {
      const keyword = this.expertSearchValue.trim().toLowerCase();
      return this.allExperts.filter(expert =>
          (expert.realName && expert.realName.toLowerCase().includes(keyword)) ||
          (expert.profession && expert.profession.toLowerCase().includes(keyword)) ||
          (expert.belong && expert.belong.toLowerCase().includes(keyword))
      );
    }
  },
  created() {
    this.$store.commit("updateActiveIndex", "5");
    this.fetchAllQuestions();
    this.loadAllExperts(); // 加载所有专家
  },
  methods: {


    // // 生成专家头像完整URL（与allExpert页面逻辑一致）
    // getAvatarUrl(expert) {
    //   // 后端返回的头像字段为avatar（根据实际接口字段调整，如avatarUrl）
    //   if (expert.avatar) {
    //     // 拼接项目基础图片路径（与allExpert页面保持一致）
    //     return this.$store.state.imgShowRoad + expert.avatar;
    //   } else {
    //     // 无头像时使用默认图片（路径与allExpert页面保持一致）
    //     return require('../assets/img/bg1.jpg');
    //   }
    // },

    // 头像加载失败时替换为默认头像
    handleAvatarError(expert) {
      // 避免循环错误：仅在当前头像不是默认头像时替换
      // if (expert.avatar) {
      //   expert.avatar = null; // 清空错误路径，触发使用默认头像
      // }
      // 直接使用默认头像替换失败的头像
      item.avatarUrl = this.defaultAvatar;
    },


    // 加载全部问答数据
    fetchAllQuestions() {
      this.loading = true;
      getQuestionList({ keyword: "" })
          .then(res => {
            this.loading = false;
            if (res && res.code === 200) {
              this.allQuestions = res.data || [];
            } else {
              this.allQuestions = [];
            }
          })
          .catch(() => {
            this.loading = false;
            this.allQuestions = [];
          });
    },

    // 核心修改：使用getAllExperts接口加载所有专家
    loadAllExperts() {
      // 调用getAllExperts接口（替代原searchExperts）
      getAllExperts("").then(res => {
        if (res && res.code === 200) {
          this.allExperts = res.data || []; // 存储所有专家
          this.expertArray = this.allExperts; // 推荐专家从所有专家中选取
        }
      });
    },


    // 获取推荐专家（从所有专家中取前5位）
    getRecommendExperts() {
      this.expertArray = this.allExperts.slice(0, 5);
    },

    // 处理问题搜索
    handleQuestionSearch() {
      console.log("搜索关键词:", this.questionSearch);
    },

    // 处理专家搜索
    handleExpertSearch() {
      // 由计算属性自动过滤
    },

    // 关键词高亮显示
    highlightKeyword(text) {
      if (!text || !this.questionSearch.trim()) {
        return text || "";
      }
      const keyword = this.questionSearch.trim();
      const regex = new RegExp(`(${keyword})`, "gi");
      return text.replace(regex, '<span class="highlight">$1</span>');
    },

    // 时间格式化
    formatTime(timeStr) {
      if (!timeStr) return '未知时间';
      const date = new Date(timeStr);
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join("-") + " " + [
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0')
      ].join(":");
    },

    // 手机号格式化
    formatPhone(phone) {
      return phone ? phone.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1****$3") : "未填写";
    },

    // 跳转全部专家页面
    AllExBtn() {
      this.$router.push("/home/allExpert").catch(err => console.error("跳转失败:", err));
    },

    // 去提问
    handleQuestion(item) {
      if (localStorage.getItem('token')) {
        this.$router.push('/home/question');
      } else {
        this.$message.error('请先登录');
        this.$router.push('/login');
      }
    },

    // 去预约
    handleAppointment(item) {
      if (localStorage.getItem('token')) {
        this.$router.push('/home/appointment');
      } else {
        this.$message.error('请先登录');
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style lang="less" scoped>

// 添加关键词高亮样式
.highlight {
  color: #f56c6c;
  font-weight: bold;
  background-color: #fff3cd;
  padding: 0 2px;
  border-radius: 2px;
}


.home-guide-container {
  width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  /* 关键：固定容器高度（减去顶部导航栏高度，根据实际调整） */
  height: calc(100vh - 120px);
  /* 强制左右区域高度与容器一致 */
  align-items: stretch;

  .left-guide {
    width: 730px;
    height: 100%; /* 新增：继承容器高度 */
    display: flex; /* 新增：启用flex布局 */
    flex-direction: column; /* 新增：垂直排列子元素 */

    .question-container {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      /* 内容超出时内部滚动，不改变盒子高度 */
      overflow-y: auto;
      /* 优化滚动条样式（可选） */
      scrollbar-width: thin;
      scrollbar-color: #67c23a #f0f9ea;

      .question-search {
        margin-bottom: 20px;

        .el-input {
          width: 100%;
        }
      }

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f5f5f5;

        h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .count {
          font-size: 14px;
          color: #67c23a;
        }
      }

      .question-list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .question-item {
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          padding: 15px;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          &.answered {
            border-left: 3px solid #67c23a;
          }

          .question-content {
            margin-bottom: 10px;

            .question-title {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-weight: 500;

              .index {
                color: #67c23a;
                margin-right: 5px;
                font-weight: bold;
              }

              .tag {
                margin-left: 10px;
                font-size: 12px;
                color: #409eff;
                background: #ecf5ff;
                padding: 2px 8px;
                border-radius: 4px;
              }
            }

            .question-detail {
              font-size: 14px;
              color: #666;
              line-height: 1.6;

              .label {
                color: #999;
                margin-right: 5px;
              }
            }
          }

          .answer-content {
            background: #f9fdf6;
            border-radius: 4px;
            padding: 10px 15px;
            margin-top: 10px;

            .answer-header {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              color: #67c23a;
              font-size: 14px;

              i {
                margin-right: 5px;
              }
            }

            .answer-detail {
              font-size: 14px;
              color: #333;
              line-height: 1.6;
            }
          }

          .status-tag {
            margin-top: 10px;

            span {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;

              &:nth-child(1) {
                background: #fef0f0;
                color: #f56c6c;
              }

              &:nth-child(2) {
                background: #f0f9ea;
                color: #67c23a;
              }

              &:nth-child(3) {
                background: #f5f5f5;
                color: #909399;
              }
            }
          }

          .time-info {
            margin-top: 10px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }

  // 仅优化右侧推荐专家列表样式
  .right-guide {
    width: 350px;
    height: 100%; /* 新增：继承容器高度 */
    display: flex; /* 新增：启用flex布局 */
    flex-direction: column; /* 新增：垂直排列子元素 */

    .btn-content {
      background: #f0f9ea;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 8px;
      font-size: 15px;
      margin-bottom: 20px;
      //box-shadow: 0 2px 4px rgba(103, 194, 58, 0.1);
      /* 固定高度，不随父元素拉伸 */
      flex-shrink: 0;

      a {
        color: #67c23a;
        text-decoration: none;
        font-weight: 500;
        padding: 0 8px;

        &:hover {
          color: #52af31;
          text-decoration: underline;
        }
      }
    }

    .professioner-item {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      /* 内容超出时内部滚动，不改变盒子高度 */
      overflow-y: auto;
      /* 优化滚动条样式（可选） */
      scrollbar-width: thin;
      scrollbar-color: #67c23a #f0f9ea;

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f9ea;

        strong {
          font-size: 18px;
          color: #333;
          font-weight: 500;
          position: relative;
          padding-left: 10px;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 16px;
            background: #67c23a;
            border-radius: 2px;
          }
        }

        .more-link {
          color: #67c23a;
          font-size: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.3s;

          i {
            margin-left: 5px;
            font-size: 14px;
            transition: transform 0.3s;
          }

          &:hover {
            color: #52af31;
            text-decoration: underline;

            i {
              transform: translateX(3px);
            }
          }
        }
      }

      .expert-item {
        padding: 15px;
        border-radius: 8px;
        background: #fff;
        margin-bottom: 15px;
        transition: all 0.3s;
        border: 1px solid #f5f5f5;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(103, 194, 58, 0.08);
          border-color: #e1f3d8;
          background: #f9fdf6;
        }

        .expert-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 15px;
          border: 3px solid #e1f3d8;
          box-shadow: 0 3px 6px rgba(103, 194, 58, 0.15);
          transition: all 0.3s;

          .expert-item:hover & {
            transform: scale(1.05);
          }
        }

        .expert-info {
          flex: 1;

          .info-row {
            line-height: 28px;
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            &:not(:last-child) {
              margin-bottom: 4px;
            }

            .label {
              color: #888;
              font-weight: 400;
              min-width: 55px;
            }

            .value {
              color: #333;
              flex: 1;
              word-break: break-all;
            }

            .ml-20 {
              margin-left: 15px;
              min-width: 50px;
            }
          }

          .expert-actions {
            display: flex;
            margin-top: 12px;
            gap: 12px;

            .action-btn {
              padding: 6px 16px;
              background: #f0f9ea;
              color: #67c23a;
              border: 1px solid #e1f3d8;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              transition: all 0.3s;
              display: flex;
              align-items: center;
              justify-content: center;

              &:hover {
                background: #67c23a;
                color: #fff;
                border-color: #67c23a;
                transform: translateY(-2px);
              }

              &:active {
                transform: translateY(0);
              }
            }
          }
        }
      }

      .divider {
        height: 1px;
        background: #f2f2f2;
        margin: 12px 0;
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(103, 194, 58, 0.2), transparent);
          animation: dividerMove 3s infinite;
        }
      }
    }
  }

  // 分隔线动画
  @keyframes dividerMove {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  // 空状态优化
  .empty-state {
    padding: 40px 0;
    text-align: center;

    .el-empty__image {
      width: 120px;
      height: 120px;
      margin-bottom: 15px;
    }

    .el-empty__description {
      color: #888;
      font-size: 14px;
    }
  }
}
</style>