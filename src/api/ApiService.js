import axios from 'axios';

/**
 * 基于axios封装的网络请求服务类
 * 提供统一的请求配置、拦截器和API方法
 */
class ApiService {
  constructor() {
    // 创建axios实例
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || '/api', // API基础URL
      timeout: 10000, // 请求超时时间（毫秒）
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 初始化拦截器
    this._initInterceptors();
  }

  /**
   * 初始化axios拦截器
   * @private
   */
  _initInterceptors() {
    // 请求拦截器
    this.axios.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么，如添加token
        const token = this._getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // 处理请求错误
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axios.interceptors.response.use(
      (response) => {
        // 对响应数据做点什么
        return response.data;
      },
      (error) => {
        // 处理响应错误
        return this._handleError(error);
      }
    );
  }

  /**
   * 获取存储的token
   * @private
   * @returns {string|null} token字符串或null
   */
  _getToken() {
    try {
      return localStorage.getItem('token') || null;
    } catch (error) {
      console.error('获取token失败:', error);
      return null;
    }
  }

  /**
   * 处理请求错误
   * @private
   * @param {Error} error - 请求错误对象
   * @returns {Promise<never>} 拒绝的Promise
   */
  _handleError(error) {
    // 根据不同的错误类型进行处理
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页或刷新token
          console.error('未授权访问，请登录');
          // 可以在这里添加跳转到登录页的逻辑
          break;
        case 403:
          console.error('禁止访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${error.response.status} ${error.response.statusText}`);
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误，请检查网络连接');
    } else {
      // 设置请求时发生了错误
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }

  /**
   * GET请求方法
   * @param {string} url - 请求URL
   * @param {Object} [params] - 请求参数
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  get(url, params = {}, config = {}) {
    return this.axios.get(url, { params, ...config });
  }

  /**
   * POST请求方法
   * @param {string} url - 请求URL
   * @param {Object} [data] - 请求数据
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  post(url, data = {}, config = {}) {
    return this.axios.post(url, data, config);
  }

  /**
   * PUT请求方法
   * @param {string} url - 请求URL
   * @param {Object} [data] - 请求数据
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  put(url, data = {}, config = {}) {
    return this.axios.put(url, data, config);
  }

  /**
   * DELETE请求方法
   * @param {string} url - 请求URL
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  delete(url, config = {}) {
    return this.axios.delete(url, config);
  }

  /**
   * PATCH请求方法
   * @param {string} url - 请求URL
   * @param {Object} [data] - 请求数据
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  patch(url, data = {}, config = {}) {
    return this.axios.patch(url, data, config);
  }

  /**
   * 上传文件
   * @param {string} url - 请求URL
   * @param {FormData} formData - 包含文件的FormData对象
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 请求Promise
   */
  upload(url, formData, config = {}) {
    return this.axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    });
  }

  /**
   * 下载文件
   * @param {string} url - 请求URL
   * @param {Object} [params] - 请求参数
   * @param {Object} [config] - 额外配置
   * @returns {Promise} 文件下载Promise
   */
  download(url, params = {}, config = {}) {
    return this.axios.get(url, {
      responseType: 'blob',
      params,
      ...config
    }).then((response) => {
      // 创建下载链接并触发下载
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      
      // 从响应头中获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = 'download';
      if (contentDisposition) {
        const matches = /filename="([^\"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { fileName };
    });
  }

  /**
   * 设置请求超时时间
   * @param {number} timeout - 超时时间（毫秒）
   */
  setTimeout(timeout) {
    this.axios.defaults.timeout = timeout;
  }

  /**
   * 设置基础URL
   * @param {string} baseURL - API基础URL
   */
  setBaseURL(baseURL) {
    this.axios.defaults.baseURL = baseURL;
  }
}

// 创建ApiService实例
const apiService = new ApiService();

// 导出实例和类
export default apiService;
export { ApiService };