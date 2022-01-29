<template>
  <div class="setting-detail">
    <div class="label">Available Params</div>
    <div class="label-item">Path <span>request path</span></div>
    <div class="label-item">Method <span>request method</span></div>
    <div class="label-item">Query <span>Query Param (may be null)</span></div>
    <div class="label-item">Body <span>Request Body (may be null)</span></div>
    <div class="label-item">PathParam<span>path Param (may be null)</span></div>
    <div class="template-container">
      <span class="label">Template</span>
<!--      <button>save</button>-->
    </div>
    <textarea placeholder="custom your function body" rows="10" v-model="template"/>
  </div>
</template>

<script>
import {Setting} from "@/observable/setting"

export default {
  name: 'SettingDetail',
  data() {
    return {
    }
  },
  computed: {
    template:{
      get() {
        return Setting.template
      },
      set(value){
        Setting.template = value
      }
    }
  },
  created() {
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting-detail {
  width: 300px;
  height: 400px;
  text-align: left;
  overflow: hidden;
}

.setting-detail > .template-container {
  height: 30px;
  line-height: 30px;
  padding-right: 15px;
}

.setting-detail > .template-container > .label {
  line-height: 30px;
}
.setting-detail > .template-container button {
  float: right;
  cursor: pointer;
  width: 50px;
  border: 1px solid #999999;
  color: white;
  margin-top: 4px;
  background: transparent;
}
.setting-detail > .template-container button:active{
  border: 1px solid #2c3e50;
}


.setting-detail .label {
  color: #aaaaaa;
  padding: 5px;
  line-height: 20px;
  font-size: 13px;
  font-weight: bold;
}

.setting-detail > .label-item {
  color: #cccccc;
  padding: 2px 15px;
  line-height: 15px;
  font-size: 10px;
  font-weight: bold;
}

.setting-detail > .label-item > span {
  font-weight: normal;
  float: right;
}

.setting-detail > textarea {
  width: 298px;
  resize: none;
  background: #5f738d;
  box-sizing: border-box;
  outline: none;
  border: none;
  color: aliceblue;
  padding: 5px;
  height: 300px;
  overflow-y: auto;
}

.setting-detail > textarea::-webkit-input-placeholder {
  color: #F0F8FFFF;
}
</style>
