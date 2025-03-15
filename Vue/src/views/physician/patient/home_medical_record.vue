<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';
import { ElMessage, ElMessageBox } from 'element-plus';


cookie.checkForValidated(3);

const formItems = ref([
    { 'label': '主诉', 'prop': 'patientRequest', 'placeholder': '请输入主诉' },
    { 'label': '现病史', 'prop': 'currentDiseaseHistory', 'placeholder': '请输入现病史' },
    { 'label': '现病治疗情况', 'prop': 'currentCureInfo', 'placeholder': '请输入现病治疗情况' },
    { 'label': '既往史', 'prop': 'formerDiseaseInfo', 'placeholder': '请输入既往史' },
    { 'label': '过敏史', 'prop': 'allergicInfo', 'placeholder': '请输入过敏史' },
    { 'label': '体格检查', 'prop': 'bodyExaminationInfo', 'placeholder': '请输入体格检查' },
    { 'label': '检查，检验建议', 'prop': 'suggestion', 'placeholder': '请输入检查，检验建议' },
    { 'label': '注意事项', 'prop': 'notice', 'placeholder': '请输入注意事项' }
])
const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
])
const formdata = ref({
    patientId: '',
    patientRequest: '',
    currentDiseaseHistory: '',
    currentCureInfo: '',
    formerDiseaseInfo: '',
    allergicInfo: '',
    bodyExaminationInfo: '',
    suggestion: '',
    notice: '',
    diseaseList: [],
    id: ''
})
const briefInfo = ref({})
const dialogFormVisible = ref(false)
const searchResult = ref([])
const diseaseInfoList = ref([])
const input = ref('')
const input1 = ref('')
const selection = ref([])


const fetchData = async () => {
    formdata.value.patientId = cookie.getPatientId();

    if(isNaN(formdata.value.patientId)){
        ElMessage.error('未选择病人');
        return;
    }

    let temp = await api.getPatientInfo({
        id: formdata.value.patientId
    });
    briefInfo.value = temp.data;

    temp = await api.getJudgeInfo({
        id: formdata.value.patientId
    })
    if (temp.status == 200) {
        formdata.value.patientRequest = temp.judgeInfo.readme;
        formdata.value.currentDiseaseHistory = temp.judgeInfo.present;
        formdata.value.currentCureInfo = temp.judgeInfo.present_treat;
        formdata.value.formerDiseaseInfo = temp.judgeInfo.history;
        formdata.value.allergicInfo = temp.judgeInfo.allergy;
        formdata.value.bodyExaminationInfo = temp.judgeInfo.physique;
        formdata.value.suggestion = temp.judgeInfo.proposal;
        formdata.value.notice = temp.judgeInfo.careful;
        formdata.value.diseaseList = temp.diseaseList;
        formdata.value.id = temp.judgeInfo.id;
    }
    else{
        formdata.value.id = temp.id;
    }

    temp = await api.getDiseaseList({
        //idList: formdata.value.diseaseList.join(',')
        idList: formdata.value.diseaseList.map(item => item.disease_id).join(',')
    })

    diseaseInfoList.value = temp.data;

    temp = await api.getDisease({
        code: '',
        name: ''
    })
    searchResult.value = temp.data;
}

const search = async () => {
    let temp = await api.getDisease({
        code: input.value,
        name: input1.value
    })
    searchResult.value = temp.data;
}
function reset() {
    ElMessageBox.confirm('是否重置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        formdata.value.patientRequest = '';
        formdata.value.currentDiseaseHistory = '';
        formdata.value.currentCureInfo = '';
        formdata.value.formerDiseaseInfo = '';
        formdata.value.allergicInfo = '';
        formdata.value.bodyExaminationInfo = '';
        formdata.value.suggestion = '';
        formdata.value.notice = '';
        formdata.value.diseaseList = [];
        diseaseInfoList.value = [];
        
    }).catch(() => {
        ElMessage.info('雑魚~雑魚~')
    });

}
const submit = async () => {
    const newformdata = new FormData();
    newformdata.append('id', formdata.value.id);
    newformdata.append('patientId', formdata.value.patientId);
    newformdata.append('patientRequest', formdata.value.patientRequest);
    newformdata.append('currentDiseaseHistory', formdata.value.currentDiseaseHistory);
    newformdata.append('currentCureInfo', formdata.value.currentCureInfo);
    newformdata.append('formerDiseaseInfo', formdata.value.formerDiseaseInfo);
    newformdata.append('allergicInfo', formdata.value.allergicInfo);
    newformdata.append('bodyExaminationInfo', formdata.value.bodyExaminationInfo);
    newformdata.append('suggestion', formdata.value.suggestion);
    newformdata.append('notice', formdata.value.notice);
    // newformdata.append('diseaseList', formdata.value.diseaseList.join(','));
    formdata.value.diseaseList.forEach(item => {
        newformdata.append('diseaseList', item);
    });
    let temp = await api.sendJudgeInfo(newformdata);
    if (temp.status == 200) {
        ElMessage.success('保存成功');
    }
}
function selectionChange(val) {
    selection.value = val;
}
function deleteSelectedRow() {
    // formdata.value.diseaseList = formdata.value.diseaseList.filter(item => !selection.value.includes(item));
    diseaseInfoList.value = diseaseInfoList.value.filter(item => !selection.value.includes(item));
    formdata.value.diseaseList = diseaseInfoList.value.map(item => item.id);
    selection.value = [];
}
function addDisease(row) {
    if (formdata.value.diseaseList.includes(row.id)) {
        ElMessage.info('该疾病已添加');
        return;
    }
    formdata.value.diseaseList.push(row.id);
    diseaseInfoList.value.push(row);
}
onMounted(() => {
    fetchData()
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
                    病历首页
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            病案首页
                        </el-header>
                        <el-main class="sub-content">
                            <el-form ref="form" :model="form">
                                <el-row class="row" v-for="(item, index) in formItems.slice(0, 5)" :key="index"
                                    style="height:auto;">
                                    <el-col :span="3" class="col" style="background-color: rgb(224,224,224)">
                                        <el-text style="font-size:20px;font-weight: 600">{{
                                            item['label'] }}</el-text>
                                    </el-col>
                                    <el-col :span="21" class="col">
                                        <el-input v-model="formdata[item['prop']]" type="textarea" rows="3"
                                            :placeholder="`请输入${item.label}`"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="row" style="height:auto;">
                                    <el-col :span="3" class="col" style="background-color: rgb(224,224,224)">
                                        <el-text style="font-size:20px;font-weight: 600">诊断</el-text>
                                    </el-col>
                                    <el-col :span="21" class="col">
                                        <el-table :data="diseaseInfoList" max-height="300" border
                                            @selection-change="selectionChange">
                                            <el-table-column type="selection" width="48" />
                                            <el-table-column label="疾病编码" prop="code" />
                                            <el-table-column label="疾病名称" prop="name" />
                                            <el-table-column label="国际ICD编码" prop="icd" />
                                            <el-table-column label="疾病类型" prop="type" />
                                            <el-table-column>
                                                <template #header>
                                                    <el-button type="text" @click="deleteSelectedRow">删除</el-button>
                                                    <el-button type="text"
                                                        @click="dialogFormVisible = true">增加</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                                <el-row class="row" style="height:auto;" v-for="item in formItems.slice(5, 8)">
                                    <el-col :span="3" class="col" style="background-color: rgb(224,224,224)">
                                        <el-text style="font-size:20px;font-weight: 600">{{
                                            item['label'] }}</el-text>
                                    </el-col>
                                    <el-col :span="21" class="col">
                                        <el-input v-model="formdata[item['prop']]" type="textarea" rows="3"
                                            :placeholder="`请输入${item.label}`"></el-input>
                                    </el-col>
                                </el-row>

                            </el-form>
                        </el-main>
                    </el-container>
                    <div class="form-footer" style="flex-direction:row-reverse;display: flex;">
                        <el-button type="default" @click="reset">清空</el-button>
                        <el-button type="primary" @click="submit" style="margin-right:20px;">提交</el-button>

                    </div>
                </el-main>

            </el-container>

        </el-main>

    </el-container>

    <el-dialog v-model="dialogFormVisible" title="选择疾病" width="700px">
        <el-container>
            <el-header class="sub-sub-title">
                <el-row>
                    <el-col :span="8">
                        <el-input v-model="input" placeholder="请输入疾病编码"></el-input>
                    </el-col>
                    <el-col :span="8" style="margin-left:20px;">
                        <el-input v-model="input1" placeholder="请输入疾病名称"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider />
            <el-main class="sub-sub-content">
                <el-table :data="searchResult" max-height="300" border>
                    <el-table-column label="疾病编码" prop="code" />
                    <el-table-column label="疾病名称" prop="name" />
                    <el-table-column label="国际ICD编码" prop="icd" />
                    <el-table-column label="疾病类型" prop="type" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="text" @click="addDisease(scope.row)">选择</el-button>
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
    padding: 0px;
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
}

.sub-sub-content {
    padding-top: 0px;
    padding-bottom: 0px;
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

.dialog-body {
    height: fit-content;
    width: auto;
}
</style>