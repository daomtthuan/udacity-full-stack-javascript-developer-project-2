/** Lifecycle scope of the provider. */
export const enum ProviderScope {
  Default = 'Default',
  Request = 'Request',
  Transient = 'Transient',
}

/** Core Injection Tokens. */
export const enum CoreToken {
  IAppConfig = 'IAppConfig',
  IAppLogger = 'IAppLogger',
}
