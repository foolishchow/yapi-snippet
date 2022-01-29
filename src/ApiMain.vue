<template>
  <div class="api-main">
    <div class="tabs">
      <div :class="showResult ? 'active':''" @click="toggleSelect(0)">Interface</div>
      <div :class="showResult ? '':'active'" @click="toggleSelect(1)">Setting</div>
    </div>
    <interface-detail v-if="showResult"/>
    <setting-detail v-else/>
  </div>
</template>

<script>
import InterfaceDetail from "@/components/InterfaceDetail"
import SettingDetail from "@/components/SettingDetail";

export default {
  name: 'App',
  components: {
    InterfaceDetail,
    SettingDetail
  },
  data() {
    return {
      showResult: true
    }
  },
  methods: {
    /**
     * @param {number} index
     */
    toggleSelect(index){
      this.showResult = index === 0
    }
  }
}
</script>

<style>
.api-main {
  width: 300px;
  background: #1f252d;
}

.api-main > .tabs {
  height: 30px;
  border-bottom: 1px solid #999;
}

.api-main > .tabs > div {
  width: 150px;
  float: left;
  height: 30px;
  line-height: 30px;
  color: #aaaaaa;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.api-main > .tabs > div.active:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #c678dd;
}
</style>
