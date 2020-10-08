<template>
    <div class="detail-swiper">
     <swiper class="dswiper">
      <swiper-item v-for="item in topImages" :key="item.id">
        <img :src="item">
      </swiper-item>
    </swiper>
    </div>
</template>

<script>    
//轮播图index.js 统一导入{}
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
    name:"DetailSwiper",
 
    components: {
        Swiper,
        SwiperItem,

    },
    props: {
        topImages:{
            type:Array,
            default(){
                return []
            }
        }

    },
    methods: {

    },
};
</script>

<style  scoped>
.dswiper{
    height: 300px;
    overflow: hidden;
}

</style>
