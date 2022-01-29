<template>
  <div id="app">
    <loading v-if="isLoading"/>
    <div v-else>
      <api-main v-if="isSupport"/>
      <div v-else class="tip-msg">{{ tipMessage }}</div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import {detectYApi} from "@/channel";
import ApiMain from "@/ApiMain";

export default {
  name: 'App',
  components: {
    ApiMain,
    Loading
  },
  computed: {
    isSupport() {
      return this.isYApiDetail
    },
    tipMessage() {
      if (!this.isYApi) {
        return "this is not YApi page"
      }
      if (!this.isYApiDetail) {
        return "this is not YApi detail page"
      }
      return ""
    }
  },
  data() {
    return {
      isLoading: true,
      isYApi: false,
      isYApiDetail: false
    }
  },
  async created() {
    await this.checkYApi()
  },
  methods: {
    async checkYApi() {
      this.isLoading = true
      let result = await detectYApi()
      this.isYApi = result.isYApi
      this.isYApiDetail = result.isYApiDetail
      this.isLoading = false
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.tip-msg {
  width: 200px;
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
}

body {
  margin: 0;
}
</style>
