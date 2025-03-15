<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import { ElMessage, ElNotification } from 'element-plus';
import cookie from '@/utils/cookie';


cookie.checkForValidated(5);

const input = ref('');
const input1 = ref('');
const currentPage = ref(1);
const maxPageSize = 10;
const patientList = ref([]);
const filteredPatientList = ref([]);
const currentRow = ref(null);
const currentRow1 = ref(null);
const projectdata = ref([]);
const departments = ref([]);
const doctors = ref([]);
const department = ref('');
const doctor = ref('');
const filteredDoctors = ref([]);
const checkresult = ref();
const tableref  = ref(null);



const search = async () => {
    const temp = await api.getCheckPatient({
        caseNO: input.value,
        name: input1.value
    })
    patientList.value = [];
    temp.data.forEach((element, index) => {
        element.index = index + 1;
        patientList.value.push(element);
    });
    filteredPatientList.value = patientList.value.slice(0, maxPageSize);
}
function PageChange() {
    filteredPatientList.value = patientList.value.slice((currentPage - 1) * maxPageSize, currentPage * maxPageSize);
}
const currentChange = async function (current) {
    currentRow.value = current
    currentRow1.value = null;
    const temp = await api.getCheckProjectById({
        id: currentRow.value.id
    })
    projectdata.value = temp.data;
}
function currentChange1(current) {
    currentRow1.value = current
    if (current == null) return;
    if (currentRow1.value.state == '已开立' || currentRow1.value.state == '已缴费') {
        // ElNotification({
        //     title: '提示',
        //     message: '该项目还未开始检查',
        //     type: 'warning',
        //     duration: 3000
        // });
        ElMessage.info('该项目还未开始检查');
    }
    else if (currentRow1.value.state != '执行完成') {
        // ElNotification({
        //     title: '提示',
        //     message: '该项目状态为' + currentRow1.value.state,
        //     type: 'warning',
        //     duration: 3000
        // });
        ElMessage.info('该项目状态为' + currentRow1.value.state);
    }
}

function filterDoctor() {
    filteredDoctors.value = doctors.value.filter(item => item.deptment_id == department.value);
    doctor.value = null;
}
function doctorChange() {
    if (doctor.value == null) return;
    department.value = filteredDoctors.value.find(item => item.id == doctor.value).deptment_id;
}


const fetchdata = async () => {
    let temp = await api.getSubjects({
        type: '检查'
    });
    departments.value = temp.data;

    temp = await api.getDoctor({
        type: '检查'
    });
    doctors.value = temp.data;
    filteredDoctors.value = doctors.value;
    
}
const submit = async () => {
    await api.sendCheckResult({
        id: currentRow1.value.id,
        result: checkresult.value,
        doctorId: doctor.value
    });
    ElMessage.success('提交成功');
    currentRow1.value.state = '已出结果';
    tableref.clearCurrentRow();
}
function reset() {
    checkresult.value = '';
    department.value = '';
    doctor.value = '';
}

onMounted(() => {
    fetchdata();
})
</script>



<template>
    <el-container class="main-container">
        <el-header class="main-header"></el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    检查结果录入
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            <el-row class="row">
                                <el-col :span="8" class="col">
                                    <el-input v-model="input" placeholder="请输入病历号"></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-input v-model="input1" placeholder="请输入患者姓名"></el-input>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-main class="sub-content" style="margin-bottom:20px;padding:0px;">
                            <el-table :data="filteredPatientList" border highlight-current-row
                                @current-change="currentChange">
                                <el-table-column label="序号" prop="index" width="60px"></el-table-column>
                                <el-table-column label="患者名称" prop="name"></el-table-column>
                                <el-table-column label="患者病历号" prop="caseNO"></el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                    <el-footer class="table-footer-pagination"
                        style="position:relative;flex-direction:row-reverse;height:32px;">
                        <el-pagination background layout="prev, pager, next" v-model="currentPage"
                            style="position: absolute;right:0;" :total="patientList.length" :page-size="maxPageSize"
                            @current-change="PageChange"></el-pagination>

                    </el-footer>
                    <el-divider />
                    <el-container class="sub-container" style="flex-direction: column;">
                        <el-table :data="projectdata" max-height="300" border highlight-current-row :ref="tableref"
                            @current-change="currentChange1">
                            <el-table-column type="index" width="60" />
                            <el-table-column label="检查编码" prop="code" />
                            <el-table-column label="检查名称" prop="name" />
                            <el-table-column label="检查规格" prop="format" />
                            <el-table-column label="单价" prop="price" />
                            <el-table-column label="费用分类" prop="type" />
                            <el-table-column prop="status" label="状态">
                                <template #default="scope">
                                    <el-tag disable-transitions>{{ scope.row.state }}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div>
                            <el-tag>已选择的检查项目: {{ currentRow1 != null ? currentRow1.name : '' }}</el-tag>
                        </div>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            选择输入检查结果的医生
                        </el-header>
                        <el-main class="sub-content">
                            <el-row class="row">
                                <el-col :span="8" class="col">
                                    <el-form-item label="检查科室" class="unit">
                                        <el-select v-model="department" placeholder="请选择检查科室" @change="filterDoctor"
                                            :disabled="currentRow1 == null || currentRow1.state != '执行完成'">
                                            <el-option v-for="item in departments" :key="item.id" :label="item.dept_name"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-form-item label="检查医生" class="unit">
                                        <el-select v-model="doctor" placeholder="请选择检查医生" @change="doctorChange"
                                            :disabled="currentRow1 == null || currentRow1.state != '执行完成'">
                                            <el-option v-for="item in filteredDoctors" :key="item.id" :label="item.realname"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-header class="sub-title">输入检查结果</el-header>
                        <el-main class="sub-content" style="padding:0px;">
                            <el-row class="row" style="border:black 1px solid;height:auto;">
                                <el-col :span="3" class="col"
                                    style="padding-left:20px;border-right:black 1px solid;background-color: rgb(224,224,224);">
                                    <el-text
                                        style="font-size:16px;font-weight:600;background-color: rgb(224,224,224);">检查结果</el-text>
                                </el-col>
                                <el-col :span="21" class="col" style="padding:0px;">
                                    <el-input v-model="checkresult" type="textarea" :rows="4"
                                        :disabled="currentRow1 == null || currentRow1.state != '执行完成'"
                                        placeholder="请输入检查结果"></el-input>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer class="footer">
                    <el-button type="primary" @click="submit"
                        :disabled="currentRow1 == null || currentRow1.state != '执行完成'">提交</el-button>
                    <el-button type="default" @click="reset"
                        :disabled="currentRow1 == null || currentRow1.state != '执行完成'">重置</el-button>
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
    padding: 0px;
}

.sub-sub-content {
    padding: 0px;
}

.table-footer-pagination {
    position: absolute;
    right: 20px;
    height: auto;
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