import axiosInstance from "./axiosInterceptor";

export const fetcher = async (url: string) => {
   return axiosInstance
      .get(url)
      .then(({ data }) => data)
      .catch((err) => console.log(err));
};
