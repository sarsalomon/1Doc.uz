import { $authHost } from "./index";

export const fetchDataContractTemplate = async () =>{
    const { data } = await $authHost.post('api/contractTemplate/');
    return data
}

export const addDataContractTemplate = async (datas) =>{
    const { data } = await $authHost.post('api/contractTemplate/add', datas);
    return data
}

export const getDataContractTemplate = async (id) =>{
    const { data } = await $authHost.get('api/contractTemplate/get/' + id);
    return data
}

export const updateDataContractTemplate = async (id, title) =>{
    const { data } = await $authHost.post('api/contractTemplate/update/', { id, title });
    return data
}

export const deleteDataContractTemplate = async (id)  =>{
    const { data } = await $authHost.post('api/contractTemplate/delete/', { id });
    return data
}