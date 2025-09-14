// Gemini API 服務 - 簡化版，直接整合到React應用
class GeminiService {
  constructor() {
    this.apiKey = 'AIzaSyDo2Ffl9V0dhQmj2RPHC70bSVP9zQpjEQg';
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
  }

  // 獲取星座運勢
  async getZodiacFortune(zodiac) {
    const prompt = `
你是專業的占星師，請為${zodiac}分析今日運勢，並推薦適合的綠拿鐵水果。

請按照以下格式回答，每項控制在10字內：

**整體運勢：** [1-5星評分] [簡短描述]
**愛情運勢：** [1-5星評分] [簡短描述]
**事業運勢：** [1-5星評分] [簡短描述]
**財運：** [1-5星評分] [簡短描述]

**幸運水果：** [只能從火龍果、奇異果、芒果、藍莓中選擇1-2種]
**水果理由：** [10字內說明]
**今日建議：** [10字內建議]

請用繁體中文回答，語氣要專業且溫暖，總字數控制在50字內。
`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API請求失敗: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('API返回格式錯誤');
      }
    } catch (error) {
      console.error('Gemini API錯誤:', error);
      return null;
    }
  }

  // 生成個性化綠拿鐵推薦
  async getGreenLatteRecommendation(zodiac, userPreferences) {
    const { taste, scene, greenLevel, bloodSugar } = userPreferences;
    
    const prompt = `
你是綠拿鐵推薦專家，請根據以下信息推薦最適合的綠拿鐵配方：

**用戶信息：**
- 星座：${zodiac}
- 口味偏好：${taste || '未指定'}
- 飲用情境：${scene || '未指定'}
- 蔬菜接受度：${greenLevel || '未指定'}
- 血糖狀況：${bloodSugar || '未指定'}

**請按照以下格式推薦，每項獨立一行：**

哈囉！${zodiac}的朋友，為你推薦${scene || '今日'}綠拿鐵：

1. 綠拿鐵系列： [100%蔬菜/7:3/5:5] ([蔬菜:水果]比例)

2. 水果： [只能從火龍果、奇異果、芒果、藍莓中選擇1-2種] （[簡短營養說明]）

3. 推薦理由： [20字內，結合星座特質和情境的推薦理由]

請確保每個項目都獨立一行，不要連續排列。

請用繁體中文回答，語氣要親切專業，總字數控制在100字內。
`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.7,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API請求失敗: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('API返回格式錯誤');
      }
    } catch (error) {
      console.error('推薦生成錯誤:', error);
      return null;
    }
  }

  // 解析運勢文本，提取評分
  parseFortuneText(fortuneText) {
    if (!fortuneText) return null;

    const scores = {
      overall: 3,
      love: 3,
      career: 3,
      wealth: 3
    };

    // 提取星級評分
    const starPattern = /(\d+)[星⭐]/g;
    const matches = fortuneText.match(starPattern);
    
    if (matches) {
      scores.overall = parseInt(matches[0]) || 3;
      scores.love = parseInt(matches[1]) || 3;
      scores.career = parseInt(matches[2]) || 3;
      scores.wealth = parseInt(matches[3]) || 3;
    }

    // 計算平均運勢
    const averageScore = (scores.overall + scores.love + scores.career + scores.wealth) / 4;
    
    // 根據平均分確定運勢等級
    let fortuneLevel = 'medium';
    if (averageScore >= 4) {
      fortuneLevel = 'high';
    } else if (averageScore <= 2) {
      fortuneLevel = 'low';
    }

    return {
      scores,
      averageScore,
      fortuneLevel,
      rawText: fortuneText
    };
  }
}

// 創建全局實例
window.geminiService = new GeminiService();
