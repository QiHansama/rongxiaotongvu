<template>
  <div class="expert-page">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索专家姓名或专业..."
          clearable
          @clear="loadExperts"
          @keyup.enter.native="loadExperts"
          class="search-input"
      ></el-input>
      <el-button type="primary" @click="loadExperts" class="search-btn">搜索</el-button>
    </div>

    <!-- 专家列表 -->
    <div class="expert-list">
      <div class="expert-card" v-for="expert in expertList" :key="expert.id">
        <!-- 专家头像 -->
        <div class="avatar-container">
          <img
          :src="expert.avatarUrl || defaultAvatar"
          alt="专家头像"
          class="expert-avatar"
          @error="handleAvatarError(expert)"
          >
        </div>

        <!--:src="getAvatarUrl(expert)"-->

        <!-- 专家信息 -->
        <div class="expert-info">
          <h3 class="expert-name">{{ expert.realName }}</h3>
          <p class="expert-title">{{ expert.title || '暂无职称' }}</p>
          <p class="expert-extra">职位：{{ expert.position || '-' }}</p>
          <p class="expert-extra">所属：{{ expert.belong || '-' }}</p>
          <p class="expert-profession">专业领域：{{ expert.profession }}</p>
          <p class="expert-extra">电话：{{ expert.phone ? expert.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : '-' }}</p>
          <p class="expert-intro">{{ expert.introduction || '暂无简介' }}</p>

          <!-- 按钮区域：优化布局防止遮挡 -->
          <div class="button-group">
            <el-button
                type="primary"
                @click="toAppointment(expert.id)"
                class="appointment-btn"
            >
              预约咨询
            </el-button>
            <el-button
                type="success"
                @click="toAskQuestion(expert.id)"
                class="ask-btn"
            >
              去提问
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="expertList.length === 0" class="empty-tip">
        <el-empty description="未找到匹配的专家"></el-empty>
      </div>
    </div>

    <!-- 新增：分页控件 -->
    <div class="pagination-container" v-if="pageData.total > 0">
      <el-pagination
          background
          :current-page="currentPage"
      :page-size="pageSize"
      :total="pageData.total"
      :page-sizes="[5, 10, 15, 20]"
      :layout="`total, sizes, prev, pager, next, jumper`"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

  </div>
</template>

<script>
import { getAllExperts } from '@/apis/expert';

export default {
  data() {
    return {

      loading: false, // 新增：初始化加载状态

      searchKeyword: '',
      expertList: [],
      defaultAvatar: require('../assets/img/bg1.png'), // 确保路径正确，默认头像

      // 分页相关参数（新增）
      currentPage: 1, // 当前页码（默认第一页）
      pageSize: 10,   // 每页条数（默认10条）
      pageData: {     // 分页信息（后端返回的pageData）
        total: 0,     // 总记录数
        pages: 0,     // 总页数
        current: 1,   // 当前页
        size: 10      // 每页条数
      },
    };
  },
  created() {
    this.loadExperts();
  },
  methods: {


    // // 生成专家头像的完整URL
    // getAvatarUrl(expert) {
    //   // 假设后端返回的头像字段是avatar（根据实际接口字段调整，如headImg、portrait等）
    //   if (expert.avatar) {
    //     // 拼接完整路径（结合项目的图片基础路径）
    //     // 例如：后端返回的是相对路径，需拼接基础域名/路径
    //     return this.$store.state.imgShowRoad + expert.avatar;
    //   } else {
    //     // 无头像时使用默认图片
    //     return require('../assets/img/bg1.jpg'); // 默认头像的本地路径
    //   }
    // },

    // 头像加载失败时替换为默认头像
    handleAvatarError(expert) {
      // 避免循环错误：仅在当前头像不是默认头像时替换
      // if (expert.avatar) {
      //   expert.avatar = null; // 清空错误头像路径，触发重新使用默认头像
      // }
      // 强制设置为默认头像（避免循环错误）
      expert.avatarUrl = this.defaultAvatar;
    },


    async loadExperts() {
      this.loading = true;
      try {
        // 关键修改：确保 keyword 是字符串（默认空字符串）
        const keyword = (this.searchKeyword || '').trim(); // 避免 undefined 或 null
        // 构造请求参数
        const params = {
          keyword: keyword, // 直接使用处理后的字符串
          currentPage: this.currentPage,
          pageSize: this.pageSize
        };
        const res = await getAllExperts(params);
        if (res.code === 200) {
          this.expertList = res.data || [];
          this.pageData = res.pageData || { total: 0 };
        }
      } catch (error) {
        console.error('加载专家列表失败:', error);
        this.$message.error('获取专家列表失败，请重试');
      } finally {
        this.loading = false;
      }
    },

    // 每页条数变化时触发（新增）
    handleSizeChange(val) {
      this.pageSize = val; // 更新每页条数
      this.currentPage = 1; // 重置为第一页
      this.loadExperts(); // 重新加载数据
    },

    // 页码变化时触发（新增）
    handleCurrentChange(val) {
      this.currentPage = val; // 更新当前页码
      this.loadExperts(); // 重新加载数据
    },

    toAppointment(expertId) {
      this.$router.push(`/home/appointment?expertId=${expertId}`);
    },
    toAskQuestion(expertId) {
      this.$router.push(`/home/Question?expertId=${expertId}`);
    }
  }
};
</script>

<style lang="less" scoped>
.expert-page {
  padding: 20px 40px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 60px);

  .search-container {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    gap: 10px;

    .search-input {
      width: 300px;
    }

    .search-btn {
      height: 40px;
    }
  }

  .expert-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* 加宽卡片防止内容拥挤 */
    gap: 20px;
    margin-top: 20px;
  }

  .expert-card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    transition: transform 0.3s ease;
    flex-direction: column; /* 改为纵向布局，避免横向拥挤 */

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .avatar-container {
      margin: 0 auto 15px; /* 头像居中显示，底部留白 */
    }

    .expert-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #f0f0f0;
    }

    .expert-info {
      width: 100%; /* 信息区占满宽度 */

      .expert-name {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 18px;
        font-weight: 600;
        text-align: center; /* 姓名居中 */
      }

      .expert-title, .expert-extra {
        color: #666;
        margin: 0 0 6px 0;
        font-size: 14px;
      }

      .expert-profession {
        color: #444;
        margin: 0 0 8px 0;
        font-size: 14px;
      }

      .expert-intro {
        color: #666;
        font-size: 13px;
        line-height: 1.6;
        margin: 0 0 15px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* 按钮组核心优化：解决遮挡问题 */

      .button-group {
        display: flex;
        justify-content: center; /* 按钮居中显示 */
        gap: 10px;
        margin-top: 15px;
        width: 100%; /* 占满卡片宽度，避免溢出 */
        flex-wrap: wrap; /* 防止卡片过窄时按钮换行 */
      }

      .appointment-btn, .ask-btn {
        padding: 6px 15px; /* 适当缩小按钮尺寸 */
        font-size: 13px;
        flex: none; /* 禁止按钮拉伸，保持固定尺寸 */
      }

      .appointment-btn {
        background-color: #67c23a;
        border-color: #67c23a;

        &:hover {
          background-color: #52c41a;
        }
      }

      .ask-btn {
        background-color: #20c997;
        border-color: #20c997;

        &:hover {
          background-color: #19b489;
        }
      }
    }
  }

  .empty-tip {
    text-align: center;
    padding: 50px 0;
    background: #fff;
    border-radius: 8px;
    margin-top: 20px;
  }
}
</style>