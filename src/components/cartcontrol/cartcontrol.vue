<template>
  <div class="cartcontrol">
    <transition name="fade">
        <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0"
             @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food);
    },
    methods: {
      addCart(event) {
        // console.log(11);
        if(!event._constructed){
          return;
        }
        // console.log('click');
        if (!this.food.count) {
          Vue.set(this.food,'count',1);
        } else {
          this.food.count++;
        }
        // console.log(1111111)
        // console.log(event.target);
        this.$emit('add',event.target);
      },
      decreaseCart(){
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="scss">
  .cartcontrol {
    font-size: 0;
    .fade-enter-active, .fade-leave-active {
      transition: all .5s linear;
      transform: translate3D(0,0,0);
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      transform: translate3D(24px,0,0);
    }
    .cart-decrease,.cart-add {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      padding: 6px;
      color: rgb(0, 160, 220);
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147,157,159);
    }
    .cart-add {
    }
  }
</style>
