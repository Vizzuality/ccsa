import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const updateOrCreateDataset = async (data: unknown) => {
  const response = await api.post("/datasets/update-or-create", { data });
  return response.data;
};
