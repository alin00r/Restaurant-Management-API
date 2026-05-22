export function isDebug(): boolean {
  return process.env['NODE_ENV'] === 'development';
}

export function isDebugQueries(): boolean {
  return process.env['DEBUG_QUERIES'] === 'true';
}
