<template>
      
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper :top-images="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";


import {getDetail} from "network/detail"
import {Goods} from "network/detail"

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,

  },
  data(){
      return {
          iid:null,
          topImages:[],
          goods:{},
      }
  },
  props: {},
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      console.log(res)
      const data = res.result
      this.topImages.push(...data.itemInfo.topImages) 
      // 获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
    })
   
  
  },
  methods: {},
};
</script>
 

<style  scoped>
.title{
  margin: 10px 6px; 
  font-size: 16px;
}
</style>
