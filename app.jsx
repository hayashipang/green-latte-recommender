const { useState, useEffect } = React;

function GreenLatteRecommender() {
  const [taste, setTaste] = useState("");
  const [scene, setScene] = useState("");
  const [greenLevel, setGreenLevel] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [fruitFlavor, setFruitFlavor] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [result, setResult] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fortuneData, setFortuneData] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  // 當星座改變時，自動獲取運勢
  useEffect(() => {
    if (zodiac && window.geminiService) {
      fetchFortuneData();
    }
  }, [zodiac]);

  // 獲取運勢數據
  const fetchFortuneData = async () => {
    
    setLoading(true);
    
    // 先嘗試使用模擬數據
    try {
      const mockFortuneData = {
        scores: {
          overall: 4,
          love: 3,
          career: 4,
          wealth: 3
        },
        averageScore: 3.5,
        fortuneLevel: 'high',
        rawText: `${zodiac}今日運勢：整體4星，愛情3星，事業4星，財運3星。幸運水果：芒果。今日建議：保持積極態度。`
      };
      
      setFortuneData(mockFortuneData);
      
    } catch (error) {
      console.error('設置模擬數據失敗:', error);
    }
    
    // 同時嘗試真實 API
    if (window.geminiService) {
      try {
        const fortuneText = await window.geminiService.getZodiacFortune(zodiac);
        
        if (fortuneText) {
          const parsedFortune = window.geminiService.parseFortuneText(fortuneText);
          setFortuneData(parsedFortune);
        }
      } catch (error) {
        console.error('真實 API 失敗，使用模擬數據:', error);
      }
    }
    
    setLoading(false);
  };

  // 獲取AI推薦
  const getAiRecommendation = async () => {
    if (!window.geminiService) return null;
    
    try {
      const userPreferences = {
        taste,
        scene,
        greenLevel,
        bloodSugar
      };

      const recommendation = await window.geminiService.getGreenLatteRecommendation(
        zodiac, 
        userPreferences
      );
      
      return recommendation;
    } catch (error) {
      console.error('AI推薦生成失敗:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // 嘗試獲取AI推薦
    let aiRec = null;
    if (zodiac && window.geminiService) {
      aiRec = await getAiRecommendation();
      setAiRecommendation(aiRec);
    }
    
    // 如果AI推薦失敗，使用原有邏輯
    if (!aiRec) {
      // 原有邏輯
      let recommendation = "";
      let reason = "";
      let fruitSuggestion = "";
      let zodiacMessage = "";

    // 星座幸運水果分析
    if (zodiac) {
      const zodiacFruitMap = {
        "牡羊座": { 
          lucky: "芒果", 
          message: "芒果是你的幸運果！今天選擇芒果會為你帶來活力和好運氣。", 
          nutrition: "維生素C含量高，口感香甜順滑。",
          guidance: "衝勁十足，適合啟動新計劃，但記得三思而後行。芒果熱情明亮，幫你勇敢前進又不失活力。"
        },
        "金牛座": { 
          lucky: "藍莓", 
          message: "藍莓是你的幸運果！今天選擇藍莓會為你帶來穩定和豐盛。", 
          nutrition: "富含抗氧化物質，有助於提升免疫力。",
          guidance: "務實的一天，適合專心在穩定的任務上，不急不躁最有收穫。藍莓小巧踏實，象徵穩定與安心。"
        },
        "雙子座": { 
          lucky: "藍莓", 
          message: "藍莓是你的幸運果！今天選擇藍莓會為你帶來智慧和靈感。", 
          nutrition: "富含抗氧化物質，有助於提升免疫力。",
          guidance: "靈感特別多，適合表達、交流，但要避免三心二意。藍莓酸甜多變，幫你靈活轉換、保持活力。"
        },
        "巨蟹座": { 
          lucky: "奇異果", 
          message: "奇異果是你的幸運果！今天選擇奇異果會為你帶來溫暖和保護。", 
          nutrition: "維生素C之王，酸甜清爽。",
          guidance: "感性的一天，適合照顧家人朋友，展現你的溫柔體貼。奇異果酸甜清爽，幫你保持溫暖與關懷。"
        },
        "獅子座": { 
          lucky: "芒果", 
          message: "芒果是你的幸運果！今天選擇芒果會為你帶來自信和魅力。", 
          nutrition: "維生素C含量高，口感香甜順滑。",
          guidance: "你容易成為焦點，但要注意別太心急，適合展現領導力。芒果象徵自信與能量，幫你保持熱情與魅力。"
        },
        "處女座": { 
          lucky: "奇異果", 
          message: "奇異果是你的幸運果！今天選擇奇異果會為你帶來完美和健康。", 
          nutrition: "維生素C之王，酸甜清爽。",
          guidance: "注重細節的一天，適合整理規劃，追求完美但別太苛求。奇異果營養豐富，象徵健康與完美。"
        },
        "天秤座": { 
          lucky: "藍莓", 
          message: "藍莓是你的幸運果！今天選擇藍莓會為你帶來平衡和和諧。", 
          nutrition: "富含抗氧化物質，有助於提升免疫力。",
          guidance: "適合談合作、交朋友，平衡好自己的立場更順利。藍莓酸甜協調，幫你在人際間保持優雅。"
        },
        "天蠍座": { 
          lucky: "火龍果", 
          message: "火龍果是你的幸運果！今天選擇火龍果會為你帶來深度和轉化。", 
          nutrition: "含有豐富的膳食纖維，有助於腸道健康。",
          guidance: "專注會讓你看見別人忽略的細節，適合處理需要深度的事。火龍果顏色鮮明卻內斂，象徵深邃與力量。"
        },
        "射手座": { 
          lucky: "芒果", 
          message: "芒果是你的幸運果！今天選擇芒果會為你帶來冒險和自由。", 
          nutrition: "維生素C含量高，口感香甜順滑。",
          guidance: "冒險精神會帶來新機會，適合學習或拓展視野。芒果香甜奔放，象徵自由與探索。"
        },
        "摩羯座": { 
          lucky: "奇異果", 
          message: "奇異果是你的幸運果！今天選擇奇異果會為你帶來成功和成就。", 
          nutrition: "維生素C之王，酸甜清爽。",
          guidance: "穩紮穩打的一天，適合專注於長期目標，堅持會帶來收穫。奇異果營養豐富，象徵成功與成就。"
        },
        "水瓶座": { 
          lucky: "火龍果", 
          message: "火龍果是你的幸運果！今天選擇火龍果會為你帶來創新和獨特。", 
          nutrition: "含有豐富的膳食纖維，有助於腸道健康。",
          guidance: "今天適合跳脫框架，嘗試不同思路會帶來驚喜。火龍果外表獨特，內心驚喜，象徵創意與自由。"
        },
        "雙魚座": { 
          lucky: "火龍果", 
          message: "火龍果是你的幸運果！今天選擇火龍果會為你帶來直覺和靈性。", 
          nutrition: "含有豐富的膳食纖維，有助於腸道健康。",
          guidance: "感性的一天，適合發揮想像力或表達浪漫情感。火龍果清甜夢幻，幫你展現浪漫與溫柔。"
        }
      };

      const zodiacInfo = zodiacFruitMap[zodiac];
      if (zodiacInfo) {
        fruitSuggestion = `搭配${zodiacInfo.lucky}，${zodiacInfo.nutrition}`;
        zodiacMessage = `✨ ${zodiacInfo.message} 🌟 ${zodiacInfo.guidance}`;
      }
    }

    // 優先考慮血糖問題
    if (bloodSugar === "有血糖問題") {
      if (taste === "清爽" && greenLevel === "愛吃蔬菜" && !zodiac) {
        recommendation = "100% 蔬菜系列（低糖版）";
        reason = "專為血糖控制設計，以蔬菜為主，避免高糖水果，適合血糖管理的你。";
      } else {
        recommendation = "7:3 系列（低糖版）";
        reason = "控制水果比例，選擇低升糖指數的蔬果，幫助穩定血糖。";
      }
    } else {
      // 原有邏輯，但考慮星座水果選擇
      if (taste === "清爽" && greenLevel === "愛吃蔬菜" && !zodiac) {
        recommendation = "100% 蔬菜系列";
        reason = "適合喜歡蔬菜感、想要清爽無負擔的你。";
      } else if (taste === "均衡" || zodiac) {
        recommendation = "7:3 系列";
        reason = "蔬果兼具，營養與風味都平衡。";
      } else if (taste === "甜美" || greenLevel === "怕青味") {
        recommendation = "5:5 系列";
        reason = "水果比例高，口感更甜美、容易入口。";
      } else {
        recommendation = "7:3 系列";
        reason = "均衡營養，適合日常飲用。";
      }
    }

    // 如果有選擇水果口味，加入水果建議
    if (fruitSuggestion) {
      reason += " " + fruitSuggestion;
    }

    // 加入星座訊息
    if (zodiacMessage) {
      reason += " " + zodiacMessage;
    }

      setResult({ recommendation, reason });
    }
    
    setLoading(false);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWheelResult(null);
    
    // 轉盤獎品配置
    const prizes = [
      { name: "折5元", emoji: "💰", probability: 45 },
      { name: "折2元", emoji: "💵", probability: 35 },
      { name: "免費再來一罐", emoji: "🥤", probability: 20 }
    ];
    
    // 模擬轉盤動畫
    setTimeout(() => {
      // 隨機選擇獎品
      const random = Math.random() * 100;
      let cumulativeProbability = 0;
      let selectedPrize = prizes[0];
      
      for (let prize of prizes) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
          selectedPrize = prize;
          break;
        }
      }
      
      setWheelResult(selectedPrize);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🥬 果然盈綠拿鐵推薦小幫手 🥤</h1>
        <p className="subtitle">找到最適合你的綠拿鐵</p>
      </div>

      <div className="form-container">
        {/* 問題 1 */}
        <div className="question-group">
          <label className="question-label">1. 你偏好的口味？</label>
          <select
            className="select-input"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="清爽">清爽（偏蔬菜）</option>
            <option value="均衡">均衡</option>
            <option value="甜美">甜美（偏水果）</option>
          </select>
        </div>

        {/* 問題 2 */}
        <div className="question-group">
          <label className="question-label">2. 主要飲用情境？</label>
          <select
            className="select-input"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="早餐">早餐代餐</option>
            <option value="運動">運動後補充</option>
            <option value="下午">下午享用</option>
            <option value="晚餐">搭配晚餐</option>
          </select>
        </div>

        {/* 問題 3 */}
        <div className="question-group">
          <label className="question-label">3. 你對蔬菜青味的接受度？</label>
          <select
            className="select-input"
            value={greenLevel}
            onChange={(e) => setGreenLevel(e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="愛吃蔬菜">愛吃蔬菜</option>
            <option value="還好">還好，蔬果都可以</option>
            <option value="怕青味">怕青味</option>
          </select>
        </div>

        {/* 問題 4 */}
        <div className="question-group">
          <label className="question-label">4. 是否有血糖相關問題？</label>
          <select
            className="select-input"
            value={bloodSugar}
            onChange={(e) => setBloodSugar(e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="沒有血糖問題">沒有血糖問題</option>
            <option value="有血糖問題">有血糖問題（糖尿病、血糖偏高）</option>
          </select>
        </div>

        {/* 問題 5 */}
        <div className="question-group">
          <label className="question-label">5. 你的星座？</label>
          <select
            className="select-input"
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
          >
            <option value="">請選擇</option>
            <option value="牡羊座">♈ 牡羊座 (3/21-4/19)</option>
            <option value="金牛座">♉ 金牛座 (4/20-5/20)</option>
            <option value="雙子座">♊ 雙子座 (5/21-6/20)</option>
            <option value="巨蟹座">♋ 巨蟹座 (6/21-7/22)</option>
            <option value="獅子座">♌ 獅子座 (7/23-8/22)</option>
            <option value="處女座">♍ 處女座 (8/23-9/22)</option>
            <option value="天秤座">♎ 天秤座 (9/23-10/22)</option>
            <option value="天蠍座">♏ 天蠍座 (10/23-11/21)</option>
            <option value="射手座">♐ 射手座 (11/22-12/21)</option>
            <option value="摩羯座">♑ 摩羯座 (12/22-1/19)</option>
            <option value="水瓶座">♒ 水瓶座 (1/20-2/18)</option>
            <option value="雙魚座">♓ 雙魚座 (2/19-3/20)</option>
          </select>
        </div>


        {/* 運勢卡片 */}
        {fortuneData && (
          <div className="fortune-card">
            <h3>🔮 {zodiac} 今日運勢</h3>
            <div className="fortune-scores">
              <div className="score-item">
                <span>整體運勢</span>
                <span>{'⭐'.repeat(fortuneData.scores.overall)}</span>
              </div>
              <div className="score-item">
                <span>愛情運勢</span>
                <span>{'⭐'.repeat(fortuneData.scores.love)}</span>
              </div>
              <div className="score-item">
                <span>事業運勢</span>
                <span>{'⭐'.repeat(fortuneData.scores.career)}</span>
              </div>
              <div className="score-item">
                <span>財運</span>
                <span>{'⭐'.repeat(fortuneData.scores.wealth)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 按鈕 */}
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={loading}
        >
          {loading ? "🔮 AI占星師分析中..." : "🎯 取得AI推薦"}
        </button>

        {/* 結果 */}
        {(result || aiRecommendation) && (
          <div className="result-container">
            <div className="result-header">
              <h2>✨ AI占星師推薦</h2>
            </div>
            <div className="result-content">
              {/* AI推薦 */}
              {aiRecommendation && (
                <div className="ai-recommendation">
                  <h3>🔮 AI占星師分析</h3>
                  <p>{aiRecommendation}</p>
                </div>
              )}
              
              {/* 原有推薦 */}
              {result && (
                <div className="traditional-recommendation">
                  <h3 className="recommendation">{result.recommendation}</h3>
                  <p className="reason">{result.reason}</p>
                </div>
              )}
              

              {/* 每日小貼士 */}
              <div className="daily-tip">
                <h4>💡 今日健康小貼士</h4>
                <p>綠拿鐵最好在製作後30分鐘內飲用，以保持最佳營養價值！</p>
              </div>

              {/* 每日幸運轉盤 */}
              <div className="wheel-section">
                <h4>🎰 每日幸運轉盤</h4>
                <p>轉轉看你的幸運獎品。</p>
                
                <button 
                  className={`wheel-button ${isSpinning ? 'spinning' : ''}`}
                  onClick={spinWheel}
                  disabled={isSpinning}
                >
                  {isSpinning ? '🎰 轉轉轉...' : '🎰 轉轉看'}
                </button>

                {wheelResult && (
                  <div className="wheel-result">
                    <div className="prize-display">
                      <div className="prize-emoji">{wheelResult.emoji}</div>
                      <div className="prize-name">{wheelResult.name}</div>
                    </div>
                    
                    {wheelResult.name === "折5元" && (
                      <div className="prize-details">
                        <p>🎉 恭喜獲得折5元優惠！</p>
                        <p>優惠碼：<strong>SAVE5</strong></p>
                        <p>有效期限：當天，單次使用</p>
                      </div>
                    )}
                    
                    {wheelResult.name === "折2元" && (
                      <div className="prize-details">
                        <p>🎉 恭喜獲得折2元優惠！</p>
                        <p>優惠碼：<strong>SAVE2</strong></p>
                        <p>有效期限：當天，單次使用</p>
                      </div>
                    )}
                    
                    {wheelResult.name === "免費再來一罐" && (
                      <div className="prize-details">
                        <p>🎉 太幸運了！免費再來一罐！</p>
                        <p>請到店出示此畫面兌換</p>
                        <p>有效期限：當天，單次使用</p>
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 渲染應用程式
ReactDOM.render(<GreenLatteRecommender />, document.getElementById('root'));
