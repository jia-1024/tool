<template>
  <h1>hello</h1>
  <button @click="mockEvent()">按钮</button>
</template>

<script setup>
function mockEvent() {
  window.logApi.log('测试日志');
  window.testApi.ping();
  console.log(window.configFileApi.readConfig());
}
</script>