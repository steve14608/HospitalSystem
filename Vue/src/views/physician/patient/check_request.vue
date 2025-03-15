<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';
import { ElMessage, ElMessageBox } from 'element-plus';

cookie.checkForValidated(3);

const dialogFormVisible = ref(false);
const patientId = ref(0);
const projectdata = ref([{
    'id': null,
    'projectId': '',
    'name': '',
    'format': '',
    'price': '',
    'type': '',
    'intention': '',
    'checkPosition': '',
    'tips': '',
    'state': ''
}]);
const tableref0 = ref(null);
const totalprice = ref(0);
const currentSelection = ref({});
const searchResult = ref([]);
const input = ref('');
const input1 = ref('');
const requestInfo = ref({
    intention: '',
    checkPosition: '',
    tips: ''
});
//tmd什么设计,
const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const briefInfo = ref({});
const bottomTable = ref([
    { 'label': '目的要求', 'flex': 2, prop: 'intention' },
    { 'label': '检查部位', 'flex': 1, prop: 'checkPosition' },
    { 'label': '备注', 'flex': 2, prop: 'tips' }
]);
const selectionChange = async (row) => {

    currentSelection.value = row;
    if (row.id != -1) {
        const temp = await api.getCheckRequestInfo({
            id: row.id
        });
        requestInfo.value.intention = temp.data.intention;
        requestInfo.value.checkPosition = temp.data.checkPosition;
        requestInfo.value.tips = temp.data.tips;
    }
    else {
        requestInfo.value.intention = row.intention;
        requestInfo.value.checkPosition = row.checkPosition;
        requestInfo.value.tips = row.tips;
    }
}

const deleteSelectedRow = async () => {
    if (currentSelection.value == null || currentSelection.value.state != '已开立') { return; }
    if (currentSelection.value.id == -1) {
        projectdata.value.splice(projectdata.value.indexOf(currentSelection.value), 1);
    }
    else {
        projectdata.value.splice(projectdata.value.indexOf(currentSelection.value), 1);
        api.deleteCheckProject({
            id: currentSelection.value.id
        });
    }
    totalprice.value -= currentSelection.value.price;
    currentSelection.value = null;
    requestInfo.value.intention = '';
    requestInfo.value.checkPosition = '';
    requestInfo.value.tips = '';
}
const search = async () => {
    const temp = await api.getCheckProject({
        code: input.value,
        name: input1.value
    });
    searchResult.value = temp.data;
}
const submitForm = async () => {
    if (currentSelection.value == null) {
        ElMessage.info('请选择项目');
        return;
    }
    else if (currentSelection.value.state != '已开立') {
        ElMessage.info('该项目已缴费');
        return;
    }

    currentSelection.value.intention = requestInfo.value.intention;
    currentSelection.value.checkPosition = requestInfo.value.checkPosition;
    currentSelection.value.tips = requestInfo.value.tips;


    let formdata = new URLSearchParams();
    formdata.append('patientId', patientId.value);
    formdata.append('projectId', currentSelection.value.projectId);
    formdata.append('intention', requestInfo.value.intention);
    formdata.append('checkPosition', requestInfo.value.checkPosition);
    formdata.append('tips', requestInfo.value.tips);
    formdata.append('time', new Date().getTime().toString());
    formdata.append('checkId', currentSelection.value.id);

    const temp = await api.sendCheckRequest(formdata);
    ElMessage.success('提交成功');
    if(currentSelection.value.id == -1){
        currentSelection.value.id = temp.data;
    }
    // if (currentSelection.value.id != -1) {

    //     const temp = await api.sendCheckRequest({
    //         checkId: currentSelection.value.id,
    //         checkRequest: formdata
    //     });
    //     if (temp.status == 200) {
    //         ElMessage.success('提交成功');
    //     }
    //     else {
    //         ElMessage.error('提交失败');
    //     }
    // }
    // else {
    //     const temp = await api.sendCheckRequest({
    //         checkRequest: formdata
    //     });
    //     ElMessage.success('提交成功');
    //     currentSelection.value.id = temp.data;
    // }
}

function addProject(row) {
    row.state = '已开立';
    row.id = -1;
    row.intention = '';
    row.checkPosition = '';
    row.tips = '';
    let flag = true;
    projectdata.value.forEach(i => {
        if (row.projectId == i.projectId) {
            ElMessage.info('该项目已添加');
            flag = false;
            return;
        }
    })
    if (!flag) return;
    projectdata.value.push(row);
    totalprice.value += row.price;
}

function resetForm() {
    currentSelection.value.intention = '';
    currentSelection.value.checkPosition = '';
    currentSelection.value.tips = '';
    requestInfo.value.intention = '';
    requestInfo.value.checkPosition = '';
    requestInfo.value.tips = '';
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
    projectdata.value.forEach(i => {
        totalprice.value += i.price;
    });

    temp = await api.getCheckProject({
        code: '',
        name: ''
    });
    searchResult.value = temp.data;
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
                    检查申请
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-sub-title">
                            <el-button type="primary" disabled>项目金额: {{ totalprice.toFixed(2) }}元</el-button>
                        </el-header>
                        <el-main class="sub-sub-content">
                            <el-table :data="projectdata" max-height="300" highlight-current-row
                                @current-change="selectionChange" ref="tableref0">

                                <el-table-column label="检查编码" prop="code" />
                                <el-table-column label="检查名称" prop="name" />
                                <el-table-column label="检查规格" prop="format" />
                                <el-table-column label="单价" prop="price" />
                                <el-table-column label="费用分类" prop="type" />
                                <el-table-column>
                                    <template #header>
                                        <el-button type="text" @click="deleteSelectedRow">删除</el-button>
                                        <el-button type="text" @click="dialogFormVisible = true">增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            医嘱
                        </el-header>
                        <el-main class="sub-content" style="padding:0;">
                            <el-form>
                                <div style="display:flex;flex-direction:column;">
                                    <!-- <el-form-item v-for="item in bottomTable" :label="item['label']" :style="{flex: item['flex']}" class="fullsize-unit">
                                        <el-input v-model="form[item['prop']]" type="textarea" autosize
                                            :placeholder="`请输入${item.label}`" style="height:100%;"></el-input>
                                    </el-form-item> -->
                                    <el-row v-for="item in bottomTable" class="row" style="height:auto;">
                                        <el-col :span="3" class="col" style="background-color: rgb(224,224,224)">
                                            <el-text style="font-size:20px;font-weight: 600">{{ item['label']
                                                }}</el-text>
                                        </el-col>
                                        <el-col :span="21" class="col">
                                            <el-input v-model="requestInfo[item['prop']]" type="textarea"
                                                :rows="`${item['flex'] * 4}`" :placeholder="`请输入${item.label}`"
                                                :disabled="currentSelection == null || currentSelection.state != '已开立'"
                                                ></el-input>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-form>
                        </el-main>
                    </el-container>
                </el-main>


                <el-footer class="footer" style="display:flex;flex-direction: row-reverse;">
                    <el-button type="default" @click="resetForm"
                        :disabled="currentSelection == null || currentSelection.state != '已开立'">重置</el-button>
                    <el-button type="primary" @click="submitForm" style="margin-right:20px;"
                        :disabled="currentSelection == null || currentSelection.state != '已开立'">提交</el-button>
                </el-footer>
            </el-container>

        </el-main>

    </el-container>


    <el-dialog v-model="dialogFormVisible" title="选择项目" width="700px">
        <el-container class="sub-container">
            <el-header class="sub-sub-title">
                <el-row>
                    <el-col :span="8">
                        <el-input v-model="input" placeholder="请输入检查编码"></el-input>
                    </el-col>
                    <el-col :span="8" style="margin-left:20px;">
                        <el-input v-model="input1" placeholder="请输入检查名称"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider />
            <el-main class="sub-sub-content" style="padding:0;">
                <el-table :data="searchResult" border max-height="300">
                    <el-table-column label="检查编码" prop="code" />
                    <el-table-column label="检查名称" prop="name" />
                    <el-table-column label="检查规格" prop="format" />
                    <el-table-column label="单价" prop="price" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="text" @click="addProject(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>>
                </el-table>
            </el-main>
        </el-container>
    </el-dialog>
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
    border: black 1px solid;
    border-bottom: 0px;
}

.row:last-child {
    border-bottom: 1px solid black;
}

.col {
    padding-right: 10px;
    display: flex;
    align-items: center;

}

.col:first-child {
    border-right: black 1px solid;
    padding-left: 20px;
}

.col:last-child {
    padding-right: 0px;
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