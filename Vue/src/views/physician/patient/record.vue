<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';

const state = ['已挂号','医生接诊','看诊结束','已退费'];

cookie.checkForValidated(3);

const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const briefInfo = ref({});
const patientId = ref(null);
const patientList = ref([]);
const filteredPatientList = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const input = ref('');
const input1 = ref('');
const filterList = ref([]);
const search = async () => {
    filterList.value = patientList.value.filter(item => {
        return item.case_number.includes(input.value) && item.name.includes(input1.value);
    });
    currentPage.value = 1;
    currentChange(1);
}

function currentChange(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    filteredPatientList.value = filterList.value.slice(start, end);
}
const updateHistory = (row) => {
    cookie.setPatientId(row.id);
    location.href = 'check_results'
}

const fetchdata = async () => {
    // patientId.value = cookie.getPatientId();
    // let temp = await api.getPatientInfo({
    //     id: patientId.value
    // });
    // briefInfo.value = temp.data;

    patientList.value = [];
    const temp = await api.getPatientInfoWithStatus();
    temp.data.forEach((item, index) => {
        item.index = index + 1;
        item.status = state[item.visit_state-1];
        patientList.value.push(item);
    });
    filteredPatientList.value = patientList.value.slice(0, pageSize);

}
onMounted(() => {
    fetchdata();
});
</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header">
            <!-- <el-text type="Default" style="font-size:16px;font-weight: 600; margin-right:20px">患者信息:</el-text>
            <el-tag type="primary" v-for="item in briefInfoLabel" :key="item.prop" style="margin-right:5px">
                {{ item.label }}: {{ briefInfo[item.prop] }}
                <template v-if="item.label == '年龄' && briefInfo.age_type == '天'">天</template>
            </el-tag> -->
        </el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    在诊患者
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
                                <el-table-column label="编号" prop="index" width="60px"></el-table-column>
                                <el-table-column label="患者病历号" prop="case_number"></el-table-column>
                                <el-table-column label="患者名称" prop="name"></el-table-column>
                                <el-table-column label="患者状态" prop="status"></el-table-column>
                                <el-table-column label="挂号时间" prop="visit_date"></el-table-column>
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button type="primary" @click="updateHistory(scope.row)">更新履历</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer class="table-footer-pagination"
                    style="position:relative;flex-direction:row-reverse;height:32px;">
                    <el-pagination background layout="prev, pager, next" v-model="currentPage" @current-change="currentChange"
                        style="position: absolute;right:0;" :total="patientList.length" :page-size="pageSize" />
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