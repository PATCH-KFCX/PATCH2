import { fetchHandler, getPostOptions } from "../utils/fetchingUtils";

const baseUrl = "/api/medications";

export const fetchUserMeds = async () => {
  return await fetchHandler({ baseUrl });
};

export const addUserMed = async ({ name, dose, frequency, notes }) => {
  return await fetchHandler(
    { baseUrl },
    getPostOptions({ name, dose, frequency, notes })
  );
};
