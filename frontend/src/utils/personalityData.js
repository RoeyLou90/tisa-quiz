export const PERSONALITY_TYPES = {
  guardian: {
    title: "守護者型 (保守型)",
    iconClass: "🛡️",
    description:
      "穩重如山的理財高手。您重視本金安全，追求穩定收益，適合採取防守反擊型投資策略。",
    strengths: [
      "風險厭惡，注重本金安全",
      "追求穩定收益",
      "適合長期投資",
      "善於規避風險",
    ],
    weaknesses: [
      "可能錯過高成長機會",
      "投資組合可能過於保守",
      "可能錯過市場波動帶來的機會",
    ],
    investmentStrategy: "防守反擊型：以債券型基金為主，追求穩定配息收益",
    fundAllocation: [
      "100% 債券型基金",
      "建議選擇政府債券、投資等級企業債券",
      "每月3,000-5,000元定期定額投資",
    ],
    investmentFrequency: "每月定期定額",
    riskManagement: "設定停損點3%",
    services: [
      "零手續費債券基金",
      "專業投資顧問諮詢",
      "定期市場分析報告",
      "24小時客服支援",
    ],
  },
  planner: {
    title: "計畫家型 (穩健型)",
    iconClass: "🎯",
    description:
      "理性規劃的投資達人。您擅長長期規劃，追求資產平衡配置，適合採取穩健成長型投資策略。",
    strengths: ["擅長長期規劃", "平衡風險報酬", "重視資產配置", "適應市場變化"],
    weaknesses: ["可能過於保守", "可能錯過短期機會", "可能過度分析"],
    investmentStrategy: "穩健成長型：以平衡型基金為主，靈活調整資產配置",
    fundAllocation: [
      "100% 平衡型基金",
      "或股票型30% + 債券型70%",
      "根據市場狀況調整配置",
    ],
    investmentFrequency: "每季調整一次",
    riskManagement: "設定止損點5%",
    services: [
      "專業資產配置建議",
      "市場趨勢分析",
      "投資組合優化服務",
      "定期投資檢視",
    ],
  },
  adventurer: {
    title: "冒險家型 (積極型)",
    iconClass: "🚀",
    description:
      "勇於追求高報酬的投資先鋒。您能承受波動，追求長期資本增值，適合採取積極成長型投資策略。",
    strengths: ["勇於承擔風險", "追求高報酬", "長期投資視野", "善於抓住機會"],
    weaknesses: ["可能承受較大波動", "可能過度冒險", "需要較長投資期間"],
    investmentStrategy: "積極成長型：以股票型基金為主，追求長期資本增值",
    fundAllocation: [
      "股票型70% + 平衡型30%",
      "建議選擇台股、美股、全球股票基金",
      "長期持有享受複利效果",
    ],
    investmentFrequency: "每季調整一次",
    riskManagement: "設定止損點8%",
    services: ["全球市場分析", "投資時機建議", "風險控制策略", "投資教育資源"],
  },
  analyst: {
    title: "理性分析師型 (研究型)",
    iconClass: "🧠",
    description:
      "數據導向的投資專家。您擅長深度研究，追求理性投資，適合採取專業研究型投資策略。",
    strengths: ["深度研究能力", "數據導向決策", "善於分散投資", "理性判斷市場"],
    weaknesses: ["可能過度分析", "可能錯過行動時機", "需要較多時間研究"],
    investmentStrategy: "專業研究型：根據經濟循環調整資產配置",
    fundAllocation: [
      "股票型40% + 平衡型30% + 債券型30%",
      "根據經濟循環調整比例",
      "多樣化投資組合",
    ],
    investmentFrequency: "每季調整一次",
    riskManagement: "動態調整止損點",
    services: ["專業研究報告", "經濟循環分析", "投資組合優化", "風險評估工具"],
  },
  dreamer: {
    title: "靈活夢想家型 (成長型)",
    iconClass: "🌟",
    description:
      "追求成長潛力的投資夢想家。您關注長期成長，願意學習進步，適合採取成長導向型投資策略。",
    strengths: ["關注成長潛力", "願意學習進步", "長期投資視野", "善於發現機會"],
    weaknesses: ["可能過於樂觀", "需要更多研究", "可能承受較大波動"],
    investmentStrategy: "成長導向型：聚焦成長性資產，分散時間風險",
    fundAllocation: [
      "股票型60% + 平衡型40%",
      "階段性加碼股票型基金",
      "長期持有享受複利",
    ],
    investmentFrequency: "每月定期定額",
    riskManagement: "設定止損點6%",
    services: [
      "成長型基金建議",
      "投資教育資源",
      "市場趨勢分析",
      "定期投資檢視",
    ],
  },
};

export const calculatePersonality = (scores) => {
  // Calculate total scores for each personality type
  const totalScores = {
    guardian: scores.guardian || 0,
    planner: scores.planner || 0,
    adventurer: scores.adventurer || 0,
    analyst: scores.analyst || 25, // Default for new users
    dreamer: scores.dreamer || 0,
  };

  // Sort personalities by score
  const sortedScores = Object.entries(totalScores).sort(
    ([, a], [, b]) => b - a
  );

  const [highest, secondHighest] = sortedScores;

  // Determine personality type
  if (highest[1] >= 25 && highest[1] - secondHighest[1] >= 5) {
    return PERSONALITY_TYPES[highest[0]];
  } else if (highest[1] >= 20) {
    // Mixed personality type
    return {
      ...PERSONALITY_TYPES[highest[0]],
      title: `${PERSONALITY_TYPES[highest[0]].title} + ${
        PERSONALITY_TYPES[secondHighest[0]].title
      }`,
      description: `您屬於混合型投資人格，主要表現為${
        PERSONALITY_TYPES[highest[0]].title
      }，但也具有${PERSONALITY_TYPES[secondHighest[0]].title}的特質。`,
      strengths: [
        ...PERSONALITY_TYPES[highest[0]].strengths.slice(0, 2),
        ...PERSONALITY_TYPES[secondHighest[0]].strengths.slice(0, 2),
      ],
      weaknesses: [
        ...PERSONALITY_TYPES[highest[0]].weaknesses.slice(0, 1),
        ...PERSONALITY_TYPES[secondHighest[0]].weaknesses.slice(0, 1),
      ],
      investmentStrategy: `${
        PERSONALITY_TYPES[highest[0]].investmentStrategy
      } + ${PERSONALITY_TYPES[secondHighest[0]].investmentStrategy}`,
      fundAllocation: [
        ...PERSONALITY_TYPES[highest[0]].fundAllocation,
        ...PERSONALITY_TYPES[secondHighest[0]].fundAllocation,
      ],
      investmentFrequency: `${
        PERSONALITY_TYPES[highest[0]].investmentFrequency
      } + ${PERSONALITY_TYPES[secondHighest[0]].investmentFrequency}`,
      riskManagement: `${PERSONALITY_TYPES[highest[0]].riskManagement} + ${
        PERSONALITY_TYPES[secondHighest[0]].riskManagement
      }`,
      services: [
        ...PERSONALITY_TYPES[highest[0]].services,
        ...PERSONALITY_TYPES[secondHighest[0]].services,
      ],
    };
  } else {
    // Default to planner type if all scores are low
    return PERSONALITY_TYPES.planner;
  }
};
