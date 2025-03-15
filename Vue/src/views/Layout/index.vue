<script setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import cookie from '@/utils/cookie'

cookie.checkForValidated(0);



const role = cookie.getRole();
const name = cookie.getDoctorName();

const menucontent = ref([
  {
    "title": "挂号收费", "level": 2, "list": [
      { 'title': "窗口挂号", 'path': '/onsite_registration' },
      { 'title': "窗口退号", 'path': '/registration_record' },
      { "title": "收费", "path": "/expense_charge" },
      { "title": "退费", "path": "/expense_refund" },
      { "title": "费用记录查询", "path": "/expense_manage" }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"></path></svg>'
  },
  { "title": "门诊医生", "level": 3, "list": [
      { "title": "患者查看", "path": "/physician_patient" },
      { "title": "医生诊疗:病例首页", "path": "/home_medical_record" },
      { "title": "医生诊疗:检查申请", "path": "/check_request" },
      { "title": "医生诊疗:检验申请", "path": "/inspection_request" },
      { "title": "看诊记录", "path": "/record" },
      { "title": "医生诊疗:检查结果", "path": "/check_results" },
      { "title": "医生诊疗:检验结果", "path": "/inspection_results" },
      { "title": "医生诊疗:门诊确诊", "path": "/outpatient_diagnosis" },
      { "title": "医生诊疗:开设处方", "path": "/write_prescription" },
      { "title": "医生诊疗:处置申请", "path": "/disposal_request" },
      { "title": "医生诊疗:费用查询", "path": "/expense_query" }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"></path></svg>' },
  { "title": "检查医生", "level": 5, "list": [
      { "title": "检查申请", "path": "/check_apply" },
      { "title": "患者录入", "path": "/check_patient" },
      { "title": "检查结果录入", "path": "/check_input" },
      { "title": "检察管理", "path": "/check_manage" }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M896 256H128v576h768zm-199.424-64-32.064-64h-304.96l-32 64zM96 192h160l46.336-92.608A64 64 0 0 1 359.552 64h304.96a64 64 0 0 1 57.216 35.328L768.192 192H928a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32m416 512a160 160 0 1 0 0-320 160 160 0 0 0 0 320m0 64a224 224 0 1 1 0-448 224 224 0 0 1 0 448"></path></svg>' },
  { "title": "检验医生", "level": 7, "list": [
      { "title": "检验申请", "path": "inspection_apply" },
      { "title": "患者录入", "path": "inspection_patient" },
      { "title": "检验结果录入", "path": "inspection_input" },
      { "title": "检验管理", "path": "inspection_manage" }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M896 529.152V512a384 384 0 1 0-768 0v17.152A128 128 0 0 1 320 640v128a128 128 0 1 1-256 0V512a448 448 0 1 1 896 0v256a128 128 0 1 1-256 0V640a128 128 0 0 1 192-110.848M896 640a64 64 0 0 0-128 0v128a64 64 0 0 0 128 0zm-768 0v128a64 64 0 0 0 128 0V640a64 64 0 1 0-128 0"></path></svg>' },
  { "title": "药物管理员", "level": 11, 'list': [
      { "title": "药房发药", "path": "give_medicine" },
      { "title": "药房退药", "path": "refund_medicine" },
      { "title": "药库管理", "path": "drug_storage" },
      { "title": "交易记录", "path": "tran_history" }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M192 256a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V320a64 64 0 0 0-64-64zm0-64h640a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H192A128 128 0 0 1 64 768V320a128 128 0 0 1 128-128"></path><path fill="currentColor" d="M544 512h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0zM352 128v64h320v-64zm-32-64h384a32 32 0 0 1 32 32v128a32 32 0 0 1-32 32H320a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"></path></svg>' },
  { "title": "处置医生", "level": 13, 'list': [
      { "title": "处置申请", "path": "disposal_apply" },
      { "title": "患者录入", "path": "disposal_patient" },
      { "title": "处置录入", "path": "disposal_input" },
      { "title": "处置管理", "path": "disposal_manage " }
    ], "icon": '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"></path><path fill="currentColor" d="M672 128h64v768h-64zM96 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32"></path></svg>' }
])

function handleCommand(command) {
  switch (command) {
    case 'userCenter':
      ElMessage.info('未实现的页面');
      break
    case 'logout':
      cookie.logout();
      break
  }
}
</script>

<template>
  <el-container class="main-container">
    <el-header class="header">
      <span class="name" style="margin-left:30px;">
        医疗管理系统
      </span>
      <div class="usersetting">
        <el-dropdown trigger="hover" @command="handleCommand" >
          <span class="el-dropdown-link" id="user-name">
            {{ name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- <span class="logo">
        <el-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" :fit="scale - down"
          style="height:24px;width:auto">
        </el-image>
      </span> -->
    </el-header>
    <el-container>
      <el-aside class="aside">
        <el-scrollbar accordion>
          <el-menu class="el-menu-vertical" mode="vertical" unique-opened="true">
            <template v-for="(item, index) in menucontent">
              <el-sub-menu :index="index" :title="item['title']" v-if="item['level'] % role == 0"
                class="el-sub-menu">
                <template #title>
                  <svg v-html="item['icon']" class="icon"></svg>
                  {{ item['title'] }}
                </template>
                <el-menu-item-group>
                  <template v-for="(subitem, subindex) in item['list']" :key="subindex">
                    <router-link :to="{ path: subitem.path }" class="router-link">
                      <el-menu-item :index="index + '-' + subindex" :title="subitem.title" class="el-menu-item">{{ subitem.title }}</el-menu-item>
                    </router-link>
                  </template>
                </el-menu-item-group>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  margin: 0%;
  padding: 0%;
  position: absolute;
}
.main-container::-webkit-scrollbar{
  display:none;
}

.header {
  background-color: var(--el-color-primary);
  height: 50px;
  width:100%;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  position: fixed;
  top: 0;
  left:0;
  z-index:2;
  overflow-x:hidden;
}

.aside {
  width: 250px;
  height:calc(100% - 50px);
  background-color: rgb(233, 233, 233);
  position: fixed;
  margin: 5px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  top:50px;
  left:0px;
}

.el-sub-menu {
  border: 0px;
  border-bottom: 0.5px;
  border-color: var(--el-color-primary-light-7);
  border-style: solid;
}

.usersetting {
  position: relative;
}

.name {
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  left: 20px;
}

.logo {
  position: relative;
  margin-right: 20px;
  height: 24px;
  width: auto;
}

svg.icon {
  width: 2em;
  height: 2em;
  vertical-align: -.1em;
  margin-right: 10px;
}
.router-link{
  color:black;
  font-style:initial;
  text-decoration: none;
}
.main{
  margin:0px;
  padding:0px;
  position:absolute;
  overflow-y:auto;
  overflow-x:hidden;
  top:50px;
  left:260px;
  width:calc(100% - 260px);
}
.main::-webkit-scrollbar {
  display:none;
}
</style>