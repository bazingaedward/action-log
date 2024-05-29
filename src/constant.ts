import { EmitModeEnum } from './typing';

export const BACKEND_URL = '/api/system/user/activity';

export const DEFAULT_INIT_OPTIONS = {
  global: false,
  debug: false,
  mode: EmitModeEnum.SINGLE,
  flushLimit: 10,
};
