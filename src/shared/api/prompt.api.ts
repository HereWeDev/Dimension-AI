import { SpecRequestInfo } from "@/src/app/types/query";
import { api } from "@/src/shared/api/api";
import {
  createRequestLog,
  createLog,
} from "@/src/shared/model/prompt/log/log.model";
import { getSpecLog, pushSpecLog } from "@/src/shared/store/prompt/log";

export async function fetchSpec(request: SpecRequestInfo) {
  try {
    const logs = createRequestLog({
      prompt: request.inputMessage,
      getLog: getSpecLog,
    });

    const requestLog = {
      ...logs,
      style: request.selectedStyleName,
      volumeBoxInfo: request.volumeBoxInfo,
    };

    const { data: specified } = await api("/spec_gen", requestLog, "POST");

    pushSpecLog(createLog("user", request.inputMessage));
    pushSpecLog(createLog("assistant", specified));

    return specified;
  } catch (error) {
    console.error("Error fetching spec:", error);
    throw error;
  }
}
