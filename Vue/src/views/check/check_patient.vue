<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api'
import cookie from '@/utils/cookie';
import { ElMessage, ElNotification } from 'element-plus';


cookie.checkForValidated(5);

const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const briefInfo = ref({});
const patientId = ref(null);
const projectdata = ref([]);
const currentRow = ref(null);
const departments = ref([]);
const doctors = ref([]);
const department = ref(null);
const doctor = ref(null);
const filteredDoctor = ref([]);





function selectionChange(row) {
    currentRow.value = row;
    if (row.state == '已开立') {
        // ElNotification({
        //     title: '提示',
        //     message: '该患者还未缴费',
        //     type: 'warning',
        //     duration: 3000
        // });
        ElMessage.info('该患者还未缴费');
    }
    else if (row.state != '已缴费') {
        // ElNotification({
        //     title: '提示',
        //     message: '该项目状态为' + row.state,
        //     type: 'warning',
        //     duration: 3000
        // });
        ElMessage.info('该项目状态为' + row.state);
    }
}
function departmentChange() {
    if (department.value == null) {
        filteredDoctor.value = doctors.value;
        return;
    }
    filteredDoctor.value = doctors.value.filter(item => item.deptment_id == department.value);
    doctor.value = null;
    if (filteredDoctor.value.length == 0) {
        ElMessage.info('该科室目前没有值班医生');
        // ElNotification({
        //     title: '提示',
        //     message: '该科室目前没有值班医生',
        //     type: 'warning',
        //     duration: 3000
        // });
    }
}
function doctorChange(data) {
    if (data == null || department.value != null) {
        return;
    }
    department.value = filteredDoctor.value.find(item => item.id == data).deptment_id;
    departmentChange();
    doctor.value = data;
}
const start = async () => {
    if (currentRow.value == null || department.value == null || doctor.value == null) {
        ElMessage.error('请选择检查项目、科室和医生');
        return;
    }
    await api.beginCheck({
        id: currentRow.value.id,
        doctorId: doctor.value,
        time: new Date().getTime()
    })
    ElMessage.success('开始检查');
    reset();
    await fetchdata();
}

const reset = () => {
    doctor.value = null;
    department.value = null;
    filteredDoctor.value = doctors.value;
}
const fetchdata = async () => {
    patientId.value = cookie.getPatientId();
    let temp = await api.getPatientInfo({
        id: patientId.value
    });
    briefInfo.value = temp.data;

    temp = await api.getCheckProjectById({
        id: patientId.value
    });
    projectdata.value = temp.data;

    temp = await api.getSubjects({
        type: '检查'
    });
    departments.value = temp.data;

    temp = await api.getDoctor({
        type: '检查'
    });
    doctors.value = temp.data;
    filteredDoctor.value = doctors.value;
}
onMounted(() => {
    fetchdata();
})
</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header">
            <el-text type="Default" style="font-size:16px;font-weight: 600; margin-right:20px">患者信息:</el-text>
            <el-tag type="primary" v-for="item in briefInfoLabel" :key="item.prop" style="margin-right:5px">
                {{ item.label }}: {{ briefInfo[item.prop] }}
                <template v-if="item.label == '年龄' && briefInfo.age_type == '天'">天</template>
            </el-tag>
        </el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    检查项目
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container" style="flex-direction: column;">
                        <el-table :data="projectdata" max-height="300" highlight-current-row
                            @current-change="selectionChange" :selectable="true">
                            <el-table-column type="index" />
                            <el-table-column label="检查编码" prop="code" />
                            <el-table-column label="检查名称" prop="name" />
                            <el-table-column label="检查规格" prop="format" />
                            <el-table-column label="单价" prop="price" />
                            <el-table-column label="费用分类" prop="type" />
                        </el-table>
                        <div>
                            <el-tag>已选择的检查项目: {{ currentRow == null ? '' : currentRow.name }}</el-tag>
                        </div>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container" style="flex-direction: column;">
                        <el-header class="sub-title">
                            确认检查科室和检查名称
                        </el-header>
                        <el-main class="sub-content">
                            <el-row class="row">
                                <el-col :span="8" class="col">
                                    <el-form-item label="检查科室" class="unit">
                                        <el-select v-model="department" placeholder="请选择检查科室" filterable clearable
                                            @change="departmentChange"
                                            :disabled="currentRow != null && currentRow.state != '已缴费'">
                                            <el-option v-for="item in departments" :key="item.id"
                                                :label="item.dept_name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-form-item label="检查医生" class="unit">
                                        <el-select v-model="doctor" placeholder="请选择检查医生" filterable clearable
                                            @change="doctorChange"
                                            :disabled="currentRow != null && currentRow.state != '已缴费'">
                                            <el-option v-for="item in filteredDoctor" :key="item.id"
                                                :label="item.realname" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer class="footer">
                    <el-button type="primary" @click="start"
                        :disabled="currentRow != null && currentRow.state != '已缴费'">开始检查</el-button>
                    <el-button type="default" @click="reset"
                        :disabled="currentRow != null && currentRow.state != '已缴费'">重置医生</el-button>
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