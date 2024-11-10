import { magenta } from 'ansis';
import Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import type { IAppConfig, IAppLogger } from '../interfaces';

import { AppToken, LogLevelColor } from '../constants';
import { Inject, Singleton } from '../decorators';

const {
  format: WinstonFormat,
  transports: { Console: WinstonConsole },
} = Winston;

/** Application Logger. */
@Singleton()
export class AppLogger implements IAppLogger {
  private readonly _logger: Winston.Logger;

  public constructor(
    @Inject(AppToken.IAppConfig)
    private readonly _config: IAppConfig,
  ) {
    const format = WinstonFormat.combine(
      WinstonFormat.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      WinstonFormat.errors({
        stack: true,
      }),
      WinstonFormat.printf(({ timestamp, level, message, ...data }) => {
        const logLevelText = `${' '.repeat(7 - level.length)}${LogLevelColor[level] || level}`;

        const log = `${timestamp}${logLevelText}:  ${message}`;
        return Object.keys(data).length ? `${log}\n${JSON.stringify(data, null, 2)}` : log;
      }),
    );
    const formatWithUncolorize = WinstonFormat.combine(format, WinstonFormat.uncolorize());

    this._logger = Winston.createLogger({
      level: 'debug',
      transports: [
        new WinstonConsole({
          format,
          handleExceptions: true,
          handleRejections: true,
        }),
        new WinstonDailyRotateFile({
          dirname: this._config.directory.logs,
          filename: '%DATE%-debug.log',
          format: formatWithUncolorize,
          zippedArchive: true,
        }),
        new WinstonDailyRotateFile({
          dirname: this._config.directory.logs,
          filename: '%DATE%-error.log',
          level: 'error',
          format: formatWithUncolorize,
          zippedArchive: true,
          handleExceptions: true,
          handleRejections: true,
        }),
      ],

      exitOnError: false,
    });

    this.debug(`${magenta('[Logger]')} initialized`);
  }

  public error(message: string, ...meta: unknown[]): void {
    this._logger.error(message, ...meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this._logger.warn(message, ...meta);
  }

  public info(message: string, ...meta: unknown[]): void {
    this._logger.info(message, ...meta);
  }

  public debug(message: string, ...meta: unknown[]): void {
    this._logger.debug(message, ...meta);
  }

  public createLogger(label: string): IAppLogger {
    const colorizedLabel = magenta(`[${label}]`);

    return {
      error: (message: string, ...meta: unknown[]) => this.error(`${colorizedLabel} ${message}`, ...meta),
      warn: (message: string, ...meta: unknown[]) => this.warn(`${colorizedLabel} ${message}`, ...meta),
      info: (message: string, ...meta: unknown[]) => this.info(`${colorizedLabel} ${message}`, ...meta),
      debug: (message: string, ...meta: unknown[]) => this.debug(`${colorizedLabel} ${message}`, ...meta),
      createLogger: (childLabel: string) => this.createLogger(`${label}.${childLabel}`),
    };
  }
}
