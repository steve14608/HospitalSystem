<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api'
import cookie from '@/utils/cookie'
import { ElMessage } from 'element-plus';


cookie.checkForValidated(5);

const num0 = ref(0)
const num1 = ref(0)
const input = ref('')
const input1 = ref('')
const currentPage = ref(1)
const maxNumPerPage = 10
const patientList = ref([])
const filteredPatientList = ref([])
const filtered = ref([]);

const fetchdata = async () => {
    let temp = await api.getCheckPatientCount()
    num0.value = temp.done;
    num1.value = temp.undone;

    temp = await api.getCheckPatient({
        caseNO: input.value,
        name: input1.value
    });
    temp.data.forEach((ele,index) => {
        ele.index = index + 1;
        patientList.value.push(ele) 
    });
    filtered.value = patientList.value;
    pageChange();
}
function search() {
    filtered.value = patientList.value.filter(item => {
        return item.caseNO.includes(input.value) && item.name.includes(input1.value)
    })
    pageChange();
}
// const search = async () => {
//     // const temp = await api.getCheckPatient({
//     //     caseNO: input.value,
//     //     name: input1.value
//     // });
//     // temp.data.forEach((ele,index) => {
//     //     ele.index = index + 1;
//     //     patientList.value.push(ele) 
//     // });
//     // filteredPatientList.value = patientList.value.slice((currentPage.value - 1) * maxNumPerPage, currentPage.value * maxNumPerPage)
// }
function create(row) {
    cookie.setPatientId(row.id);
    location.href = "/check_patient";
}

function dismiss(row) {
    ElMessage.info('该功能未实现')
}

function call(row) {
    ElMessage.info('该功能未实现')
}
function pageChange() {
    filteredPatientList.value = filtered.value.slice((currentPage.value - 1) * maxNumPerPage, currentPage.value * maxNumPerPage)
}

onMounted(() => {
    fetchdata()
})
</script>
<template>
    <el-container class="main-container">
        <el-header class="main-header">
            <el-tag type="success" class="head-info-0">今日已检查{{ num0 }}人</el-tag>
            <el-tag type="warning" class="head-info-0" style="margin-left:30px;">当前{{ num1 }}人在排队</el-tag>
        </el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    检查申请
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            <el-row class="row">
                                <el-col :span="8" class="col">
                                    <el-input v-model="input" placeholder="请输入病历号" clearable></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-input v-model="input1" placeholder="请输入患者姓名" clearable></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-main class="sub-content" style="padding:0px;">
                            <el-table :data="filteredPatientList" border>
                                <el-table-column label="序号" type="index" width="48px"></el-table-column>
                                <el-table-column label="患者名称" prop="name"></el-table-column>
                                <el-table-column label="患者病历号" prop="caseNO"></el-table-column>
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button size="small" @click="create(scope.row)"
                                            :disabled="scope.row.status === '已缴费'">进行检查</el-button>
                                        <el-button size="small" @click="dismiss(scope.row)"
                                            :disabled="scope.row.status === '已缴费'">跳过</el-button>
                                        <el-button size="small" @click="call(scope.row)"
                                            :disabled="scope.row.status === '已缴费'">叫号</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer>
                    <el-pagination background layout="prev, pager, next" v-model="currentPage"
                        class="table-footer-pagination" :total="filtered.length" :page-size="maxNumPerPage"
                        :current-change="pageChange" />
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>
<style scoped>
.main {
    padding-top: 10px;
    overflow-y: auto;
}

.main-container {
    height: 100%;
    background-color: #f5f5f5;
    padding: 0px;
    padding-bottom: 5px;
    position: relative;
    overflow-y: auto;
}

.main-content {
    padding-right: 0px;
    padding-top: 0px;
}

.sub-container {
    padding-bottom: 0px;
}

.main-header {
    height: 30px;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
}

.main-title {
    font-size: 30px;
    font-weight: bold;
    height: auto;
}

.sub-title {
    font-size: 20px;
    height: auto;
    padding-bottom: 20px;
    padding-left: 0px;
}

.sub-content {
    padding-bottom: 0px;
    padding-top: 0px;
    background-color: antiquewhite;
}

.row {
    height: 60px;
}

.col {
    padding-right: 10px;
    display: flex;
    align-items: center;

}

.unit {
    margin-top: auto;
    margin-bottom: auto;
    min-width: 100%;
}

.form-footer {
    padding-top: 20px;
}

.sub-sub-container {
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 20px;
    padding-top: 20px;
}

.sub-sub-title {
    height: auto;
    padding: 0px;
}

.sub-sub-content {
    padding: 0px;
}

.table-footer-pagination {
    position: absolute;
    right: 20px;
}


.diagnosis {
    width: 100%;
    height: 60%;
    position: relative;
    display: flex;
}

.fullsize-unit {
    display: flex;
    align-items: center;
}

.dialog-body {
    height: fit-content;
    width: auto;
}
</style>