// These functions all take in a body and return an options object
// with the provided body and the remaining options
import { fetchHandler, getPatchOptions } from "../utils/fetchingUtils";

const baseUrl = "/api/users";

export const getAllUsers = async () => {
  return await fetchHandler(baseUrl);
};

export const getUser = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`);
};

export const updateUsername = async ({ id, name }) => {
  console.log("Sending PATCH to:", `${baseUrl}/${id}`);
  console.log("Body:", { name });
  return fetchHandler(`${baseUrl}/${id}`, getPatchOptions({ name }));
};
