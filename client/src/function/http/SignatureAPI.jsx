import { $authHost } from "./index";

export const fetchDataSignature = async () =>{
    const { data } = await $authHost.post('api/signature/');
    return data
}

export const fetchDataSignatureById = async (id) =>{
    const { data } = await $authHost.post('api/signature/fetchbyid/', { id });
    return data
}

export const addDataSignature = async (datas) =>{
    const { data } = await $authHost.post('api/signature/add', datas);
    return data
}

export const addDataSignatureDraft = async (datas) =>{
    const { data } = await $authHost.post('api/signature/addDraft', datas);
    return data
}

export const getDataSignature = async (id) =>{
    const { data } = await $authHost.get('api/signature/get/' + id);
    return data
}

export const updateDataSignature = async (id, title) =>{
    const { data } = await $authHost.post('api/signature/update/', { id, title });
    return data
}

export const deleteDataSignature = async (id)  =>{
    const { data } = await $authHost.post('api/signature/delete/', { id });
    return data
}

export const deleteDataSignatureDraft = async (id)  =>{
    const { data } = await $authHost.post('api/signature/deleteDraft/', { id });
    return data
}

export const getDataCode = async (datas) =>{
    const { data } = await $authHost.post('api/signature/getcode', datas);
    return data
}

export const verifyDataCode = async (datas) =>{
    const { data } = await $authHost.post('api/signature/verifycode', datas);
    return data
}

export const verifyDataSignature = async (datas) =>{
    const { data } = await $authHost.post('api/signature/verifysignature', datas);
    return data
}