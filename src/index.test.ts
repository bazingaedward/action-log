import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ActionLog, BusinessModuleEnum } from './index';
import { EmitModeEnum } from './typing';

beforeAll(() => {});
describe('class ActionLog', () => {
  it('checked fail when created with false', () => {
    const al = new ActionLog(false);
    expect(al._checkStatus()).toBe(false);
  });

  it('如果未初始化，状态检查还是不通过', () => {
    const al = new ActionLog();
    expect(al._checkStatus()).toBe(false);
  });

  it('初始化参数module正确', () => {
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {},
    );
    expect(al.getMetaInfo()).toEqual({
      module: 'BI',
      version: 1,
    });
  });

  it('初始化参数后页面信息获取正确', () => {
    vi.stubGlobal('location', {
      href: '/hello',
    });
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {},
    );
    expect(al._getPageInfo()).toEqual({
      url: '/hello',
    });

    // 恢复全局对象
    vi.restoreAllMocks();
  });

  it('初始化参数后terminal信息获取正确', () => {
    const mockNavigator = {
      userAgent: 'ua',
      language: 'zh',
      platform: 'MacIntel',
    };
    const mockScreen = {
      width: 100,
      height: 100,
    };

    vi.stubGlobal('window', {
      navigator: mockNavigator,
      screen: mockScreen,
    });
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {},
    );
    expect(al._getTerminalInfo()).toEqual({
      language: 'zh',
      osType: 'MacIntel',
      screenHeight: 100,
      screenWidth: 100,
      userAgent: 'ua',
    });

    // 恢复全局对象
    vi.restoreAllMocks();
  });

  it('用户信息未初始化时获取信息报错', () => {
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {},
    );
    expect(() => al._getUserInfo()).toThrowError();
  });

  it('用户信息初始化后获取信息正确', () => {
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {},
    );

    const userInfo = {
      userId: 123,
      username: 'san.zhang',
    };

    al.setUserInfo(userInfo);
    expect(al._getUserInfo()).toEqual(userInfo);
  });

  it('single模式：参数匹配正确', () => {
    const mockTimestamp = 1625097600000; // 2021-07-01 00:00:00 UTC

    // 使用 vi.spyOn 来模拟 Date.now 方法
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {
        mode: EmitModeEnum.SINGLE,
      },
    );

    const userInfo = {
      userId: 123,
      username: 'san.zhang',
    };

    al.setUserInfo(userInfo);
    expect(al.getUploadParams({ hello: '123' })).toEqual({
      event: {
        hello: '123',
        timestamp: 1625097600000,
      },
      meta: {
        module: 'BI',
        version: 1,
      },
      page: {
        url: '/hello',
      },
      terminal: {
        language: 'zh',
        osType: 'MacIntel',
        screenHeight: 100,
        screenWidth: 100,
        userAgent: 'ua',
      },
      userInfo: {
        userId: 123,
        username: 'san.zhang',
      },
    });

    dateNowSpy.mockRestore();
  });

  it('Flush模式：如果超过limit限制，就要批量发送，并清空历史数据', () => {
    const al = new ActionLog();

    al.init(
      {
        module: BusinessModuleEnum.BI,
        version: 1,
      },
      {
        mode: EmitModeEnum.FLUSH,
        flushLimit: 5,
      },
    );

    expect(al.getFlushInfo()?.limit).toBe(5);

    const userInfo = {
      userId: 123,
      username: 'san.zhang',
    };

    al.setUserInfo(userInfo);

    for (let i = 0; i < 5; i++) {
      al.getUploadParams({});
      expect(al.getFlushInfo()?.list.length).toBe(i + 1);
    }

    // 超过范围后list清空重置
    al.getUploadParams({});
    expect(al.getFlushInfo()?.list.length).toBe(1);
  });
});
