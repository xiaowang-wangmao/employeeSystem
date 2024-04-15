const projectName = import.meta.env.VITE_GLOB_APP_TITLE;
export function info(message: string) {
  // eslint-disable-next-line no-console
  console.info(`[${projectName} info]:${message}`);
}

export function warn(message: string) {
  // eslint-disable-next-line no-console
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}

export function print(message: string) {
  // eslint-disable-next-line no-console
  console.log(
    `%c[${projectName}-LOG]: %c${message}`,
    'background:#1C69D4;color:#ffffff;padding:5px 10px;border-radius:4px 0 0 4px;',
    'background:#000000;color:#ffffff;padding:5px 10px;border-radius:0 4px 4px 0;',
  );
}

export class ExtendedError extends Error {
  extra: any = '';

  constructor(errProps: {message: string, extra: any}) {
    super(errProps.message);
    this.extra = errProps.extra;
  }
}
