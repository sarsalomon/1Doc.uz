import { $authHost, $host } from "./index";

export const fetchDataDocument = async () =>{
    const { data } = await $authHost.post('api/document/');
    return data
}

export const fetchDataDocumentById = async (id) =>{
    const { data } = await $authHost.post('api/signature/fetchbyid/', { id });
    return data
}

export const addDataDocument = async (datas) =>{
    const { data } = await $authHost.post('api/document/add', datas);
    return data
}

export const getDataDocument = async (id) =>{
    const { data } = await $authHost.get('api/document/get/' + id);
    return data
}

export const getDatasDocumentById = async (id) =>{
    const { data } = await $authHost.post('api/document/fetchbyid/', { id });
    return data
}

export const getDataCode = async (datas) =>{
    const { data } = await $host.post('api/document/getcode', datas);
    return data
}

export const verifyDataCode = async (datas) =>{
    const { data } = await $host.post('api/document/verifycode', datas);
    return data
}

export const verifyDataDocument = async (datas) =>{
    const { data } = await $host.post('api/document/verifydocument', datas);
    return data
}

export const updateDataDocument = async (id, title) =>{
    const { data } = await $authHost.post('api/document/update/', { id, title });
    return data
}

export const deleteDataDocument = async (id)  =>{
    const { data } = await $authHost.post('api/document/delete/', { id });
    return data
}