import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createApplication = async (dataOrName, phoneNumber) => {
  const payload = typeof dataOrName === 'object' ? dataOrName : { applicant_name: dataOrName, phone_number: phoneNumber };
  const res = await api.post('/applications', payload);
  return res.data;
};

export const getApplicationsHistory = async (district, taluk) => {
  const params = {};
  if (district) params.district = district;
  if (taluk) params.taluk = taluk;
  const res = await api.get('/applications', { params });
  return res.data;
};

export const getApplications = getApplicationsHistory;

export const applicantLogin = async (data) => {
  const res = await api.post('/auth/applicant/login', data);
  return res.data;
};

export const applicantRegister = async (data) => {
  const res = await api.post('/auth/applicant/register', data);
  return res.data;
};

export const officerLogin = async (data) => {
  const res = await api.post('/auth/officer/login', data);
  return res.data;
};

export const getApplicationDetails = async (appId) => {
  const res = await api.get(`/applications/${appId}`);
  return res.data;
};

export const uploadDocument = async (appId, fileObj, docType) => {
  const formData = new FormData();
  formData.append('file', fileObj);
  formData.append('document_type', docType);

  const res = await axios.post(`${API_BASE_URL}/applications/${appId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const triggerProcessing = async (appId) => {
  const res = await api.post(`/applications/${appId}/process`);
  return res.data;
};

export const getVerificationResults = async (appId) => {
  const res = await api.get(`/applications/${appId}/results`);
  return res.data;
};

export const getApplicationSummary = async (appId) => {
  const res = await api.get(`/applications/${appId}/summary`);
  return res.data;
};

export const sendAssistantMessage = async (message, appId) => {
  const res = await api.post('/assistant/chat', { message, application_id: appId });
  return res.data;
};

export const simplifyText = async (text, term) => {
  const res = await api.post('/assistant/simplify', { text, term });
  return res.data;
};

export const submitOfficerReview = async (appId, reviewData) => {
  const res = await api.post(`/applications/${appId}/review`, reviewData);
  return res.data;
};

export const getDemoScenarios = async () => {
  const res = await api.get('/demo/scenarios');
  return res.data;
};

export const runDemoScenario = async (scenarioKey) => {
  const res = await api.post(`/demo/scenarios/${scenarioKey}/run`);
  return res.data;
};

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.post(`/notifications/${id}/read`);
  return res.data;
};

export default api;
