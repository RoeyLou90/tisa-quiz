<template>
  <div v-if="error" class="error-container">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h2>載入測驗時發生錯誤</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoading" class="retry-button">重試</button>
    </div>
  </div>

  <div v-else-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>載入題目中，請稍候...</p>
  </div>

  <div v-else class="quiz-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>載入題目中...</p>
    </div>

    <div v-else class="quiz-container">
      <div class="progress-bar">
        <div
          class="progress"
          :style="{
            width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%',
          }"
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
              :class="{ selected: selectedOptionIndex === index }"
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
              :class="{ disabled: selectedOptionIndex === null }"
            >
              下一題
            </button>
            <button
              v-else
              @click="submitQuiz"
              :disabled="selectedOptionIndex === null"
              class="nav-button submit"
              :class="{ disabled: selectedOptionIndex === null }"
            >
              查看結果
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  PERSONALITY_TYPES,
  calculatePersonality,
} from "../utils/personalityData";

// Create a custom axios instance with default configs
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default {
  data() {
    return {
      loading: false,
      questions: [],
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      answers: [],
      error: null,
      retryCount: 0,
      maxRetries: 3,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
    scores() {
      const scores = {
        guardian: 0,
        planner: 0,
        adventurer: 0,
        analyst: 0,
        dreamer: 0,
      };

      this.answers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== null && this.questions[questionIndex]) {
          const option = this.questions[questionIndex].options[answerIndex];
          Object.entries(option.scores).forEach(([type, score]) => {
            scores[type] += score;
          });
        }
      });
      return scores;
    },
    currentPersonality() {
      return calculatePersonality(this.scores);
    },
  },
  methods: {
    async fetchQuestions() {
      // Don't retry too many times
      if (this.retryCount >= this.maxRetries) {
        this.error = "無法載入題目，請稍後再試或聯繫管理員";
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;
      this.retryCount++;

      try {
        const response = await api.get("/api/questions", {
          params: {
            _t: Date.now(), // Prevent caching
          },
          timeout: 8000, // 8 seconds timeout
        });

        // Validate response structure
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("無效的題目格式");
        }

        this.questions = response.data;
        this.answers = new Array(response.data.length).fill(null);
        this.retryCount = 0; // Reset retry counter on success
        console.log(`成功載入 ${this.questions.length} 道題目`);
      } catch (error) {
        console.error("載入題目時發生錯誤:", error);

        // Handle different error types
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          this.error = "請求超時，請檢查您的網路連線";
        } else if (error.response) {
          // Server responded with error status
          this.handleServerError(error.response.status);
        } else if (error.request) {
          // No response received
          this.error = "無法連接到伺服器，請檢查您的網路連線";
        } else {
          // Other errors
          this.error = error.message || "載入題目時發生未知錯誤";
        }

        // Show retry button if we haven't exceeded max retries
        if (this.retryCount < this.maxRetries) {
          this.error += "，正在嘗試重新載入...";
          // Auto-retry after a delay
          setTimeout(() => this.fetchQuestions(), 2000);
        }
      } finally {
        this.loading = false;
      }
    },

    handleServerError(status) {
      const errorMessages = {
        400: "請求參數錯誤",
        401: "未經授權",
        403: "權限不足",
        404: "找不到題目資料",
        429: "請求過於頻繁，請稍後再試",
        500: "伺服器內部錯誤",
        503: "服務暫時不可用",
      };

      this.error = errorMessages[status] || `伺服器錯誤 (${status})`;
    },

    retryLoading() {
      this.retryCount = 0;
      this.fetchQuestions();
    },

    selectOption(index) {
      this.selectedOptionIndex = index;
    },
    nextQuestion() {
      if (this.selectedOptionIndex === null) return;

      this.answers.push(this.selectedOptionIndex);
      this.currentQuestionIndex++;
      this.selectedOptionIndex = null;
    },
    prevQuestion() {
      if (this.currentQuestionIndex === 0) return;

      this.currentQuestionIndex--;
      this.selectedOptionIndex = this.answers[this.currentQuestionIndex];
    },
    submitQuiz() {
      if (this.selectedOptionIndex === null) return;

      this.answers.push(this.selectedOptionIndex);

      // Calculate final personality
      const personality = this.currentPersonality;

      this.$router.push({
        path: "/result",
        query: {
          personality: JSON.stringify(personality),
        },
      });
    },
  },
  mounted() {
    this.fetchQuestions();
  },
};
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  line-height: 1.5;
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0056b3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
