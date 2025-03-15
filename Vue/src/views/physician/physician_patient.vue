<script setup>
import { onMounted, ref } from 'vue';
import cookie from '@/utils/cookie';
import api from '@/utils/api';


cookie.checkForValidated(3);


const num0 = ref(0);
const num1 = ref(0);
const tableData = ref([]);
const originData = ref([]);
const filteredData = ref([]);
const maxNumPerPage = 10;
const currentPage = ref(1);
const input = ref('');
const input1 = ref('');
const tableref = ref(null);

async function fetchData() {
    let temp = await api.getPatient();
    //originData.value = temp.data;
    temp.data.forEach((i, index) => {
        originData.value.push({
            name: i.name,
            case_number: i.case_number,
            index: index + 1,
            id: i.id
        });
    });
    filteredData.value = originData.value;
    tableData.value = originData.value.slice(0, maxNumPerPage);

    temp = await api.getDiagnosePatientCount();
    num0.value = temp.done;
    num1.value = temp.undone;

}
function tableFilter() {
    filteredData.value = originData.value.filter(item => {
        return item.case_number.includes(input.value) && item.name.includes(input1.value);
    });
    currentPage.value = 1;
    currentPageChange(1);
}
function currentPageChange(val) {
    let start = (val - 1) * maxNumPerPage;
    let end = start + maxNumPerPage;
    tableData.value = filteredData.value.slice(start, end);
}
function create(row) {
    cookie.setPatientId(row.id);
    location.href = '/home_medical_record'
}
function dismiss(row) {
    ElMessage.info("该功能还未实现");
}
function call(row) {
    ElMessage.info("该功能还未实现");
}
onMounted(() => {
    fetchData();
});
</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header">
            <el-tag type="success" class="head-info-0">今日已看诊{{ num0 }}人</el-tag>
            <el-tag type="warning" class="head-info-0" style="margin-left:30px;">当前{{ num1 }}人在排队</el-tag>
        </el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    患者叫号
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
                                    <el-button type="primary" @click="tableFilter"
                                        style="margin-left:20px;">搜索</el-button>
                                </el-col>
                            </el-row>
                            <!-- 
                            <el-input v-model="input1" placeholder="请输入患者姓名" style="margin-left:10px;"></el-input>
                             -->
                        </el-header>
                        <el-main class="sub-content">
                            <el-table :data="tableData" border ref="tableref">
                                <el-table-column label="序号" prop="index" width="60"></el-table-column>
                                <el-table-column label="患者名称" prop="name"></el-table-column>
                                <el-table-column label="患者病历号" prop="case_number"></el-table-column>
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button size="small" @click="create(scope.row)">创建病历</el-button>
                                        <el-button size="small" @click="dismiss(scope.row)">跳过</el-button>
                                        <el-button size="small" @click="call(scope.row)">叫号</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer>
                    <el-pagination background layout="prev, pager, next" v-model="currentPage"
                        @current-change="currentPageChange" class="table-footer-pagination" :total="filteredData.length"
                        :page-size="maxNumPerPage" />
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
    padding: 0px;
    background-color: rgb(255, 255, 255);
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
}

.sub-sub-content {
    padding-top: 0px;
    padding-bottom: 0px;
}

.table-footer-pagination {
    position: absolute;
    right: 20px;
}
</style>
