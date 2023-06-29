<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const init = () => {
  //创建一个空的几何体对象
  const geometry = new THREE.BufferGeometry()

  // //类型化数组创建顶点数据
  // const vertices = new Float32Array([
  //   0,
  //   0,
  //   0, //顶点1坐标
  //   80,
  //   0,
  //   0, //顶点2坐标
  //   80,
  //   80,
  //   0, //顶点3坐标

  //   0,
  //   0,
  //   0, //顶点4坐标   和顶点1位置相同
  //   80,
  //   80,
  //   0, //顶点5坐标  和顶点3位置相同
  //   0,
  //   80,
  //   0, //顶点6坐标

  //   0,
  //   0,
  //   0, //顶点7坐标
  //   0,
  //   0,
  //   80, //顶点8坐标
  //   0,
  //   80,
  //   80, //顶点9坐标

  //   0,
  //   0,
  //   0, //顶点10坐标   和顶点7位置相同
  //   0,
  //   80,
  //   80, //顶点11坐标  和顶点9位置相同
  //   0,
  //   80,
  //   0 //顶点12坐标
  // ])

  //类型化数组创建顶点数据
  const vertices = new Float32Array([
    0,
    0,
    0, //坐标1
    100,
    0,
    0, //坐标2
    100,
    100,
    0, //坐标3
    0,
    100,
    0, //坐标4

    0,
    0,
    0, //坐标5
    0,
    0,
    100, //坐标6
    0,
    100,
    100, //坐标7
    0,
    100,
    0, //坐标8

    0,
    0,
    0, //坐标9
    100,
    0,
    0, //坐标10
    100,
    0,
    100, //坐标11
    0,
    0,
    100, //坐标12

    100,
    0,
    100,
    100,
    100,
    100,
    0,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    0,
    100,
    0,
    0
  ])
  // 创建属性缓冲区对象
  //3个为一组，表示一个顶点的xyz坐标
  const attribue = new THREE.BufferAttribute(vertices, 3)

  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue

  // 创建3D场景对象Scene
  let scene = new THREE.Scene()
  // 点渲染模式
  const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 20.0 //点对象像素尺寸
  })
  const points = new THREE.Points(geometry, material) //点模型对象

  // 线材质对象
  const materialLine = new THREE.LineBasicMaterial({
    color: 0xff0000 //线条颜色
  })
  // 创建线模型对象(闭合线条)
  const line = new THREE.LineLoop(geometry, material)

  scene.add(points)

  scene.add(line)
  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(1500)
  scene.add(axesHelper)

  const container = document.getElementById('container') as HTMLElement
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera()
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(600, 600, 600)
  //相机观察目标指向Threejs 3D空间中某个位置
  camera.lookAt(0, 0, 0) //坐标原点

  // // width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
  const width = window.innerWidth //宽度
  const height = window.innerHeight //高度
  // // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  // const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  /**
   * 创建渲染器对象
   */
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height) //设置渲染区域尺寸
  renderer.setClearColor(0x000000, 1) //设置背景颜色

  container.appendChild(renderer.domElement) //body元素中插入canvas对象
  //执行渲染操作   指定场景、相机作为参数
  renderer.render(scene, camera)

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera) //执行渲染操作
  }) //监听鼠标、键盘事件

  // onresize 事件会在窗口被调整大小时发生
  window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix()
  }
}
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped></style>
