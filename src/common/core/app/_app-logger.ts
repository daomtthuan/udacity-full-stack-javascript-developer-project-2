import { magenta } from 'ansis';
import Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import type { IAppConfig, IAppLogger } from '../interfaces';

import { InterfaceToken, LogLevelColor } from '../constants';
import { Inject, Injectable } from '../decorators';

const {
  format: WinstonFormat,
  transports: { Console: WinstonConsole },
} = Winston;

/** Application Logger. */
@Injectable()
export class AppLogger implements IAppLogger {
  private readonly _logger: Winston.Logger;

  public constructor(
    @Inject(InterfaceToken.IAppConfig)
    private readonly _config: IAppConfig,
  ) {
    const format = WinstonFormat.combine(
      WinstonFormat.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      WinstonFormat.errors({
        stack: true,
      }),
      WinstonFormat.printf(({ timestamp, level, message, meta }) => {
        const logLevelText = `${' '.repeat(7 - level.length)}${LogLevelColor[level] || level}`;

        let log = `${timestamp}${logLevelText}:  ${message}`;
        if (meta && Array.isArray(meta) && meta.length > 0) {
          log = `${log}\n${JSON.stringify(meta, null, 2)}`;
        }

        return log;
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
  }

  public error(message: string, ...meta: unknown[]) {
    this._logger.error(message, { meta });
  }

  public warn(message: string, ...meta: unknown[]) {
    this._logger.warn(message, { meta });
  }

  public info(message: string, ...meta: unknown[]) {
    this._logger.info(message, { meta });
  }

  public debug(message: string, ...meta: unknown[]) {
    this._logger.debug(message, { meta });
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
