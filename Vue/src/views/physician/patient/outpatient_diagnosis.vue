<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';


cookie.checkForValidated(3);

const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const briefInfo = ref({});
const patientId = ref();
const flag = ref(false);
const bottomTable = ref([
    { 'label': '诊断结果', prop: 'diagnosis' },
    { 'label': '处理意见', prop: 'cure' },
])
const form = ref({
    diagnosis: '',
    cure: '',
    id: ''
})

function reset() {
    ElMessageBox.confirm('是否重置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        form.value = {
            diagnosis: '',
            cure: '',
            id: form.value.id
        };
    }).catch(() => {
        ElMessage.info('雑魚~雑魚~')
    });
}

const submit = async () => {
    if (!flag) {
        return;
    }
    const temp = await api.diagnose({
        id: form.value.id,
        result: form.value.diagnosis,
        suggestion: form.value.cure
    });
    if (temp.status == 200) {
        ElMessage.success('提交成功');
    }

}



const fetchData = async () => {
    patientId.value = cookie.getPatientId();

    let temp = await api.getPatientInfo({
        id: patientId.value
    });
    briefInfo.value = temp.data;

    temp = await api.getDiagnose({
        id: patientId.value
    });
    if (temp.status != 404) {
        form.value = temp.data;
    }

    temp = await api.getCheckProjectById({
        id: patientId.value
    });
    for (let el of temp.data){
        if(el.state == '已开立' || el.state == '已缴费' || el.state == '执行完成'){
            flag.value = true;
            break;
        }
    }
    if(flag.value){
        ElMessage.info("该病人还有未结束的检查项目，请耐心等待");
    }






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
                    门诊确诊
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            确诊信息录入
                        </el-header>
                        <el-main class="sub-content" style="padding:0px;">
                            <el-row v-for="item in bottomTable" class="row" style="height:auto;">
                                <el-col :span="3" class="col" style="background-color:rgb(224,224,224)">
                                    <el-text style="font-size:20px;font-weight: 600">{{ item['label'] }}</el-text>
                                </el-col>
                                <el-col :span="21" class="col">
                                    <el-input v-model="form[item['prop']]" type="textarea" rows="4"
                                        :disabled="flag"></el-input>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer class="form-footer" style="display:flex;flex-direction:row-reverse;">
                    <el-button type="default" @click="reset" :disabled="flag">重置</el-button>
                    <el-button type="primary" @click="submit" style="margin-right:20px" :disabled="flag">确定</el-button>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>
<script>

</script>
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