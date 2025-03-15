<script setup>
import { onMounted, reactive } from 'vue';
import { ref, toRaw } from 'vue';
import api from '@/utils/api.js';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import cookie from '@/utils/cookie.js'

cookie.checkForValidated(2);
const chargeType = ["现金", "银行卡", "微信", "医保卡", "支付宝"];
const formRef = ref(null);
const form = ref({
    caseNO: null,
    name: null,
    gender: null,
    age: null,
    ageType: '岁',
    birthday: null,
    card_number: null,
    address: null,
    settlementType: null,
    visit_date: new Date().toLocaleDateString(),
    noon: new Date().getHours() >= 12 ? '下午' : '上午',
    department: null,
    doctorType: null,
    doctor: null,
    initialNumber: null,
    rest: null,
    ifBook: false,
    fee: null,
    chargeType: null

});

const rules = ref({
    name: [
        { required: true, message: '姓名不能为空', trigger: 'blur' }
    ],
    caseNO: [
        { required: true, message: '病历号不能为空', trigger: 'blur' },
        { type: 'number', message: '病历号必须为数字', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '性别不能为空', trigger: 'blur' }
    ],
    age: [
        { required: true, message: '年龄不能为空', trigger: 'blur' },
        { type: 'number', message: '年龄必须为数字', trigger: 'blur' }
    ],
    ageType: [
        { required: true, message: '年龄单位不能为空', trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: '出生日期不能为空', trigger: 'blur' }
    ],
    card_number: [
        { required: true, message: '身份证号不能为空', trigger: 'blur' },
        { max: 20, message: '身份证号过长', trigger: 'blur' }
    ],
    settlementType: [
        { required: true, message: '结算类型不能为空', trigger: 'blur' }
    ],
    visit_date: [
        { required: true, message: '确诊日期不能为空', trigger: 'blur' }
    ],
    noon: [
        { required: true, message: '上下午不能为空', trigger: 'blur' }
    ],
    department: [
        { required: true, message: '挂号科室不能为空', trigger: 'blur' }
    ],
    doctorType: [
        { required: true, message: '号别不能为空', trigger: 'blur' }
    ],
    doctor: [
        { required: true, message: '医生不能为空', trigger: 'blur' }
    ],
    initialNumber: [
        { required: true, message: '初始号不能为空', trigger: 'blur' },
        { type: 'number', message: '初始号必须为数字', trigger: 'blur' }
    ],
    rest: [
        { required: true, message: '已用号不能为空', trigger: 'blur' },
        { type: 'number', message: '已用号必须为数字', trigger: 'blur' }
    ],
    ifBook: [
        { required: true, message: '是否使用号源不能为空', trigger: 'blur' }
    ],
    fee: [
        { required: true, message: '挂号费不能为空', trigger: 'blur' },
    ],
    chargeType: [
        { required: true, message: '收费类型不能为空', trigger: 'blur' }
    ]
});
const settlementType = ref([]);
const department = ref([]);
const doctorType = ref([]);
const doctor = ref([]);
const filteredDoctor = ref([]);
const loading = ref(false);

let fuck = [1, 2, 3]

const fetchData = async () => {
    try {
        let temp = await api.getCalcType();
        Object.values(temp.data).forEach(item => {
            settlementType.value.push(item);
        });

        temp = await api.getSubjects({
            type: '门诊'
        });
        Object.values(temp.data).forEach(item => {
            department.value.push(item);
        });

        temp = await api.getDoctorType();
        Object.values(temp.data).forEach(item => {
            doctorType.value.push(item);
        });

        temp = await api.getDoctor({
            type: '门诊'
        });
        Object.values(temp.data).forEach(item => {
            doctor.value.push(item);
        });

        await getCaseNO();

        filteredDoctor.value = doctor.value;
    } catch (error) {
        console.log(error);
    }
};
async function getCaseNO() {
    const temp = await api.getCaseNO();
    form.value.caseNO = temp.data;
}
onMounted(fetchData);

function filterDoctor() {
    filteredDoctor.value = doctor.value.filter(item => {
        return (form.value.department == null || item.deptment_id === form.value.department) && (form.value.doctorType == null || item.regist_level_id === form.value.doctorType);
    });
    form.value.doctor = null;
    updateFee();
}
function selectChange(id) {
    if (id == null) return;
    let temp = 1;
    for (temp = 0; temp < department.value.length; ++temp) {
        if (department.value[temp].id == filteredDoctor.value[id].deptment_id) {
            form.value.department = department.value[temp].id;
            break;
        }
    }
    for (temp = 0; temp < doctorType.value.length; ++temp) {
        if (doctorType.value[temp].id == filteredDoctor.value[id].regist_level_id) {
            form.value.doctorType = doctorType.value[temp].id;
            break;
        }
    }
    updateFee();
    getRestQuantity({
        doctorTypeId: form.value.doctorType,
        doctorId: filteredDoctor.value[id].id,
    });
}
function updateFee() {
    if (form.value.doctorType != null) {
        form.value.fee = doctorType.value.find(item => item.id == form.value.doctorType).regist_fee + (form.value.ifBook ? 1 : 0);
        updateQuota();
    }
}
function updateQuota() {
    form.value.initialNumber = doctorType.value.find(item => item.id == form.value.doctorType).regist_quota;
}
async function getRestQuantity(data) {
    let temp = await api.getRestQuantity(data);
    form.value.rest = temp.data;
}
const submit = async () => {
    // console.log(form.value.birthday,new Date(form.value.birthday).getTime());
    
    
    try {
        await formRef.value.validate();
        let formdata = new URLSearchParams();
        formdata.append('caseNO', form.value.caseNO);
        formdata.append('name', form.value.name);
        formdata.append('gender', form.value.gender);
        formdata.append('card_number', form.value.card_number);
        formdata.append('birthday', new Date(form.value.birthday).getTime().toString());
        formdata.append('age', form.value.age);
        formdata.append('ageType', form.value.ageType);
        formdata.append('address', form.value.address);
        formdata.append('visit_date', new Date(form.value.visit_date).getTime().toString());
        formdata.append('noon', form.value.noon);
        formdata.append('deptment_id', form.value.department);
        formdata.append('employee_id', doctor.value[form.value.doctor].id);
        formdata.append('regist_level_id', form.value.doctorType);
        formdata.append('settlement_category_id', form.value.settlementType);
        formdata.append('regist_method', form.value.chargeType);
        formdata.append('ifBook', form.value.ifBook ? 1 : 0);


        await api.sendRegisterInfo(formdata).then(() => {
            ElMessage.success('挂号成功');
            reset("ad");
            getCaseNO();
            loading.value = false;
        }).catch(error => {
            ElMessage.error('挂号失败');
            loading.value = false;
        });
    } catch (error) {
        ElMessage.error('请检查输入项');
        // console.log(error);
    }
};

const reset = (data) => {
    if(data!= null){
        formRef.value.resetFields();
        ElMessage("重置成功");
        return;
    }
    ElMessageBox.confirm('是否重置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        formRef.value.resetFields();
        ElMessage("重置成功");
    }).catch(() => {
        ElMessage.info('雑魚~雑魚~')
    });
};




</script>

<template>
    <el-container class="main-container">
        <el-header class="main-header">
        </el-header>
        <el-main class="main">
            <el-container>
                <el-header class="main-title">
                    窗口挂号
                </el-header>
                <el-divider />
                <el-main class="main-content">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" status-icon
                        label-position="left">
                        <el-container class="sub-container">
                            <el-header class="sub-title">
                                患者信息
                            </el-header>
                            <el-main class="sub-content">
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="病历号" prop="caseNO" class="unit">
                                            <el-input type="number" v-model.number="form.caseNO" class="input"
                                                disabled />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="姓名" prop="name" class="unit">
                                            <el-input type="text" v-model="form.name" class="input" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="性别" prop="gender" class="unit">
                                            <el-select v-model="form.gender" placeholder="请选择" style="width:60%">
                                                <el-option label="男" value="男"></el-option>
                                                <el-option label="女" value="女"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="年龄" prop="age" class="unit">
                                            <el-input-number v-model="form.age" :min="1" :max="365" :controls="false"
                                                style="flex:1"></el-input-number>
                                            <el-select v-model="form.ageType" style="flex:1">
                                                <el-option label="岁" value="岁"></el-option>
                                                <el-option label="天" value="天"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="出生日期" prop="birthday" class="unit">
                                            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="身份证号" prop="card_number" class="unit">
                                            <el-input v-model="form.card_number" class="input" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="24" class="col">
                                        <el-form-item label="家庭地址" prop="address" class="unit">
                                            <el-input type="text" v-model="form.address" class="input"
                                                placeholder="请输入详细地址(可选)" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-main>
                        </el-container>
                        <el-divider />
                        <el-container class="sub-container">
                            <el-header class="sub-title">
                                挂号信息
                            </el-header>
                            <el-main class="sub-content">
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="结算类型" prop="settlementType" class="unit">
                                            <el-select v-model="form.settlementType" placeholder="请选择" filterable
                                                style="width:60%">
                                                <el-option v-for="item in settlementType" :label="item.settle_name"
                                                    :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="确诊日期" prop="visit_date" class="unit">
                                            <el-date-picker v-model="form.visit_date" type="date"
                                                disabled></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="上下午" prop="noon" class="unit">
                                            <el-select v-model="form.noon"
                                                :default-value="new Date().getHours() >= 12 ? '下午' : '上午'"
                                                disabled></el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="挂号科室" prop="department" class="unit">
                                            <el-select v-model="form.department" placeholder="请选择" style="width:60%"
                                                @change="filterDoctor" filterable clearable>
                                                <el-option v-for="item in department" :label="item.dept_name"
                                                    :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="号别" prop="doctorType" class="unit">
                                            <el-select v-model.number="form.doctorType" placeholder="请选择" filterable
                                                @change="filterDoctor" clearable style="width:60%">
                                                <el-option v-for="item in doctorType" :label="item.regist_name"
                                                    :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="看诊医生" prop="doctor" class="unit">
                                            <el-select v-model="form.doctor" placeholder="请选择" style="width:60%"
                                                @change="selectChange" filterable clearable>
                                                <el-option v-for="item, index in filteredDoctor" :label="item.realname"
                                                    :value="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="初始号额" prop="initialNumber" class="unit">
                                            <el-input v-model.number="form.initialNumber" placeholder="初始号额"
                                                class="input" disabled />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="剩余号额" prop="rest" class="unit">
                                            <el-input v-model.number="form.rest" placeholder="剩余号额" class="input"
                                                disabled />
                                            <!-- 动态加载 -->
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="病历本" prop="ifBook" class="unit">
                                            <el-switch v-model="form.ifBook" class="ml-2" @change="updateFee"
                                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="8" class="col">
                                        <el-form-item label="应收金额" prop="fee" class="unit">
                                            <el-input v-model="form.fee" placeholder="挂号费" class="input" disabled />
                                            <!-- 动态加载 -->
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col">
                                        <el-form-item label="收费方式" prop="chargeType" class="unit">
                                            <el-select v-model="form.chargeType" placeholder="请选择" style="width:60%"
                                                filterable>
                                                <el-option v-for="item in chargeType" :label="item"
                                                    :value="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="col"></el-col>
                                </el-row>
                            </el-main>
                        </el-container>
                        <div class="form-footer" style="display:flex;flex-direction:row-reverse;">
                            <el-button type="default" @click="reset" :loading="loading">清空</el-button>
                            <el-button type="primary" @click="submit" style="margin-right:20px">提交</el-button>

                        </div>
                    </el-form>
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
    overflow-y: hidden;
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
}

.sub-sub-content {
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>