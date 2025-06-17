import { $authHost, $host } from "./index";

export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type);
    return data;
}

export const fetchTypes = async (departmentId) => {
    const { data } = await $host.get('api/type', { params: { departmentId } });
    return data;
}

export const createBrand = async (brand) => {
    const { data } = await $authHost.post('api/brand', brand);
    return data;
}

export const fetchBrands = async (departmentId) => {
    const { data } = await $host.get('api/brand', { params: { departmentId } });
    return data;
}

export const createDevice = async (device) => {
    const { data } = await $authHost.post('api/device', device);
    return data;
}

export const fetchDevices = async (departmentId, typeId, brandId, page, limit = 12, name) => {
    const { data } = await $host.get('api/device', {
        params: {
            departmentId, typeId, brandId, page, limit, name
        }
    });
    return data;
}

export const fetchOneDevice = async (id) => {
    const { data } = await $host.get('api/device/' + id);
    return data;
}

export const addRating = async (deviceId, rate, review) => {
    const { data } = await $authHost.post(`api/device/${deviceId}/rating`, { rate, review });
    return data;
}

export const createDepartment = async (department) => {
    const { data } = await $authHost.post('api/department', department);
    return data;
}

export const fetchDepartments = async () => {
    const { data } = await $host.get('api/department');
    return data;
}