import axios from 'axios';

// 抽签生成的话术提示词
export const ChouQianPrompt = `请为我生成一段鼓励学习的话术，要求：
1. 字数在35-45个字之间
2. 突出学习的意义和美好前景
3. 强调克服困难的重要性和学习者具备的潜力
4. 从 （宜学习、宜积累、宜休息、宜奋进） 中随机选出一个，字段名称 type
5. 请以JSON格式返回，包含字段 content type`;

//计时器生成的话术提示词
export const TimerPrompt = '请根据学习时间${time}（时间单位是秒）为我生成一段鼓励学习的话术，要求：\n1. 字数在100个字左右\n2. 突出学习的意义和美好前景\n3. 强调克服困难的重要性和学习者具备的潜力\n4. 如果学习时间很短可以适当批评督促\n5. 请以JSON格式返回，包含字段 content';

// 对话
export const AIChatPrompt = '请根据用户输入的信息：${content}，做出合理的回答。要求：\n1. 请以JSON格式返回，包含字段 content';

export const UserChatPrompt = '请根据用户输入的信息：${content}，进行好友对话。要求：\n1. 请以JSON格式返回，包含字段 content';


/**
 * 学习能量站相关API
 * 封装与学习、宠物、能量等相关的业务接口
 */
const learningApi = {

  /**
   * 调用大模型
   * @param {Object} params - 查询参数
   * @returns {Promise} 排行榜数据
   */
  generateAI(params = {}) {
    // 构建提示词
    const prompt = params.prompt ?? ChouQianPrompt
    return axios.post(
      'https://qianfan.baidubce.com/v2/chat/completions',
      {
        "model": "ernie-3.5-8k",
        "messages": [
          {
            "role": "system",
            "content": "平台助手"
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer bce-v3/ALTAK-G5scxzccyUs7YbZ9GO8R5/9c02d9539cd58d7b466243e2f483d64e47c3a3a1`
        }
      }
    );
  }
};

export default learningApi;