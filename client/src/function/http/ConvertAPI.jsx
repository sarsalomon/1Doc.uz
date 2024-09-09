import { $authHost } from "./index";

export const fetchDataConvert = async () =>{
    const { data } = await $authHost.post('api/convert/');
    return data
}

export const addDataConvert = async (datas) =>{
    const { data } = await $authHost.post('api/convert/add', datas);
    return data
}

export const getDataConvert = async (id) =>{
    const { data } = await $authHost.get('api/convert/get/' + id);
    return data
}

export const updateDataConvert = async (id, title) =>{
    const { data } = await $authHost.post('api/convert/update/', { id, title });
    return data
}

export const deleteDataConvert = async (id)  =>{
    const { data } = await $authHost.post('api/convert/delete/', { id });
    return data
}

export const fileConvert = async (datas)  =>{
    const { data } = await $authHost.post('api/convert/convertfile', datas);
    return data
}