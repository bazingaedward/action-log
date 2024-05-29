import { clone, cloneDeep } from 'lodash';
import { BACKEND_URL, DEFAULT_INIT_OPTIONS } from './constant';
import { warnMsg } from './utils';
import {
  type UserInfo,
  type InitOptions,
  type Status,
  type InitParams,
  type SendParams,
  EmitModeEnum,
  FlushModeStatus,
} from './typing';
export { EventTypeEnum, BusinessModuleEnum } from './typing';

/**
 * 用户行为分析上报
 */
export class ActionLog {
  private _metaInfo: {};
  private _userInfo: UserInfo | null;
  private _options: InitOptions;
  private _status: Status;
  private _flush?: FlushModeStatus;

  constructor(enable?: boolean) {
    this._metaInfo = {};
    this._options = clone(DEFAULT_INIT_OPTIONS);
    this._userInfo = null;
    this._status = {
      inited: false,
      enable: enable ?? true,
    };
  }

  _enableDebug() {
    return this._options.debug;
  }

  _getEmitMode() {
    return this._options.mode;
  }

  getMetaInfo() {
    return this._metaInfo;
  }

  getFlushInfo() {
    return this._flush;
  }

  /**
   * 初始化配置，每个项目的模块名称等信息
   */
  init(params: InitParams, options?: InitOptions) {
    this._metaInfo = params;

    // 解析options
    Object.assign(this._options, options || {});
    const { global } = this._options;

    // 挂载全局变量
    if (global && window) {
      window._actionLog = this;
    }

    // 初始化触发模式
    this._initMode();

    // 修改状态
    this._status.inited = true;
  }

  _initMode() {
    const { mode, flushLimit } = this._options;
    switch (mode) {
      case EmitModeEnum.FLUSH: {
        this._flush = {
          list: [],
          limit: flushLimit ?? 10,
        };
      }
      case EmitModeEnum.SINGLE:
      default: {
        // do nothing
      }
    }
  }

  /**
   *  设置用户信息
   */
  setUserInfo(info: UserInfo) {
    this._userInfo = info;
  }

  /**
   * 检查当前配置&状态是否正常，在send前做校验
   * @returns
   */
  _checkStatus() {
    let pass = true;
    // 拦截检查：如果未启用，提醒用户
    if (!this._status.enable) {
      warnMsg('未启用，请检查初始化操作');
      pass = false;
      return pass;
    }

    // 拦截检查：如果未初始化，提醒用户
    if (!this._status.inited) {
      warnMsg('未初始化，请执行init后再调用');
      pass = false;
      return pass;
    }

    return pass;
  }

  /**
   * 聚合参数,event注入时间戳
   * @param params
   * @returns
   */
  getUploadParams(params: SendParams) {
    let content: object = {
      meta: this._metaInfo,
      page: this._getPageInfo(),
      terminal: this._getTerminalInfo(),
      userInfo: this._getUserInfo(),
      event: {
        ...params,
        timestamp: Date.now(),
      },
    };

    // 基于mode判断
    switch (this._getEmitMode()) {
      case EmitModeEnum.SINGLE: {
        // do nothing
        break;
      }
      case EmitModeEnum.FLUSH: {
        const { list, limit } = this._flush as FlushModeStatus;
        if (list.length >= limit) {
          content = cloneDeep(list);
          list.splice(0, limit);
        }
        list.push(content);
        break;
      }
    }

    return content;
  }

  /**
   * @param params
   */
  send(params: SendParams = {}) {
    // 检查是否初始化
    if (!this._status.inited) return;

    // 添加状态检查
    const isValidate = this._checkStatus();
    if (!isValidate) return;

    const content = this.getUploadParams(params);

    // TODO: 配置xhr 和fetch多种类的接口调用,顺序应该是sendBeacon,fetch, xhr
    try {
      fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('ticket')}`,
        },
        body: JSON.stringify(content),
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * 获取页面相关参数
   * @returns
   */
  _getPageInfo() {
    return {
      url: location.href,
    };
  }

  /**
   * 获取终端相关参数，包括系统内核，na等
   * @returns
   */
  _getTerminalInfo() {
    const info = {};
    if ('navigator' in window) {
      const { userAgent, language, platform } = window.navigator;
      Object.assign(info, {
        userAgent: userAgent,
        language: language,
        // platform is deprecated
        osType: platform ?? '',
      });
    }

    if ('screen' in window) {
      Object.assign(info, {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      });
    }
    return info;
  }

  /**
   * 获取用户信息，包括id,name等等
   * @returns
   */
  _getUserInfo() {
    if (!this._userInfo) {
      throw new Error('ActionLog: 未获取到用户信息');
    }
    return this._userInfo;
  }

  // TODO: 支持本地化的存储设置，eg indexDB等
  flush() {}

  // TODO: 支持自动解析data-*的click事件
}

export default ActionLog;
