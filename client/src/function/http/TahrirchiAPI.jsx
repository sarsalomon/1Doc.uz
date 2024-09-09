import { $authHost } from "./index";

export const checkTahrirchi = async (datas) =>{
    const { data } = await $authHost.post('api/tahrirchi/check/', datas);
    return data
}

export const translateTahrirchi = async (datas)  =>{
    const { data } = await $authHost.post('api/tahrirchi/translate/', datas);
    return data
}