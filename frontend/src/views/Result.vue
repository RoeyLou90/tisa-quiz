<template>
  <div class="result-container">
    <div class="result-card">
      <div class="result-header">
        <h2>你的投資人格是：</h2>
        <h1 class="personality-title">{{ personalityType.name }}</h1>
        <div class="personality-emoji">{{ personalityType.emoji }}</div>
      </div>

      <div class="result-content">
        <div class="result-section">
          <h3>人格特質</h3>
          <p>{{ personalityType.description }}</p>
        </div>

        <div class="result-section">
          <h3>投資建議</h3>
          <ul class="recommendations">
            <li v-for="(item, index) in personalityType.recommendations" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="result-section">
          <h3>適合的TISA基金配置</h3>
          <div class="fund-allocation">
            <div 
              v-for="(fund, index) in personalityType.funds" 
              :key="index"
              class="fund-item"
            >
              <div class="fund-type">{{ fund.type }}</div>
              <div class="fund-percentage">{{ fund.percentage }}%</div>
              <div class="fund-bar">
                <div 
                  class="fund-bar-fill"
                  :style="{ width: fund.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <h3>好好證券專屬優勢</h3>
          <div class="advantages">
            <div v-for="(advantage, index) in personalityType.advantages" :key="index" class="advantage-item">
              <div class="advantage-icon">
                <span>{{ advantage.emoji }}</span>
              </div>
              <div class="advantage-content">
                <h4>{{ advantage.title }}</h4>
                <p>{{ advantage.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button @click="restartQuiz" class="action-button">重新測驗</button>
          <button @click="contactAdvisor" class="action-button primary">預約登記</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      personalityType: {},
      personalityTypes: {
        guardian: {
          name: '守護者型 (保守型)',
          emoji: '🛡️',
          description: '你重視資金安全，偏好低風險投資，適合穩定收益的投資組合。你傾向於避免投資波動，重視本金保障，適合穩健的投資策略。',
          recommendations: [
            '選擇高評級債券型基金，如政府公債或投資級公司債',
            '維持較高的現金比例，以應對突發資金需求',
            '定期定額投資，分散風險，避免單一市場波動',
            '關注配息穩定的投資標的，創造穩定現金流'
          ],
          funds: [
            { type: '債券型', percentage: 80 },
            { type: '平衡型', percentage: 15 },
            { type: '股票型', percentage: 5 }
          ],
          advantages: [
            {
              emoji: '💯',
              title: '零手續費',
              description: '小額定期定額投資更划算，手續費全免'
            },
            {
              emoji: '🔄',
              title: '彈性投資',
              description: '隨時可調整投資金額，資金運用更靈活'
            },
            {
              emoji: '🛡️',
              title: '風險管理',
              title: '風險管理',
              description: '專業團隊嚴選低風險投資標的，守護您的資產'
            }
          ]
        },
        planner: {
          name: '計畫家型 (穩健型)',
          emoji: '📊',
          description: '你重視長期規劃，善於平衡風險與報酬，適合穩健的資產配置策略。你願意承擔適度風險以換取合理報酬。',
          recommendations: [
            '採用股債均衡配置，分散投資風險',
            '定期檢視投資組合，適時調整配置',
            '長期持有優質資產，享受複利效果',
            '保留部分現金，把握市場機會'
          ],
          funds: [
            { type: '平衡型', percentage: 60 },
            { type: '債券型', percentage: 25 },
            { type: '股票型', percentage: 15 }
          ],
          advantages: [
            {
              emoji: '🔄',
              title: '快速交換',
              description: '輕鬆調整資產配置，把握市場機會'
            },
            {
              emoji: '📈',
              title: '智能配置',
              description: '根據市場狀況提供投資建議，優化配置'
            },
            {
              emoji: '💼',
              title: '專業分析',
              description: '專業團隊提供市場分析，助您做出明智決策'
            }
          ]
        },
        analyst: {
          name: '理性分析師型 (研究型)',
          emoji: '🔍',
          description: '你擅長分析研究，重視數據與邏輯，適合基於深入研究的投資策略。你願意花時間研究，並根據分析結果做出投資決策。',
          recommendations: [
            '深入研究投資標的，了解基本面和技術面',
            '分散投資不同產業和地區，降低單一風險',
            '定期檢視投資組合，根據市場變化調整策略',
            '保持理性，避免情緒化決策'
          ],
          funds: [
            { type: '股票型', percentage: 50 },
            { type: '平衡型', percentage: 30 },
            { type: '債券型', percentage: 20 }
          ],
          advantages: [
            {
              emoji: '📊',
              title: '深度研究',
              description: '提供詳細的市場分析和研究報告'
            },
            {
              emoji: '💡',
              title: '專業見解',
              description: '專家團隊提供專業投資建議和市場洞察'
            },
            {
              emoji: '📱',
              title: '進階工具',
              description: '使用先進的分析工具，輔助投資決策'
            }
          ]
        },
        adventurer: {
          name: '冒險家型 (積極型)',
          emoji: '🚀',
          description: '你追求高報酬，能承受較大波動，適合積極的投資策略。你願意承擔較高風險以換取潛在的高報酬。',
          recommendations: [
            '重點配置成長型股票和新興市場',
            '長期持有優質成長股，享受資本增值',
            '定期檢視投資組合，汰弱留強',
            '保留部分現金，把握市場回調機會'
          ],
          funds: [
            { type: '股票型', percentage: 70 },
            { type: '平衡型', percentage: 20 },
            { type: '債券型', percentage: 10 }
          ],
          advantages: [
            {
              emoji: '🌍',
              title: '全球佈局',
              description: '投資全球優質資產，掌握各地成長機會'
            },
            {
              emoji: '⚡',
              title: '快速交易',
              description: '即時執行交易，把握市場機會'
            },
            {
              emoji: '📱',
              title: '即時資訊',
              description: '提供即時市場資訊和新聞，助您快速決策'
            }
          ]
        },
        dreamer: {
          name: '靈活夢想家型 (成長型)',
          emoji: '✨',
          description: '你具有遠見，願意承擔較高風險以追求長期資本增值。你相信創新和成長型投資的潛力，並願意長期持有。你對新事物持開放態度，願意投資於創新和未來趨勢。',
          recommendations: [
            '重點配置高成長潛力的創新產業',
            '長期投資，享受複利效果',
            '定期定額投資，分散入場時點',
            '保持耐心，不因短期波動而動搖'
          ],
          funds: [
            { type: '股票型', percentage: 60 },
            { type: '創新產業', percentage: 30 },
            { type: '平衡型', percentage: 10 }
          ],
          advantages: [
            {
              emoji: '🎓',
              title: '投資教育',
              description: '豐富的投資學習資源，助您掌握投資知識'
            },
            {
              emoji: '🚀',
              title: '創新產品',
              description: '提供多元創新的投資產品，掌握未來趨勢'
            },
            {
              emoji: '💡',
              title: '趨勢洞察',
              description: '專業團隊分析市場趨勢，發掘潛在機會'
            }
          ]
        }
      }
    };
  },
  created() {
    // 從 URL 參數獲取人格類型和分數
    const type = this.$route.query.type || 'planner';
    const isMixed = this.$route.query.isMixed === '1';
    const scores = this.$route.query.scores ? JSON.parse(this.$route.query.scores) : null;
    
    // 設置人格類型
    this.personalityType = this.personalityTypes[type] || this.personalityTypes.planner;
    
    // 如果是混合型，更新顯示
    if (isMixed) {
      this.personalityType = {
        ...this.personalityType,
        name: `混合型 (${this.getPersonalityChineseName(type)})`,
        description: `你同時具有多種投資人格特質，主要傾向 ${this.getPersonalityChineseName(type)}。你的投資風格較為平衡，能夠根據不同情況調整策略。`
      };
    }
    
    // 如果有分數數據，可以進一步處理顯示
    if (scores) {
      console.log('Scores:', scores);
      // 這裡可以添加更多基於分數的個性化顯示邏輯
    }
  },
  methods: {
    getPersonalityChineseName(type) {
      const names = {
        guardian: '守護者型',
        planner: '計畫家型',
        analyst: '理性分析師型',
        adventurer: '冒險家型',
        dreamer: '靈活夢想家型'
      };
      return names[type] || '計畫家型';
    },
    restartQuiz() {
      this.$router.push('/quiz');
    },
    contactAdvisor() {
      // 這裡可以加入聯絡理專的邏輯
      alert('即將為您轉接理專服務，請稍候...');
    }
  }
};
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.result-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 3rem;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.result-header {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.result-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(30deg);
  pointer-events: none;
}

.personality-title {
  font-size: 2.25rem;
  margin: 0.75rem 0;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.personality-emoji {
  font-size: 4rem;
  margin: 1rem 0;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.result-content {
  padding: 2.5rem;
}

.result-section {
  margin-bottom: 2.5rem;
  position: relative;
}

.result-section:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

.result-section h3 {
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-section h3::before {
  content: '•';
  color: #4f46e5;
  font-size: 1.5em;
  line-height: 0;
}

.recommendations {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.recommendations li {
  background: #f8fafc;
  margin: 0;
  padding: 1.25rem;
  border-radius: 10px;
  border-left: 4px solid #4f46e5;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recommendations li::before {
  content: '✓';
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 3rem;
  color: rgba(79, 70, 229, 0.1);
  line-height: 1;
  font-weight: bold;
}

.recommendations li:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.15);
  background: white;
}

.advantages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.advantage-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #c7d2fe;
}

.advantage-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #4f46e5;
  transition: all 0.3s ease;
}

.advantage-item:hover .advantage-icon {
  background: #4f46e5;
  color: white;
  transform: scale(1.1);
}

.advantage-content h4 {
  margin: 0.5rem 0 0.25rem;
  color: #1f2937;
  font-size: 1.1rem;
}

.advantage-content p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.fund-allocation {
  margin-top: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.fund-item {
  margin-bottom: 1.25rem;
}

.fund-item:last-child {
  margin-bottom: 0;
}

.fund-type {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.fund-percentage {
  font-weight: 600;
  color: #4f46e5;
}

.fund-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.fund-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 5px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.875rem 2rem;
  border: 2px solid #4f46e5;
  background: white;
  color: #4f46e5;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  min-width: 160px;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #4f46e5;
  transition: all 0.3s ease;
  z-index: -1;
}

.action-button:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.action-button:hover::before {
  width: 100%;
}

.action-button.primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.action-button.primary::before {
  background: #4338ca;
}

.action-button.primary:hover {
  background: #4338ca;
  border-color: #4338ca;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .result-content {
    padding: 1.5rem 1rem;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>
