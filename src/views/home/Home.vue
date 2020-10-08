<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
      <tab-control
            @tabClick="tabClick"
            :titles="['流行', '新款', '精选']"
            ref="xtabControl"
            class="xtab-control"
            v-show="isOffsetTop"
          ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type=3
      @pullingUp="loadMore"
      :pull-up-load="true"
    >
      <div>
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
        <recommend-view :recommends="recommends"/>
        <feature-view></feature-view>
        <tab-control
          @tabClick="tabClick"
          :titles="['流行', '新款', '精选']"
          ref="tabControl"
        ></tab-control>
        <goods-list :goods="goods[currentType].list"></goods-list>
      </div>
    </scroll>
    <!-- 直接监听组件的事件 必须加.native-->
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
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeData1, getHomeGoods } from "network/home";
import {debounce} from "common/utils"

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
      // 设计数据结构 保存数据
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackClick: false,
      tabOffsetTop:0,
      isOffsetTop:false,
    };
  },
  created() {
    //1.请求多个数据 然后传送给data保存
    this.getHomeData();
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  
  },
  mounted() {
    // 图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,1)
      this.$bus.$on("itemImageLoad", () => {
        refresh()
      // 用&&来解决可能报错的函数
      // this.$refs.scroll && this.$refs.scroll.refresh();
    }) 
  },
  destroyed(){
    console.log("destroyed");
  },
  // activated(){
  //   this.$refs.scroll.scrollTo(0,this.saveY,0)
  //   this.$refs.scroll.refresh()
  // },
  // deactivated(){
  //   this.saveY = this.$refs.scroll.scroll.y
  //   console.log(this.saveY);
  // },
  methods: {
    // 事件监听相关方法
 
    swiperImageLoad(){
    // 获取tabControl的offsetTop
    // 所有组件都有一个属性$el: 用于获取组件中的元素
         this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
         console.log(this.tabOffsetTop)
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 同步两个tabCcontrol
      this.$refs.xtabControl.currentIndex = index
      this.$refs.tabControl.currentIndex = index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      // console.log(position)
      this.isShowBackClick = position.y < -1000;
      this.isOffsetTop = position.y < -this.tabOffsetTop
      // console.log(position.y < -this.tabOffsetTop)
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },

    // 网络请求方法
    getHomeData() {
      getHomeData1().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        //对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
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

  /* 使用原生浏览器滚动式需要添加的CSS */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 8; */
}
.xtab-control{
  position: relative;
  z-index: 9;
}
/* .tab-control {
  position: sticky;
  background: #ffffff;
  z-index: 8;
} */
.content {
  /* height: 300px; */
  overflow: hidden;  
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>  