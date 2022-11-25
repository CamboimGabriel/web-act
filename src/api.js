import axios from "axios";

//ec2-54-82-115-78.compute-1.amazonaws.com
let url = "http://ec2-54-82-115-78.compute-1.amazonaws.com:5001/";

const instance = axios.create({
  baseURL: url,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
