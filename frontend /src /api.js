const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api/v1' 
  : 'https://studentperformanceanalytics.onrender.com/api/v1';

export const api = {
  getStudents: async () => {
    const res = await fetch(`${BASE_URL}/students/`);
    return res.json();
  },
  getTopPerformers: async () => {
    const res = await fetch(`${BASE_URL}/analytics/top-performers`);
    return res.json();
  },
  getAtRiskStudents: async () => {
    const res = await fetch(`${BASE_URL}/analytics/at-risk`);
    return res.json();
  }
};

