<template>
  <div class="home">
    <div class="hero">
      <h2>找出你的投資人格</h2>
      <p>透過12道簡單問題，了解你的投資性格與適合的TISA投資策略</p>
      <button @click="startQuiz" class="start-button">開始測驗</button>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>5種投資人格</h3>
        <p>精準分析你的投資性格</p>
      </div>
      <div class="feature">
        <h3>專屬建議</h3>
        <p>提供個人化投資組合建議</p>
      </div>
      <div class="feature">
        <h3>TISA適格基金</h3>
        <p>推薦最適合你的投資標的</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startQuiz() {
      this.$router.push('/quiz')
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem 0;
}

.hero {
  background: white;
  border-radius: 10px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.hero h2 {
  font-size: 2rem;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

.start-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #2563eb;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
}

.feature {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.feature h3 {
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #6b7280;
}
</style>
