<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"  :pull-up-load="true" @pullingUp="loadMore"> 
      <div>
      <home-swiper :banners="banners" />
      <recommend-view :recommends="recommends" />
      <feature-view></feature-view>
      <tab-control @tabClick="tabClick" class="tab-control" :titles="['流行','新款','精选']"></tab-control>  
      <goods-list :goods="goods[currentType].list"></goods-list>
      </div>
    </scroll>
     <back-top @click.native="backClick" v-show="isShowBackClick"></back-top>
  
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import TabControl from "components/content/tabControl/TabControl";
import NavBar from "components/common/navbar/NavBar";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll"
import BackTop from "components/content/backTop/BackTop"


import { getHomeData, getHomeGoods } from "network/home";

export default {
  name: "Home",
  components: {
    Scroll,
    BackTop,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    NavBar,
    GoodsList,
      
  },

  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType:'pop',
      isShowBackClick:false,
    };
  },
  created() {
    //1.请求多个数据 然后传送给data保存
    this.getHomeData();
    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  methods: {
    // 事件监听方法
    tabClick(index){
      switch(index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
    },
    contentScroll(position){
      console.log(position)
        this.isShowBackClick=position.y<-1000
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    
    // 网络请求方法
    getHomeData() {
      getHomeData().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list)  
        this.goods[type].page += 1  
        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px;  */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: white;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 8;
}
.tab-control {
  position: sticky;
  top: 44px;
  background: #ffffff;
  z-index: 8;
   
}
 .content{
   /* height: 300px;*/
   /* overflow: hidden;   */
   position: absolute;
   top: 44px;
   bottom: 49px;
   left: 0;  
   right: 0;
 }
</style>  