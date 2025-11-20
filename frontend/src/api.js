import axios from "axios";

const devURL = "http://localhost:9000/api";
const prodURL = "https://your-backend-url.vercel.app/api";

const BASE_URL = process.env.NODE_ENV === "production" ? prodURL : devURL;

export const fetchWomensTops = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/products/womens-tops`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
