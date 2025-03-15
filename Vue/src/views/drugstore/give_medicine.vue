<script setup>
import { ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';



cookie.checkForValidated(11);

const input = ref('');
const input1 = ref('');
const currentPage = ref(1);
const maxNumPerPage = 10;
const patientList = ref([]);
const drugList = ref([]);
const filteredPatientList = ref([]);

const search = async () => {
    const temp = await api.getMedicinePatient({
        caseNO: input.value,
        name: input1.value
    });
    patientList.value = temp.data;
    if (patientList.value.length === 0) {
        ElMessage.error('没有找到患者信息');
    }
    currentPage.value = 1;
    filteredPatientList.value = patientList.value.slice((currentPage.value - 1) * maxNumPerPage, currentPage.value * maxNumPerPage);
}

const showDetails = async (row) => {
    const temp = await api.getPatientMedicine({
        id: row.id
    });
    drugList.value = temp.data;
    if (drugList.value.length === 0) {
        ElMessage.error('没有找到患者药品信息');
    }
}
const sendMedicine = async (row) => {
    await api.sendPatientMedicine({
        id: row.id
    });
    ElMessage.success('发药成功');
    row.state = '已发药';
}
function currentChange() {
    filteredPatientList.value = patientList.value.slice((currentPage.value - 1) * maxNumPerPage, currentPage.value * maxNumPerPage);
}
</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header"></el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    发药
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            <el-row class="row">
                                <el-col :span="8" class="col">
                                    <el-input v-model="input" placeholder="请输入患者病历号"></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-input v-model="input1" placeholder="请输入患者姓名"></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-main class="sub-content" style="padding:0px;">
                            <el-table :data="filteredPatientList" border>
                                <el-table-column label="编号" type="index" width="60px"></el-table-column>
                                <el-table-column label="患者名称" prop="name"></el-table-column>
                                <el-table-column label="患者病历号" prop="caseNO"></el-table-column>
                                <el-table-column label="患者年龄" prop="age">
                                    <template #default="scope">
                                        {{ scope.row.age }}{{ scope.row.ageType === '岁' ? '' : '天' }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="患者性别" prop="gender"></el-table-column>
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button type="primary" @click="showDetails(scope.row)">显示药品</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-main>
                        <el-footer class="table-footer-pagination"
                            style="position:relative;flex-direction:row-reverse;height:32px;margin-top:20px;">
                            <el-pagination background layout="prev, pager, next" v-model="currentPage"
                                style="position: absolute;right:0;" :total="patientList.length"
                                :page-size="maxNumPerPage" :current-change="currentChange" />
                        </el-footer>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-main class="sub-content" style="padding:0px">
                            <el-table :data="drugList" border>
                                <el-table-column type="index" width="60px"></el-table-column>
                                <el-table-column label="药品编码" prop="code"></el-table-column>
                                <el-table-column label="药品名称" prop="name"></el-table-column>
                                <el-table-column label="药品规格" prop="format"></el-table-column>
                                <el-table-column label="包装单位" prop="unit"></el-table-column>
                                <el-table-column label="生产厂家" prop="manufacturer"></el-table-column>
                                <el-table-column label="单价" prop="price"></el-table-column>
                                <el-table-column label="数量" prop="number"></el-table-column>
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button type="primary" @click="sendMedicine(scope.row)"
                                            :disabled="scope.row.state != '已缴费'">发药</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
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