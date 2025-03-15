<script setup>

</script>

<template>
<router-view></router-view>
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