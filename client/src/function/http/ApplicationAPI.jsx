import { $authHost, $host } from "./index";

export const fetchDataApplication = async () =>{
    const { data } = await $authHost.post('api/application/');
    return data
}

export const fetchDatasApplicationById = async (id) =>{
    const { data } = await $authHost.post('api/application/fetchbyid/', { id });
    return data
}

export const addDataApplication = async (datas) =>{
    const { data } = await $authHost.post('api/application/add', datas);
    return data
}

export const getDataApplicationt = async (id) =>{
    const { data } = await $authHost.get('api/application/get/' + id);
    return data
}

export const getDataCode = async (datas) =>{
    const { data } = await $host.post('api/application/getcode', datas);
    return data
}

export const verifyDataCode = async (datas) =>{
    const { data } = await $host.post('api/application/verifycode', datas);
    return data
}

export const verifyDataApplication = async (datas) =>{
    const { data } = await $host.post('api/application/verifysignature', datas);
    return data
}

export const updateDataApplication = async (id, title) =>{
    const { data } = await $authHost.post('api/application/update/', { id, title });
    return data
}

export const deleteDataApplication = async (id)  =>{
    const { data } = await $authHost.post('api/application/delete/', { id });
    return data
}