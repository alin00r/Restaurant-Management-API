import { Nullable } from '../types/helper-types';
export function isDebug(): boolean {
  return process.env['NODE_ENV'] === 'development';
}

export function isDebugQueries(): boolean {
  return process.env['DEBUG_QUERIES'] === 'true';
}

export interface ObservabilityConfig {
  url: Nullable<string>;
}
