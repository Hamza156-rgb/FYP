import AppConfig from "../Config/apiConfig"
import axios from "axios";

const axiosApiInstance = axios.create({
    baseURL : AppConfig.apiBaseUrl
    // headers: { 'X-Custom-Header': 'foobar' }
});

export default axiosApiInstance;



