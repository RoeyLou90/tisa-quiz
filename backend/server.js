const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.get('/api/questions', (req, res) => {
  const questions = [
    {
      id: 1,
      text: '如果你的投資在一個月內下跌了15%，你會？',
      options: [
        { id: 1, text: '立刻賣出，避免更大損失', scores: { guardian: 3, planner: 1 } },
        { id: 2, text: '觀察一陣子再決定', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '繼續持有，相信長期會回升', scores: { adventurer: 2, dreamer: 3 } },
        { id: 4, text: '趁機加碼買進', scores: { adventurer: 3, analyst: 1 } }
      ]
    },
    {
      id: 2,
      text: '你認為理想的年報酬率應該是？',
      options: [
        { id: 1, text: '2-4%，穩定就好', scores: { guardian: 3 } },
        { id: 2, text: '4-6%，略高於定存', scores: { planner: 3, guardian: 1 } },
        { id: 3, text: '6-10%，承受適度風險', scores: { analyst: 3, dreamer: 2 } },
        { id: 4, text: '10%以上，勇於冒險', scores: { adventurer: 3, dreamer: 1 } }
      ]
    },
    {
      id: 3,
      text: '面對投資波動，你的心情是？',
      options: [
        { id: 1, text: '非常焦慮，影響日常生活', scores: { guardian: 3 } },
        { id: 2, text: '有點擔心，但能接受', scores: { planner: 3, guardian: 1 } },
        { id: 3, text: '覺得正常，市場本來就會波動', scores: { analyst: 3, dreamer: 2 } },
        { id: 4, text: '很興奮，波動代表機會', scores: { adventurer: 3 } }
      ]
    },
    {
      id: 4,
      text: '你的投資時間規劃是？',
      options: [
        { id: 1, text: '1年內，隨時可能需要用錢', scores: { guardian: 3 } },
        { id: 2, text: '2-3年，有明確的資金需求', scores: { planner: 3 } },
        { id: 3, text: '5-10年，為了退休或子女教育', scores: { analyst: 2, dreamer: 3 } },
        { id: 4, text: '10年以上，純粹為了財富累積', scores: { adventurer: 3, dreamer: 2 } }
      ]
    },
    {
      id: 5,
      text: '投資對你來說最重要的是？',
      options: [
        { id: 1, text: '本金安全，不能有損失', scores: { guardian: 3 } },
        { id: 2, text: '穩定配息，有固定收入', scores: { planner: 3, guardian: 2 } },
        { id: 3, text: '資產增值，跟上通膨', scores: { analyst: 3, planner: 1 } },
        { id: 4, text: '財富快速成長，創造被動收入', scores: { adventurer: 3, dreamer: 3 } }
      ]
    },
    {
      id: 6,
      text: '你希望多久檢視一次投資績效？',
      options: [
        { id: 1, text: '每天都要看', scores: { guardian: 2, adventurer: 1 } },
        { id: 2, text: '每週或每月', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '每季或半年', scores: { analyst: 3, dreamer: 2 } },
        { id: 4, text: '一年或更久', scores: { dreamer: 3, adventurer: 2 } }
      ]
    },
    {
      id: 7,
      text: '做投資決定前，你會？',
      options: [
        { id: 1, text: '詢問親友或專家意見', scores: { guardian: 3, planner: 2 } },
        { id: 2, text: '看新聞和網路文章', scores: { planner: 2, dreamer: 1 } },
        { id: 3, text: '深入研究財報和技術分析', scores: { analyst: 3, adventurer: 1 } },
        { id: 4, text: '憑感覺和直覺判斷', scores: { adventurer: 2, dreamer: 3 } }
      ]
    },
    {
      id: 8,
      text: '面對複雜的投資商品，你會？',
      options: [
        { id: 1, text: '完全不碰，太複雜了', scores: { guardian: 3 } },
        { id: 2, text: '請專家幫忙分析後再決定', scores: { planner: 3, guardian: 1 } },
        { id: 3, text: '自己研究清楚才投資', scores: { analyst: 3, planner: 1 } },
        { id: 4, text: '先小額試試看', scores: { adventurer: 2, dreamer: 3 } }
      ]
    },
    {
      id: 9,
      text: '當朋友推薦投資標的時，你會？',
      options: [
        { id: 1, text: '謝謝但不會跟進', scores: { guardian: 2, analyst: 1 } },
        { id: 2, text: '詳細了解後謹慎考慮', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '自己研究驗證再決定', scores: { analyst: 3 } },
        { id: 4, text: '信任朋友，小額跟進', scores: { adventurer: 2, dreamer: 3 } }
      ]
    },
    {
      id: 10,
      text: '你的消費習慣是？',
      options: [
        { id: 1, text: '精打細算，能省則省', scores: { guardian: 3, planner: 1 } },
        { id: 2, text: '有預算規劃，量入為出', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '該花就花，但會比較CP值', scores: { analyst: 2, dreamer: 2 } },
        { id: 4, text: '喜歡就買，享受當下', scores: { adventurer: 3, dreamer: 1 } }
      ]
    },
    {
      id: 11,
      text: '對於新的理財工具或服務，你的態度是？',
      options: [
        { id: 1, text: '觀望，等別人用過再說', scores: { guardian: 3, planner: 2 } },
        { id: 2, text: '謹慎評估優缺點', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '深入了解運作原理', scores: { analyst: 3 } },
        { id: 4, text: '勇於嘗試新事物', scores: { adventurer: 3, dreamer: 3 } }
      ]
    },
    {
      id: 12,
      text: '你認為投資最重要的是？',
      options: [
        { id: 1, text: '保本，不要賠錢', scores: { guardian: 3 } },
        { id: 2, text: '紀律，按計畫執行', scores: { planner: 3, analyst: 2 } },
        { id: 3, text: '知識，多學習研究', scores: { analyst: 3, planner: 1 } },
        { id: 4, text: '勇氣，敢於承擔風險', scores: { adventurer: 3, dreamer: 2 } }
      ]
    }
  ];
  res.json(questions);
});

// Handle SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
