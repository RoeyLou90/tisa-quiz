<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>載入題目中...</p>
  </div>
  
  <div v-else class="quiz-container">
    <div class="progress-bar">
      <div 
        class="progress" 
        :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"
      ></div>
      <div class="progress-text">
        問題 {{ currentQuestionIndex + 1 }} / {{ questions.length }}
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="question-card" :key="currentQuestionIndex">
        <h2>{{ currentQuestion.text }}</h2>
        
        <div class="options">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="option.id"
            @click="selectOption(index)"
            :class="{ 'selected': selectedOptionIndex === index }"
            class="option-button"
          >
            {{ option.text }}
          </button>
        </div>

        <div class="navigation">
          <button 
            v-if="currentQuestionIndex > 0" 
            @click="prevQuestion"
            class="nav-button prev"
          >
            上一題
          </button>
          <button 
            v-if="currentQuestionIndex < questions.length - 1" 
            @click="nextQuestion"
            :disabled="selectedOptionIndex === null"
            class="nav-button next"
            :class="{ 'disabled': selectedOptionIndex === null }"
          >
            下一題
          </button>
          <button 
            v-else 
            @click="submitQuiz"
            :disabled="selectedOptionIndex === null"
            class="nav-button submit"
            :class="{ 'disabled': selectedOptionIndex === null }"
          >
            查看結果
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      questions: [],
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      answers: [],
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
  },
  methods: {
    async fetchQuestions() {
      try {
        this.loading = true;
        console.log('Fetching questions from:', '/api/questions');
        
        const response = await axios.get('http://localhost:5001/api/questions', {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        console.log('Received response:', {
          status: response.status,
          data: response.data
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format: expected an array');
        }

        this.questions = response.data;
        this.answers = new Array(this.questions.length).fill(null);
        console.log(`Successfully loaded ${this.questions.length} questions`);
        
      } catch (error) {
        console.error('Error in fetchQuestions:', {
          message: error.message,
          response: error.response ? {
            status: error.response.status,
            data: error.response.data
          } : 'No response',
          error: error
        });
        alert('無法載入題目，請確認後端服務是否正常運行');
      } finally {
        this.loading = false;
      }
    },
    selectOption(index) {
      this.selectedOptionIndex = index;
      this.answers[this.currentQuestionIndex] = index;
    },
    nextQuestion() {
      if (this.selectedOptionIndex !== null) {
        this.currentQuestionIndex++;
        this.selectedOptionIndex = this.answers[this.currentQuestionIndex] !== null 
          ? this.answers[this.currentQuestionIndex] 
          : null;
      }
    },
    prevQuestion() {
      this.currentQuestionIndex--;
      this.selectedOptionIndex = this.answers[this.currentQuestionIndex] !== null 
        ? this.answers[this.currentQuestionIndex] 
        : null;
    },
    calculateResult() {
      const scores = {
        guardian: 0,    // 守護者型 (G)
        planner: 0,     // 計畫家型 (P)
        analyst: 0,     // 分析師型 (R)
        adventurer: 0,  // 冒險家型 (A)
        dreamer: 0      // 夢想家型 (D)
      };

      // 計算每種人格的總分
      this.answers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== null && this.questions[questionIndex]) {
          const option = this.questions[questionIndex].options[answerIndex];
          Object.entries(option.scores).forEach(([type, score]) => {
            scores[type] += score;
          });
        }
      });

      // 將分數轉換為陣列並排序
      const scoreEntries = Object.entries(scores);
      // 按分數降序排序
      scoreEntries.sort((a, b) => b[1] - a[1]);
      
      const [primaryType, primaryScore] = scoreEntries[0];
      const [secondaryType, secondaryScore] = scoreEntries[1];
      
      let resultType = 'planner'; // 預設為計畫家型
      
      // 判斷結果類型
      if (primaryScore >= 25 && (primaryScore - secondaryScore) >= 5) {
        // 單一主導型：某一人格分數 ≥ 25分 且 超出第二高分5分以上
        resultType = primaryType;
      } else if (primaryScore < 15) {
        // 保底機制：若所有分數都很低，預設為「計畫家型」
        resultType = 'planner';
      } else {
        // 混合型：最高分與第二高分差距 < 5分
        // 如果前兩名分數接近，視為混合型
        if ((primaryScore - secondaryScore) < 5) {
          // 這裡可以根據業務需求決定混合類型的處理方式
          // 目前先返回分數較高的類型
          resultType = primaryType;
        } else {
          resultType = primaryType;
        }
      }

      console.log('Scores:', scores);
      console.log('Result type:', resultType);

      return {
        type: resultType,
        scores: scores,
        isMixed: (primaryScore - secondaryScore) < 5 && primaryScore >= 25
      };
    },
    submitQuiz() {
      if (this.selectedOptionIndex === null) return;
      
      const result = this.calculateResult();
      this.$router.push({
        path: '/result',
        query: { 
          type: result.type,
          isMixed: result.isMixed ? '1' : '0',
          scores: JSON.stringify(result.scores)
        }
      });
    }
  },
  mounted() {
    this.fetchQuestions();
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #4b5563;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.progress-bar {
  background-color: #e5e7eb;
  border-radius: 10px;
  height: 20px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 500;
}

.question-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.question-card h2 {
  color: #1e3a8a;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  line-height: 1.4;
}

.options {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.option-button:hover {
  border-color: #3b82f6;
  background-color: #f0f7ff;
}

.option-button.selected {
  border-color: #3b82f6;
  background-color: #ebf5ff;
  color: #1d4ed8;
  font-weight: 500;
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.nav-button.prev {
  background-color: #f3f4f6;
  color: #4b5563;
}

.nav-button.prev:hover {
  background-color: #e5e7eb;
}

.nav-button.next,
.nav-button.submit {
  background-color: #3b82f6;
  color: white;
  margin-left: auto;
}

.nav-button.next:hover:not(.disabled),
.nav-button.submit:hover:not(.disabled) {
  background-color: #2563eb;
}

.nav-button.disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .question-card {
    padding: 1.5rem 1rem;
  }
  
  .question-card h2 {
    font-size: 1.25rem;
  }
  
  .option-button {
    padding: 0.75rem 1rem;
  }
}
</style>
