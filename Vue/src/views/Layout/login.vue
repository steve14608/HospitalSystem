<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import api from '@/utils/api'
import cookie from '@/utils/cookie';



const options = ['登录', '注册'];
const value = ref(options[0]);
// const name = ref('');
// const password = ref('');
// const confirmPassword = ref('');
const departments = ref([]);
const department = ref('');
const keepAlive = ref(false);
const formRef = ref(null);
const top = ref(0);
const rules = ref({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {  max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
    ],
    comfirmPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {  max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
    ]
});
const form = ref({
    name: '',
    password: '',
    comfirmPassword: ''
});
const loading = ref(false);

const submit = async () => {
    try {
        await formRef.value.validate();
        if (value.value == '登录') {
            await api.login({
                name: form.value.name,
                password: form.value.password,
                keepAlive: keepAlive.value
            }).then(res => {
                loading.value = false;
                if (res.status == 200) {
                    // cookie.set('token', res.data.token);
                    // cookie.set('user', res.data.user);
                    // cookie.set('user_id', res.data.user_id);
                    location.replace('/');
                }
                else {
                    ElMessage.error(res.msg);
                }
            })
        }

        
        else{
            ElMessage.error('功能暂未开放');
            // if(form.value.password!== form.value.comfirmPassword){
            //     ElMessage.error('两次密码输入不一致');
            //     return;
            // }
            // if(department.value === '' || department.value === undefined){
            //     ElMessage.error('请选择检查科室');
            //     return;
            // }
            // await api.register({
            //     name: form.value.name,
            //     password: form.value.password,
            //     keepAlive: keepAlive.value,
            //     department: department.value
            // }).then(res => {
            //     loading.value = false;
            //     if(res.code == 200){
            //         form.value.name = '';
            //         ElMessage.success('注册成功');
            //         location.replace('/');
            //     }
            //     else{
            //         ElMessage.error(res.msg);
            //     }
            // })
        }
    } catch (err) {
        return;
    }
}
function handleClick(val) {
    if (val == '注册') {
        top.value = 0;
    }
    else{
        top.value = 20;
    }
}
onMounted(async () => {
    const temp = await api.getSubjects()
    departments.value = temp.data;
})
</script>

<template>
    <div class="background">
        <el-card class="card" shadow="always">
            <template #header>
                <div class="card-header">
                    <el-segmented v-model="value" :options="options" block @change="handleClick" />
                </div>
            </template>
            <el-container :style="{ 'margin-top': top + 'px' }" class="login-container">
                <el-form ref="formRef" :rules="rules" :model="form" label-width="70px" style="padding:0px;height:150px"
                    class="login-form">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" placeholder="请输入姓名" clearable />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password/>
                    </el-form-item>
                    <el-form-item label="确认密码" v-show="value == '注册'" prop="confirmPassword">
                        <el-input type="password" v-model="form.comfirmPassword" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <el-form-item v-show="value == '注册'" label="检查科室" prop="department">
                        <el-select v-model="department" placeholder="请选择检查科室" style="width:60%;">
                            <el-option v-for="item in departments" :key="item.id" :label="item.dept_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-checkbox v-model="keepAlive" style="position:absolute;bottom:60px;right:30px;">保持登录</el-checkbox>
                <el-button type="primary" @click="submit" :loading="loading"
                    style="position:absolute;bottom:20px;width:calc(100% - 40px);left: 20px;">
                    {{ value === '登录' ? '登录' : '注册' }}
                </el-button>
            </el-container>
            <!-- <template #footer>
                <el-button type="primary" @click="handleSubmit" style="right:0px;">
                        {{ value === '登录' ? '登录' : '注册' }}
                    </el-button>
            </template> -->
        </el-card>
    </div>
</template>



<style scoped>
.background {
    background-color: var(--el-bg-color);
    filter: opacity(0.8);
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/R-C.png');
    background-size: cover;
    opacity: 0.8;
}

.login-container {
    margin: 20px;
    margin-left: 0px;
    margin-top: 20px;
    flex-direction: column;
}

.card {
    width: 330px;
    height: 340px;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--el-card-bg-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    opacity: 0.95;
}

.login-form {
    padding: 20px;
    width: 100%;
    height: auto;
}
</style>