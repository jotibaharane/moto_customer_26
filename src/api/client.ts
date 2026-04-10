export const fetchClient = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
};
