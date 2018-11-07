<template>
  <div id="goods">
      <div class="goods">
        <div class="menu-wrapper" ref="menu-wrapper">
          <ul>
            <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
            @click="selectMenu(index)">
              <span class="text border-1px">
                <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
              </span>
            </li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foods-wrapper">
          <ul>
            <li v-for="item in goods" class="food-list food-list-hook">
              <h1 class="title">{{item.name}}</h1>
              <ul>
                <li @click="selectFood(food)" v-for="food in item.foods" class="food-item border-1px">
                  <div class="icon">
                    <img width="57" height="57" :src="food.icon">
                  </div>
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <v-cartcontrol :food="food" @add="_drop"></v-cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <v-shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
      </div>
      <v-food :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from '@/components/shopcart/shopcart';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import food from '@/components/food/food';
  import Vue from 'vue';
  const ERR_OK = 0;
  var Event = new Vue();
  export default {
    data() {
      return {
        goods: [],
        listHeight:[],
        scrollY:0,
        selectedFood:{}
      }
    },
    props: {
      seller: Object
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(response);
          // console.log(this.goods);

          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      })
    },
    components:{
      'v-shopcart':shopcart,
      'v-cartcontrol':cartcontrol,
      'v-food':food
    },
    computed:{
      currentIndex(){
        for(let i=0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
            // console.log(i);
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good)=>{
          good.foods.forEach((food)=>{
            if(food.count){
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    // events:{
    //   'cart.add'(target){
    //     console.log(9);
    //     this._drop(target);
    //   }
    // },
    methods: {
      selectFood(food){
        // if(!event._constructed){
        //   return;
        // }
        this.selectedFood = food;
        this.$refs['food'].show();
      },
      _drop(target){
        // console.log('---------------');
        // console.log(target);
        this.$refs.shopcart.drop(target);
      },
      _initScroll() {
        // console.log(this.$refs['menu-wrapper']);
        this.meunScroll = new BScroll(this.$refs['menu-wrapper'], {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
          click:true,
          probeType:3
        });
        this.foodsScroll.on('scroll',(pos)=>{
          this.scrollY = Math.abs(Math.round(pos.y));
          // console.log(this.scrollY);
        });
      },
      _calculateHeight(){
          let foodList = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
          // console.log(foodList);
          let height = 0;
          this.listHeight.push(height);
          for(let i=0;i<foodList.length;i++){
            let item = foodList[i];
            height+=item.clientHeight;
            this.listHeight.push(height);
          }
          // console.log(this.listHeight);
      },
      selectMenu(index){
        // console.log(index);
        let foodList = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
        let ref =foodList[index];
        this.foodsScroll.scrollToElement(ref,300);
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/sass/mixin";

  .goods {
    display: flex;
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    overflow: hidden;
    .menu-wrapper {
      touch-action: none;
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current{
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          font-weight: 700;
          .text{
            @include border-none();
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3')
          }
          &.special {
            @include bg-image('special_3')
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 12px;
          @include border-1px(rgba(7, 17, 27, 0.1));
        }
      }
    }
    .foods-wrapper {
      touch-action: none;
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc, .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            line-height: 12px;
            margin-bottom: 8px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 18px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
