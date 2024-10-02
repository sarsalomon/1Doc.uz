import { $authHost, $host } from "./index";

export const fetchDataAppeal = async () =>{
    const { data } = await $authHost.post('api/appeal/');
    return data
}

export const fetchDatasAppealById = async (id) =>{
    const { data } = await $authHost.post('api/appeal/fetchbyid/', { id });
    return data
}

export const addDataAppeal = async (datas) =>{
    const { data } = await $authHost.post('api/appeal/add', datas);
    return data
}

export const getDataAppealt = async (id) =>{
    const { data } = await $authHost.get('api/appeal/get/' + id);
    return data
}

export const getDataCode = async (datas) =>{
    const { data } = await $host.post('api/appeal/getcode', datas);
    return data
}

export const verifyDataCode = async (datas) =>{
    const { data } = await $host.post('api/appeal/verifycode', datas);
    return data
}

export const verifyDataAppeal = async (datas) =>{
    const { data } = await $host.post('api/appeal/verifysignature', datas);
    return data
}

export const updateDataAppeal = async (id, title) =>{
    const { data } = await $authHost.post('api/appeal/update/', { id, title });
    return data
}

export const deleteDataAppeal = async (id)  =>{
    const { data } = await $authHost.post('api/appeal/delete/', { id });
    return data
}