import * as Debug from "debug";
import {IDebugger} from "debug";

export type Logger = {
  debug: IDebugger,
  error: IDebugger,
  info: IDebugger,
  warn: IDebugger,
  throwError: (msg: string | Error) => void
}
export const logger = (namespace: string): Logger => {
  return {
    debug: Debug(`sinan:${namespace}`),
    error: Debug(`sinan:error:${namespace}`),
    info: Debug(`sinan:info:${namespace}`),
    warn: Debug(`sinan:warn:${namespace}`),
    throwError: (msg) => {
      throw new Error(`${namespace}: ${msg}`);
    }
  }
};
