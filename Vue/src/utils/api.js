import axios from 'axios'
import cookie from './cookie'

function checkForValidate(data) {
    if (data.status == 403) {
        cookie.logout();
    }
}
const api = {
    // async test(data){
    //     const response = await axios.post('/api/test', data);
    //     checkForValidate(response.data);return response.data;
    // },
    async login(data) {
        const response = await axios.post('/api/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCalcType() {
        const response = await axios.get('/api/getCalcType')
        checkForValidate(response.data); 
        return response.data;
    },

    async getSubjects(data) {
        const response = await axios.get('/api/getSubjects', { params: data })
        checkForValidate(response.data); 
        return response.data
    },

    async getDoctorType() {
        const response = await axios.get('/api/getDoctorType')
        checkForValidate(response.data); 
        return response.data
    },

    async getDoctor(data) {
        const response = await axios.get('/api/getDoctor', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCaseNO() {
        const response = await axios.get('/api/getCaseNO');
        checkForValidate(response.data); 
        return response.data;
    },

    async getRestQuantity(data) {
        const response = await axios.get('/api/getRestQuantity', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendRegisterInfo(data) {
        const response = await axios.post('/api/sendRegisterInfo', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        checkForValidate(response.data); 
        return response.data;
    },

    async getDiagnosePatientCount() {
        const response = await axios.get('/api/getDiagnosePatientCount');
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckPatientCount() {
        const response = await axios.get('/api/getCheckPatientCount');
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckPatient(data) {
        const response = await axios.get('/api/getCheckPatient', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getPatient() {
        const response = await axios.get('/api/getPatient');
        checkForValidate(response.data); 
        return response.data;
    },

    async sendJudgeInfo(data) {
        const response = await axios.post('/api/sendJudgeInfo', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        checkForValidate(response.data); 
        return response.data;
    },
    async getJudgeInfo(data) {
        const response = await axios.get('/api/getJudgeInfo', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },
    async getDisease(data) {
        const response = await axios.get('/api/getDisease', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getDiseaseList(data) {
        const response = await axios.get('/api/getDiseaseList', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckProject(data) {
        const response = await axios.get('/api/getCheckProject', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckProjectById(data) {
        const response = await axios.get('/api/getCheckProjectById', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendCheckRequest(data) {
        const response = await axios.post('/api/sendCheckRequest', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        checkForValidate(response.data); 
        return response.data;
    },

    async getChargeInfo(data) {
        const response = await axios.get('/api/getChargeInfo', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendChargeInfo(data) {
        const response = await axios.post('/api/sendChargeInfo', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckRequest(data) {
        const response = await axios.get('/api/getCheckRequest', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckRequestInfo(data) {
        const response = await axios.get('/api/getCheckRequestInfo', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async deleteCheckProject(data) {
        const response = await axios.post('/api/deleteCheckProject', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async beginCheck(data) {
        const response = await axios.post('/api/beginCheck', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendCheckResult(data) {
        const response = await axios.post('/api/sendCheckResult', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getPatientInfoWithStatus(data) {
        const response = await axios.get('/api/getPatientInfoWithStatus');
        checkForValidate(response.data); 
        return response.data;
    },
    async getPatientInfo(data) {
        const response = await axios.get('/api/getPatientInfo', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getCheckResult(data) {
        const response = await axios.get('/api/getCheckResult', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async diagnose(data) {
        const response = await axios.post('/api/diagnose', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getDiagnose(data) {
        const response = await axios.get('/api/getDiagnose', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getMedicine(data) {
        const response = await axios.get('/api/getMedicine', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendPrescription(data) {
        const response = await axios.post('/api/sendPrescription', data, { headers: { 'Content-Type': 'application/json' } });
        checkForValidate(response.data); 
        return response.data;
    },
    async getPrescription(data) {
        const response = await axios.get('/api/getPrescription', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },
    async getTagList(data) {
        const response = await axios.get('/api/getTagList', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getMedicinePatient(data) {
        const response = await axios.get('/api/getMedicinePatient', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async getPatientMedicine(data) {
        const response = await axios.get('/api/getPatientMedicine', { params: data });
        checkForValidate(response.data); 
        return response.data;
    },

    async sendPatientMedicine(data) {
        const response = await axios.post('/api/sendPatientMedicine', null, { params: data });
        checkForValidate(response.data); 
        return response.data;
    }
}

export default api;