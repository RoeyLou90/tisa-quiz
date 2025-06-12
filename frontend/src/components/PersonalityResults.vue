<template>
  <div class="results-container">
    <div class="result-header">
      <h1>{{ personality.title }}</h1>
      <div class="personality-icon">
        <span :class="personality.iconClass"></span>
      </div>
    </div>

    <div class="personality-description">
      <p>{{ personality.description }}</p>
    </div>

    <div class="investment-profile">
      <h2>投資風格分析</h2>
      <div class="profile-details">
        <div class="strengths">
          <h3>優點</h3>
          <ul>
            <li v-for="strength in personality.strengths" :key="strength">
              {{ strength }}
            </li>
          </ul>
        </div>
        <div class="weaknesses">
          <h3>盲點</h3>
          <ul>
            <li v-for="weakness in personality.weaknesses" :key="weakness">
              {{ weakness }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="investment-recommendations">
      <h2>TISA專屬投資建議</h2>
      <div class="recommendation-cards">
        <div class="card">
          <h3>投資策略</h3>
          <p>{{ personality.investmentStrategy }}</p>
        </div>
        <div class="card">
          <h3>基金配置建議</h3>
          <ul>
            <li
              v-for="(fund, index) in personality.fundAllocation"
              :key="index"
            >
              {{ fund }}
            </li>
          </ul>
        </div>
        <div class="card">
          <h3>投資頻率</h3>
          <p>{{ personality.investmentFrequency }}</p>
        </div>
        <div class="card">
          <h3>風險管理</h3>
          <p>{{ personality.riskManagement }}</p>
        </div>
      </div>
    </div>

    <div class="service-highlights">
      <h2>好好證券服務亮點</h2>
      <ul>
        <li v-for="service in personality.services" :key="service">
          {{ service }}
        </li>
      </ul>
    </div>

    <div class="cta-section">
      <button class="consultation-btn">
        <router-link to="/consultation">預約1對1諮詢</router-link>
      </button>
      <button class="share-btn" @click="shareResults">分享我的投資人格</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    personality: {
      type: Object,
      required: true,
    },
  },
  methods: {
    shareResults() {
      const shareText = `我是「${this.personality.title}」！\n\n${this.personality.description}\n\n你也來測測看你的投資人格：\n${window.location.origin}/quiz`;

      if (navigator.share) {
        navigator
          .share({
            title: "我的投資人格測驗結果",
            text: shareText,
            url: window.location.origin + "/quiz",
          })
          .catch(console.error);
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            alert("結果已複製到剪貼簿！");
          })
          .catch(console.error);
      }
    },
  },
};
</script>

<style scoped>
.results-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.personality-icon {
  font-size: 4rem;
  margin: 1rem 0;
}

.personality-description {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.investment-profile {
  margin: 2rem 0;
}

.profile-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.investment-recommendations {
  margin: 2rem 0;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.service-highlights {
  margin: 2rem 0;
}

.cta-section {
  text-align: center;
  margin-top: 2rem;
}

button {
  padding: 0.8rem 1.5rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.consultation-btn {
  background: #2196f3;
  color: white;
}

.share-btn {
  background: #4caf50;
  color: white;
}

@media (max-width: 768px) {
  .results-container {
    padding: 1rem;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .recommendation-cards {
    grid-template-columns: 1fr;
  }
}
</style>
