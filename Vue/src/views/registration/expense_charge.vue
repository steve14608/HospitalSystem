<script setup>
import { nextTick, onMounted, ref } from 'vue';
import api from '@/utils/api.js';
import { ElMessage } from 'element-plus';
import cookie from '@/utils/cookie.js'


cookie.checkForValidated(2);

const labelSet = ref([
    { 'label': '病历号', 'icon': '', 'value': '' },
    { 'label': '患者名', 'icon': '', 'value': '' },
    { 'label': '身份证号', 'icon': '', 'value': '' },
    { 'label': '年龄', 'icon': '', 'value': '' },
    { 'label': '性别', 'icon': '', 'value': '' }
])
const patientId = ref(0);
const ageType = ref('岁');
const projectList = ref([]);
const totalprice = ref(0);
const selectedPrice = ref(0);
const selectedRows = ref([]);
const tableref0 = ref(null);
const loading = ref(false);

const fetchData = async () => {
    try {
        const temp = await api.getChargeInfo({
            caseNO: labelSet.value[0].value,
            name: labelSet.value[1].value
        });
        if (temp.status == 400 || temp.status == 404) {
            ElMessage.error(temp.msg);
            return;
        }
        labelSet.value[1].value = temp.patientInfo.real_name;
        labelSet.value[2].value = temp.patientInfo.card_number;
        labelSet.value[3].value = temp.patientInfo.age;
        labelSet.value[4].value = temp.patientInfo.gender;
        patientId.value = temp.patientInfo.id;
        ageType.value = temp.patientInfo.age_type;
        totalprice.value = 0;
        selectedPrice.value = 0;
        projectList.value = [];

        temp.checkInfo.forEach(item => {
            projectList.value.push({
                id: item.id,
                name: item.name,
                price: item.price,
                type: item.type,
                specification: item.format,
                quantity: null,
                creationtime: item.creation_time,
                state: item.state
            });
            totalprice.value += item.price;

        });

        temp.medicineInfo.forEach(item => {
            projectList.value.push({
                id: item.id,
                name: item.name,
                price: item.price,
                type: '药品',
                specification: null,
                quantity: item.number,
                creationtime: item.creation_time,
                state: item.state
            });
            totalprice.value += item.price;
        });

    } catch (err) {
        ElMessage.error(err.message);
    }
}
const updateSelection = async () => {
    projectList.value.forEach((row) => {
            if (row.state != '已开立') {
                tableref0.value.toggleRowSelection(row, true);
            }
        })
    }
const search = async () => {
    await fetchData();
    await updateSelection();
}
const changeSelection = (selection) => {
    selectedRows.value = selection.filter(item => item.state === '已开立');
    selectedPrice.value = 0;
    selectedRows.value.forEach(item => {
        selectedPrice.value += item.price;
    });
}
const selectable = (row) => {
    return row.state === '已开立';
}
const pay = async () => {
    try {
        if(selectedRows.value.length == 0){
            ElMessage.error('请选择要结算的条目');
            return;
        }
        let lista = [];
        let listb = [];
        selectedRows.value.forEach(item => {
            if (item.type == '药品') {
                listb.push(item.id);
            }
            else{
                lista.push(item.id);
            }
        });
        api.sendChargeInfo({
            id: patientId.value,
            projectList: lista.join(','),
            drugList: listb.join(','),
        }).then(result=>{
            loading.value = false;
            if (result.status == 200) {
                ElMessage.success('结算成功');
                search();
            }
            else {
                ElMessage.error(result.msg);
            }
        })
    } catch (err) {
        ElMessage.error(err.message);
        loading.value = false;
    }
}

</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header"></el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    窗口收费
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container>
                        <el-header class="sub-title">
                            患者信息查询
                        </el-header>
                        <el-main class="sub-content">
                            <el-row class="row">
                                <el-col :span="8" v-for="(item, index) in labelSet.slice(0, 2)" class="col">
                                    <el-form-item :label=item.label class="unit">
                                        <el-input v-model="item.value" :placeholder="`请输入${item.label}`" clearable/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" class="col">
                                    <el-button type="primary" @click="search" style="margin-left:20px;">查询</el-button>
                                </el-col>
                            </el-row>

                        </el-main>
                    </el-container>
                    <el-divider />
                    <el-container class="sub-container">
                        <el-header class="sub-title">
                            患者信息确认
                        </el-header>
                        <el-main class="sub-content">
                            <el-row class="row">
                                <el-col :span="8" v-for="(item, index) in labelSet.slice(2, 5)" class="col">
                                    <!-- <el-text>{{ item.label }}: </el-text>
                                    <el-input v-model="item.value" disabled></el-input> -->
                                    <el-form-item :label=item.label class="unit">
                                        <el-input v-model="item.value" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-container class="sub-sub-container">
                                <el-header class="sub-sub-title">
                                    <el-button type="primary" disabled>项目金额: {{ totalprice.toFixed(2) }}元, 已选择: {{ selectedPrice.toFixed(2)
                                    }}元</el-button>
                                    <el-button type="primary" @click="pay" :loading="loading">结算</el-button>
                                </el-header>
                                <el-main class="sub-sub-content">
                                    <el-table :data="projectList" max-height="300" @selection-change="changeSelection"
                                        ref="tableref0" border>
                                        <el-table-column type="selection" :selectable="selectable" />
                                        <el-table-column label="名称" prop="name" />
                                        <el-table-column label="单价" prop="price" />
                                        <el-table-column label="类型" prop="type" />
                                        <el-table-column label="规格" prop="specification" />
                                        <el-table-column label="数量" prop="quantity" />
                                        <el-table-column label="开立时间" prop="creationtime" />
                                    </el-table>
                                </el-main>
                            </el-container>
                        </el-main>
                    </el-container>
                </el-main>
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
</style>