export enum BusinessModuleEnum {
  YMS = 'YMS',
  BI = 'BI',
  USER_CENTER = 'User Center',
}

export enum EventTypeEnum {
  CLICK = 'CLICK',
  PAGE_URL_CHANGE = 'PAGE_URL_CHANGE',
}

export enum EmitModeEnum {
  SINGLE = 'single',
  FLUSH = 'flush',
}

export type FlushModeStatus = {
  limit: number;
  list: object[];
};

export interface InitParams {
  /**
   * 模块名称，eg: bi,yms等
   */
  module: string;

  /**
   * 版本，用于相关的版本控制，可选项
   */
  version?: string | number;
}

export interface SendParams {}

export interface UserInfo {
  /**
   * 用户id，eg: 6094
   */
  userId: number;
  /**
   * 用户拼音缩写，eg: san.zhang
   */
  username: string;
  /**
   * 用户email，eg: san.zhang@guwave.com
   */
  email?: string;
}

export interface InitOptions {
  /**
   * 是否将ActionLog 实例挂载到window全局对象：window._actionLog, 默认false
   */
  global?: boolean;
  /**
   * 是否开启debug模式，用于打印额外的冗余信息便于调试, 默认false
   */
  debug?: boolean;
  /**
   * 发送模式
   * - single（默认）：实时发送上报，在大数据量场景可能影响性能
   * - flush: 内存队列流模式，默认将事件放在队列中，如果队列长度超过flushLimit,则一次性批量上报
   */
  mode?: EmitModeEnum;
  /**
   * 发送模式
   * - single（默认）：实时发送上报，在大数据量场景可能影响性能
   * - flush: 内存队列流模式，默认换成
   */
  flushLimit?: number;
}

export interface Status {
  inited: boolean;
  enable: boolean;
}
