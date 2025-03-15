<script setup>
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import cookie from '@/utils/cookie';
import { ElMessageBox } from 'element-plus';

const flag = ref(false);
cookie.checkForValidated(3);
const briefInfoLabel = ref([
    { 'label': '姓名', 'prop': 'name' },
    { 'label': '病历号', 'prop': 'case_number' },
    { 'label': '年龄', 'prop': 'age' },
    { 'label': '性别', 'prop': 'gender' }
]);
const tagListLabel = [
    '药品编码',
    '包装单位',
    '生产厂家',
    '药剂类型',
    '药品类型'
]
const briefInfo = ref({});
const patientId = ref(null);
const dialogFormVisible = ref(false);
const tableref = ref(null);
const searchResult = ref([]);
const selection = ref([]);
const tableData = ref([]);
const totalprice = ref(0);
const input = ref('');
const input1 = ref('');

function selectionChange(val) {
    selection.value = val;
}
function reset() {
    ElMessageBox.confirm('是否重置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        tableData.value = [];
        totalprice.value = 0;
        selection.value = [];
    }).catch(() => {
        ElMessage.info('雑魚~雑魚~')
    });

}
const fetchData = async () => {
    patientId.value = cookie.getPatientId();

    let temp = await api.getPatientInfo({
        id: patientId.value
    });
    briefInfo.value = temp.data;

    temp = await api.getPrescription({
        id: patientId.value
    })

    //就是这么写的，不然有bug
    temp.data.forEach(i => {
        tableData.value.push(i['data']);
    });

    tableData.value.forEach(i => {
        if (i.state != '已开立') {
            tableref.value.toggleRowSelection(i, true);
        }
        totalprice.value += i.price * i.number;
    });


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
function deleteSelectedRow() {
    tableData.value = tableData.value.filter(i => !selection.value.includes(i));
    totalprice.value = 0;
    selection.value = [];
    tableData.value.forEach(i => {
        totalprice.value += i.price * i.number;
    });
}
onMounted(async () => {
    await fetchData();
});
const submit = async () => {
    // if (selection.value.length == 0) {
    //     ElMessage.error("请至少选择一个处方项");
    //     return;
    // }
    // let data = new FormData();
    // data.append('id', patientId.value);
    // selection.value.forEach((i, index) => {
    //     formData.append(`data[${index}].creation_time`, medicine.creation_time);
    //     formData.append(`data[${index}].drugId`, medicine.drugId);
    //     formData.append(`data[${index}].usage`, medicine.usage);
    //     formData.append(`data[${index}].number`, medicine.number);
    // });
    const data = {
        id: patientId.value,
        data: tableData.value.filter(j => j.state == '已开立' || j.state == null).map(
            i => {
                return {
                    creation_time: new Date(i.creation_time).getTime(),
                    drugId: i.drugId,
                    usage: i.usage,
                    number: i.number,
                }
            }
        )
    }
    await api.sendPrescription(data);
    ElMessage.success("保存成功");
    tableData.value = [];
    totalprice.value = 0;
    selection.value = [];
    fetchData();
}
const search = async () => {
    const temp = await api.getMedicine({
        name: input.value,
        pinyin: input1.value
    });
    searchResult.value = temp.data;
}
const addMedicine = async (row) => {
    const tagl = await api.getTagList({
        id: row.id
    });
    if (tagl.status != 200) {
        ElMessage.error("未知的药品");
        return;
    }
    for (let i = 0; i < tableData.value.length; ++i) {
        if (tableData.value[i].drugId == row.id) {
            ElMessage.error("药品已添加");
            return;
        }
    }
    tableData.value.push({
        drugId: row.id,
        name: row.name,
        format: row.format,
        price: row.price,
        usage: '',
        number: 1,
        tagList: tagl.data,
        flag: false,
        creation_time: new Date().getTime()
    });
    totalprice.value += row.price;
}
function selectable(row) {
    return row.state == '已开立';
}
function numberChange(val, old, row) {
    totalprice.value += (val - old) * row.price;
}
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
                    开设处方
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-container class="sub-container">
                        <el-header class="sub-sub-title">
                            <el-button type="primary" disabled>项目金额: {{ totalprice.toFixed(2) }}元</el-button>
                        </el-header>
                        <el-main class="sub-sub-content">
                            <el-table :data="tableData" border @selection-change="selectionChange"
                                :seletable="selectable" ref="tableref">
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column type="expand">
                                    <template #default="props">
                                        <el-row>
                                            <el-col :span="2"></el-col>
                                            <el-col :span="22">
                                                <el-tag v-for="item, index in props.row.tagList"
                                                    style="margin-right:5px">{{ tagListLabel[index] }}:{{ item
                                                    }}</el-tag>
                                            </el-col>
                                        </el-row>

                                    </template>
                                </el-table-column>
                                <el-table-column label="药品名称" prop="name"></el-table-column>
                                <el-table-column label="药品规格" prop="format"></el-table-column>
                                <el-table-column label="单价" prop="price"></el-table-column>
                                <el-table-column label="用法用量" prop="usage">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.usage" placeholder="请输入用法用量"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数量" prop="number">
                                    <template #default="scope">
                                        <el-input-number v-model="scope.row.number" :min="1" :max="1000"
                                            @change="(newValue, oldValue) => numberChange(newValue, oldValue, scope.row)"
                                            :step="1"></el-input-number>
                                    </template>
                                </el-table-column>
                                <el-table-column>
                                    <template #header>
                                        <el-button type="text" @click="deleteSelectedRow"
                                            style="margin-left:20px;">删除</el-button>
                                        <el-button type="text" @click="dialogFormVisible = true"
                                            style="margin-left:20px;">增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer class="footer" style="display:flex;flex-direction:row-reverse;">
                    <el-button type="default" @click="reset">重置处方</el-button>
                    <el-button type="primary" @click="submit" style="margin-right:20px" :disabled="flag">开立处方</el-button>

                </el-footer>
            </el-container>

        </el-main>

    </el-container>

    <el-dialog v-model="dialogFormVisible" title="添加药品" width="700px">
        <el-container class="sub-container">
            <el-header class="sub-title">
                <el-row class="row">
                    <el-col :span="8" class="col">
                        <el-input v-model="input" placeholder="请输入药品名称"></el-input>
                    </el-col>
                    <el-col :span="12" class="col">
                        <el-input v-model="input1" placeholder="请输入药品拼音助记码(支持模糊查询)"></el-input>
                    </el-col>
                    <el-col :span="4" class="col">
                        <el-button type="primary" @click="search" style="margin-left:20px;">搜索</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-main class="sub-content" style="padding:0;">
                <el-table :data="searchResult" max-height="300">
                    <el-table-column label="药品编码" prop="code" />
                    <el-table-column label="药品名称" prop="name" />
                    <el-table-column label="药品规格" prop="format" />
                    <el-table-column label="药品单价" prop="price" />
                    <el-table-column label="包装单位" prop="unit" />
                    <el-table-column label="生产厂家" prop="manufacturer" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="text" @click="addMedicine(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>>
                </el-table>
            </el-main>
            <el-footer class="form-footer" style="display:flex;flex-direction:row-reverse;">
                <el-button type="primary" @click="dialogFormVisible = false">完成</el-button>
            </el-footer>
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