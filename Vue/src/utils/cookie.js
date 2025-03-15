

const roleList = [2, 3, 5, 7, 11, 13, 1];

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function getDoctorName(){
    return getCookie('name');
}

function getPatientId() {
    return parseInt(getCookie('patientId'));
}

function logout() {
    setCookie('doctorId', '', -1);
    setCookie('patientId', '', -1);
    setCookie('role', '', -1);
    setCookie('name', '', -1);
    //location.href = '/login';
    location.replace('/login');
}

function checkForValidated(permission) {
    const role = cookie.getRole();
    if(permission % role != 0){
        logout();
        //location.replace('/login');
    }
}
function setPatientId(id) {
    setCookie('patientId', id, 365);
}
function getRole(){
    // return getCookie('role');
    return roleList[parseInt(getCookie('role')) -1];
}
const cookie = {
    getPatientId,
    logout,
    checkForValidated,
    setPatientId,
    getRole,
    getDoctorName
}
export default cookie;
