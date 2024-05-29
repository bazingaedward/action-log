import { expect, test, vi } from 'vitest';
import { warnMsg } from './utils';

test('warnMsg works fine', () => {
  // 创建一个 console.warn 的 mock 函数
  const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

  // 调用函数，满足触发 console.warn 的条件
  warnMsg('hello');

  // 断言 console.warn 被调用了一次，并且参数是 'This is a warning message'
  expect(warnMock).toHaveBeenCalledTimes(1);
  expect(warnMock).toHaveBeenCalledWith('[ActionLog]: hello');

  // 清除 mock
  warnMock.mockRestore();
});
