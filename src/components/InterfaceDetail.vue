<template>
  <div class="interface-detail">
    <div class="name">
      <input type="text" placeholder="自定义方法名" v-model="customName"/>
      <button @click="copy">复制</button>
    </div>
    <div class="name">
      <input type="text" placeholder="选取结果" v-model="customPath"/>
    </div>
    <div class="detail">
      <pre v-highlight="template"><code class="hljs language-javascript">{{ template }}</code></pre>
    </div>
  </div>
</template>

<script>
import {queryInterface} from "@/channel";
import {parseScheme2Template} from "@/parse";
import {Setting} from '@/observable/setting'

export default {
  name: 'InterfaceDetail',
  data() {
    return {
      scheme: {},
      document: "",
      customName: "",
      customPath: "",
      status: 0
    }
  },
  computed: {
    template() {
      if (Object.keys(this.scheme).length === 0) return ""
      return parseScheme2Template(
          this.scheme, this.document,
          this.customName, this.customPath,
          Setting.template
      )
    }
  },
  created() {
    this.queryInterface()
  },
  methods: {
    copy() {
      //Create a textbox field where we can insert text to.
      var copyFrom = document.createElement("textarea");

      //Set the text content to be the text you wished to copy.
      copyFrom.textContent = this.template;

      //Append the textbox field into the body as a child.
      //"execCommand()" only works when there exists selected text, and the text is inside
      //document.body (meaning the text is part of a valid rendered HTML element).
      document.body.appendChild(copyFrom);

      //Select all the text!
      copyFrom.select();

      //Execute command
      document.execCommand('copy');

      //(Optional) De-select the text using blur().
      copyFrom.blur();

      //Remove the textbox field from the document.body, so no other JavaScript nor
      //other elements can get access to this.
      document.body.removeChild(copyFrom);
    },
    async queryInterface() {
      let result = await queryInterface()
      this.scheme = result.interface
      this.document = result.document
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.interface-detail {
  width: 300px;
  height: 400px;
  text-align: left;
}

.name {
  height: 40px;
  background: #22272e;
  line-height: 40px;
}

.name > input {
  outline: none;
  display: inline-block;
  box-sizing: border-box;
  line-height: 39px;
  width: 250px;
  border: none;
  padding: 0 10px;
  background: transparent;
  color: white;
  border-bottom: 1px solid #999;
}

.name > button {
  cursor: pointer;
  width: 50px;
  box-sizing: border-box;
  border: 1px solid #999999;
  line-height: 36px;
  float: right;
  color: white;
  background: transparent;
}

.name > button:active {
  border: 1px solid #2c3e50;
}

.detail {
  overflow-x: hidden;
  height: 360px;
}

.detail > pre {
  overflow-y: auto;
  margin: 0;
}
</style>
