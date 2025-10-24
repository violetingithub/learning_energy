# API 服务使用指南

本目录包含基于axios封装的网络请求服务及项目相关的API接口定义。

## 目录结构

```
src/api/
├── ApiService.js      # 基础axios封装类
├── learningApi.js     # 学习能量站相关业务API
└── README.md          # 本使用指南
```

## ApiService 类

`ApiService`是一个基于axios的网络请求封装类，提供了统一的请求配置、拦截器和常用请求方法。

### 主要特性

- 统一的请求配置（基础URL、超时时间等）
- 请求/响应拦截器（自动添加token、错误处理等）
- 支持常见的HTTP方法（GET、POST、PUT、DELETE、PATCH）
- 文件上传和下载功能
- 可配置的请求超时和基础URL

### 使用方法

#### 直接使用默认实例

```javascript
import apiService from './ApiService';

// 发送GET请求
apiService.get('/users', { page: 1 })
  .then(data => {
    console.log('获取用户列表成功:', data);
  })
  .catch(error => {
    console.error('获取用户列表失败:', error);
  });

// 发送POST请求
apiService.post('/login', { username: 'admin', password: '123456' })
  .then(data => {
    console.log('登录成功:', data);
  })
  .catch(error => {
    console.error('登录失败:', error);
  });
```

#### 创建自定义实例

```javascript
import { ApiService } from './ApiService';

// 创建自定义实例
const customApiService = new ApiService();

// 配置自定义实例
customApiService.setBaseURL('https://api.example.com');
customApiService.setTimeout(15000);

// 使用自定义实例发送请求
customApiService.get('/custom-endpoint')
  .then(data => {
    console.log('请求成功:', data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

### 常用方法

- `get(url, params, config)` - 发送GET请求
- `post(url, data, config)` - 发送POST请求
- `put(url, data, config)` - 发送PUT请求
- `delete(url, config)` - 发送DELETE请求
- `patch(url, data, config)` - 发送PATCH请求
- `upload(url, formData, config)` - 上传文件
- `download(url, params, config)` - 下载文件
- `setTimeout(timeout)` - 设置请求超时时间
- `setBaseURL(baseURL)` - 设置基础URL

## learningApi 模块

`learningApi`是根据项目业务需求封装的API集合，包含与学习、宠物、能量等相关的接口。

### 主要API分类

- **学习能量相关**: 获取和更新学习能量
- **宠物相关**: 获取宠物状态、更新宠物状态、与宠物互动
- **学习记录相关**: 获取和创建学习计时记录
- **其他**: 获取签文、任务、用户统计、排行榜等

### 使用方法

```javascript
import learningApi from './learningApi';

// 获取学习能量
learningApi.getLearningEnergy()
  .then(data => {
    console.log('学习能量数据:', data);
  })
  .catch(error => {
    console.error('获取学习能量失败:', error);
  });

// 与宠物互动
learningApi.interactWithPet('pet123', 'feed')
  .then(result => {
    console.log('喂食结果:', result);
  })
  .catch(error => {
    console.error('喂食失败:', error);
  });
```

## 配置环境变量

API服务支持通过环境变量配置基础URL。在项目的根目录创建`.env`文件，并添加以下配置：

```
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

如果未配置环境变量，将默认使用`/api`作为基础URL。

## 错误处理

API服务内部已经包含了基本的错误处理逻辑，会根据不同的错误类型输出相应的错误信息。您也可以在业务代码中添加自定义的错误处理：

```javascript
try {
  const data = await learningApi.getLearningEnergy();
  // 处理成功数据
} catch (error) {
  // 自定义错误处理
  if (error.response?.status === 401) {
    // 处理未授权错误
    alert('请先登录');
  } else {
    // 其他错误处理
    alert('操作失败，请稍后重试');
  }
}
```

## 注意事项

1. 所有API调用均返回Promise，建议使用async/await语法以提高代码可读性
2. 对于需要认证的接口，确保已在localStorage中存储了有效的token
3. 文件上传功能需要使用FormData对象
4. 在开发环境中，可以使用浏览器的Network面板查看请求详情
5. 如果API返回的数据结构与预期不符，请检查后端API文档或联系后端开发人员

## 扩展API

如果需要添加新的业务API，请在`learningApi.js`文件中按照现有格式添加相应的方法。如果需要创建新的API模块，可以参考`learningApi.js`的结构创建新文件。