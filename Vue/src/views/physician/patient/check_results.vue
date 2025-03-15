<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';
import { ElMessage } from 'element-plus';

cookie.checkForValidated(3);

const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const briefInfo = ref({});
const projectdata = ref([]);
const patientId = ref();
const bottomTable = ref([
    { 'label': '开立时间', prop: 'creation_time' },
    { 'label': '检查医生', prop: 'name' },
    { 'label': '检查部位', prop: 'check_position' },
    { 'label': '目的要求', prop: 'intention' },
    { 'label': '医嘱备注', prop: 'tips' },
    { 'label': '检查结果', prop: 'check_result' },
    {'label': '检查时间', prop: 'check_time'}
]);
const bottomTableData = ref({
    creation_time: '',
    name: '',
    check_position: '',
    intention: '',
    tips: '',
    check_result: '',
    check_time: ''
});
//tmd执行完成和已出结果有什么区别?你医生查看完检查结果写入了还是执行完成，和已出结果有什么区别？还一点注释都没有
const selectionChange = async(row) => {
    const temp = await api.getCheckResult({
        id: row.id
    })
    if(temp.status == 404){
        ElMessage.info("还未开始检查，请耐心等待");
        return;
    }
    bottomTableData.value = temp.data;
}
const fetchData = async () => {
    patientId.value = cookie.getPatientId();

    let temp = await api.getPatientInfo({
         id: patientId.value 
        });
    briefInfo.value = temp.data;

    temp = await api.getCheckProjectById({
        id: patientId.value
    });
    projectdata.value = temp.data;
}
onMounted(async () => {
    await fetchData();
});
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
                    检查结果
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-table :data="projectdata" max-height="300" highlight-current-row @current-change="selectionChange">
                            <el-table-column type="index" width="48px" />
                            <el-table-column label="检查编码" prop="code" />
                            <el-table-column label="检查名称" prop="name" />
                            <el-table-column label="检查规格" prop="format" />
                            <el-table-column label="单价" prop="price" />
                            <el-table-column label="费用分类" prop="type" />
                        </el-table>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            检查结果详情
                        </el-header>
                        <el-main class="sub-content" style="padding:0px;">
                            <el-row v-for="item in bottomTable" class="row" style="height:auto;">
                                <el-col :span="3" class="col" style="background-color:rgb(224,224,224)">
                                    <el-text style="font-size:16px;font-weight: 600;">{{ item['label'] }}</el-text>
                                </el-col>
                                <el-col :span="21" class="col">
                                    <el-input v-model="bottomTableData[item['prop']]" type="textarea" disabled rows="4"
                                        ></el-input>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                    <!-- 
                    </el-table> -->
                    <!-- <h>检查结果详情</h>
                    <el-row v-for="(item, index) in labelList" :key="index" :gutter="24">
                        <el-col :span="6">
                            <el-text type="primary">{{ item.label }}</el-text>
                        </el-col>
                        <el-col :span="18">
                            <el-tag>{{ item.val }}</el-tag>
                        </el-col>
                    </el-row> -->
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
    background-color: rgb(255, 255, 255);
}

.row {
    height: 60px;
    border:black 1px solid;
    border-bottom:0px;
}
.row:last-child {
    border-bottom:1px solid black;
}

.col {
    padding-right: 10px;
    display: flex;
    align-items: center;

}
.col:first-child{
    border-right:black 1px solid;
    padding-left:20px;
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