import {
  fetchHandler,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/auth";

export const registerUser = async ({ name, age, email, password }) => {
  return fetchHandler(
    `${baseUrl}/register`,
    getPostOptions({ name, age, email, password })
  );
};

export const logUserIn = async ({ email, password }) => {
  return fetchHandler(`${baseUrl}/login`, getPostOptions({ email, password }));
};

export const logUserOut = async () => {
  return fetchHandler(`${baseUrl}/logout`, deleteOptions);
};

export const checkForLoggedInUser = async () => {
  return await fetchHandler(`${baseUrl}/me`);
};
