import { api, extractErrorMessage } from "../http-client";

export const adminApis = {
    login: async () => {
        try {
            const response = await api.get("/admin/login");
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error);
            return message;
        }
    }
}