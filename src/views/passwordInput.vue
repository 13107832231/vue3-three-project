<!--
 * @Author: XTC\QL00161 zhengjiefeng
 * @Date: 2023-05-31 10:56:23
 * @LastEditors: XTC\QL00161 zhengjiefeng
 * @LastEditTime: 2023-06-02 16:52:07
 * @FilePath: \vue3-three-project\src\views\AboutView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <h2>验证码输入框</h2>
    <div class="code-box">
      <div
        class="item"
        v-for="(item, index) in setting.defaultLength"
        :class="{
          'active-code': setting.inputValue.toString().length === index && setting.inputFocus
        }"
        :key="index"
      >
        {{ setting.inputValue.toString().substr(index, 1) }}
      </div>
    </div>

    <input
      v-model="setting.inputValue"
      class="input"
      type="number"
      :maxlength="setting.defaultLength"
      :oninput="inputOninput"
      autofocus
      v-on:focus="handleFocus"
      v-on:blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
interface Setting {
  defaultLength: number
  isFocus: boolean
  inputValue: string
  inputFocus: boolean
}
const setting: Setting = reactive({
  defaultLength: 6,
  isFocus: true,
  inputValue: '',
  inputFocus: true
})


// 控制input输入的长度
const inputOninput = (e: any) => {
  let value = e.target.value

  if (value.length > setting.defaultLength) {
    e.target.value = value.slice(0, setting.defaultLength)
  }
}
const handleFocus = () => {
  setting.inputFocus = true
}
const handleBlur = () => {
  setting.inputFocus = false
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  text-align: center;

  margin: 0 auto;
  .code-box {
    z-index: 999;
    width: 80%;
    padding-top: 50px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    .item {
      width: 40px;
      height: 40px;
      border: 1px solid #aaa;
      border-radius: 5px;
      font-size: 18px;
      text-align: center;
      line-height: 40px;
      &.active-code {
        border-color: aqua;
        position: relative;
        &::after {
          content: '';
          width: 1px;
          height: 15px;

          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #313131;
          animation: 1s animate infinite;
        }
      }
    }
  }
  @keyframes animate {
    100% {
      opacity: 0;
    }
  }
  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
</style>
