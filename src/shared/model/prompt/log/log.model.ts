import {
  CreateRequestLogInfo,
  GPTLog,
  LogStore,
  Role,
} from "@/src/app/types/log";
import { StoreApi } from "zustand";

export function getLog(store: StoreApi<LogStore>) {
  return store.getState().log;
}

export function pushLog(store: StoreApi<LogStore>, log: GPTLog) {
  store.setState((state) => {
    return {
      ...state,
      log: [...state.log, log],
    };
  });
}

export function createLog(role: Role, prompt: string): GPTLog {
  return {
    role,
    content: [
      {
        type: "text",
        text: prompt,
      },
    ],
  };
}

export function createRequestLog({ prompt, getLog }: CreateRequestLogInfo) {
  const _log = getLog();

  const copyLog = JSON.parse(JSON.stringify(_log));
  copyLog.push(createLog("user", prompt));

  return {
    logs: copyLog,
  };
}
