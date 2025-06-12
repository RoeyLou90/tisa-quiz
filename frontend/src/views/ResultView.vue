<template>
  <div class="result-view">
    <PersonalityResults :personality="personality" />
    <div class="result-actions">
      <button @click="restartQuiz" class="restart-btn">再做一次測驗</button>
      <button @click="shareResults" class="share-btn">分享我的投資人格</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PersonalityResults from "../components/PersonalityResults.vue";

export default {
  name: "ResultView",
  components: {
    PersonalityResults,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const personality = ref(null);

    onMounted(() => {
      const personalityStr = route.query.personality;
      if (personalityStr) {
        try {
          personality.value = JSON.parse(personalityStr);
        } catch (error) {
          console.error("Error parsing personality data:", error);
          // Redirect to quiz if invalid data
          router.push("/quiz");
        }
      } else {
        // Redirect to quiz if no data
        router.push("/quiz");
      }
    });

    const restartQuiz = () => {
      router.push("/quiz");
    };

    const shareResults = () => {
      const shareText = `我是「${personality.value.title}」！\n\n${personality.value.description}\n\n你也來測測看你的投資人格：\n${window.location.origin}/quiz`;

      if (navigator.share) {
        navigator
          .share({
            title: "我的投資人格測驗結果",
            text: shareText,
            url: window.location.origin + "/quiz",
          })
          .catch(console.error);
      } else {
        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            alert("結果已複製到剪貼簿！");
          })
          .catch(console.error);
      }
    };

    return {
      personality,
      restartQuiz,
      shareResults,
    };
  },
};
</script>

<style scoped>
.result-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.result-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.restart-btn {
  background: #2196f3;
  color: white;
}

.share-btn {
  background: #4caf50;
  color: white;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .result-actions {
    flex-direction: column;
  }
}
</style>
