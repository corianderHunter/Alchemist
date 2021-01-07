import * as AccountGroups from "./accountGroup/vue/index";
import { AxiosInstance } from "axios";
import { FetchConfigType } from '@/types';

export const buildApis = (
  fetchConfig: FetchConfigType,
  axios: AxiosInstance
) => {
  const urls = fetchConfig["urls"];
  //约定 base 为默认的根服务地址key
  const defaultPath = urls["base"];
  return {
    accountGroups: AccountGroups.buildApi(urls["accountGroup"] || defaultPath, axios),
  };
};


declare module "vue/types/vue" {
  interface Vue {
    $api: ReturnType<typeof buildApis>;
  }
}

