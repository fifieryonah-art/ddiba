const API_BASE_URL =
  "http://127.0.0.1:8000";

export function getAuthToken() {
  return localStorage.getItem(
    "ddiba_token"
  );
}

export function getUsername() {
  return localStorage.getItem(
    "ddiba_username"
  );
}

export function logout() {
  localStorage.removeItem(
    "ddiba_token"
  );

  localStorage.removeItem(
    "ddiba_username"
  );
}

export async function apiFetch(
  path,
  options = {}
) {
  const token = getAuthToken();

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  /*
   * JSON requests need Content-Type.
   *
   * FormData must NOT set Content-Type manually.
   * The browser adds the multipart boundary itself.
   */
  if (
    options.body &&
    !isFormData
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Token ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    logout();

    throw new Error(
      "Your session has expired. Please log in again."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.non_field_errors?.[0] ||
        "Something went wrong."
    );
  }

  return data;
}