// storage.js
export const loadJobs = () => {
  try {
    const raw = localStorage.getItem("jobs");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveJobs = (data) => {
  localStorage.setItem("jobs", JSON.stringify(data));
};
