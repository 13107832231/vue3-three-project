<!--
 * @Author: XTC\QL00161 zhengjiefeng
 * @Date: 2023-05-31 10:56:23
 * @LastEditors: XTC\QL00161 zhengjiefeng
 * @LastEditTime: 2023-06-29 16:35:31
 * @FilePath: \vue3-three-project\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'

// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'

const init1 = () => {
  // 创建3D场景对象Scene
  let scene = new THREE.Scene()
  //创建一个长方体几何对象Geometry
  let geometry = new THREE.BoxGeometry(200, 100, 50)
  //创建一个材质对象Material
  let material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, //设置材质颜色
    transparent: true, //开启透明
    opacity: 0.5 //设置透明度
  })
  // 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  //设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh.position.set(0, 0, 0)

  scene.add(mesh)
  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(1500)
  scene.add(axesHelper)

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight(0xffffff, 1.0)

  //点光源位置
  pointLight.position.set(0, 150, 150) //点光源放在x轴上

  scene.add(pointLight)

  // 光源辅助观察
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)

  scene.add(pointLightHelper)

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(80, 100, 50)
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  directionalLight.target = mesh
  scene.add(directionalLight)
  // DirectionalLightHelper：可视化平行光
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10, 0xffff00)
  // 对比不同入射角，mesh表面对光照的反射效果
  // directionalLight.position.set(100, 0, 0)
  // directionalLight.position.set(0, 100, 0)
  // directionalLight.position.set(100, 100, 100)
  // directionalLight.position.set(100, 60, 50)
  //directionalLight.target默认指向坐标原点
  scene.add(dirLightHelper)

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

  //创建stats对象
  const stats = new Stats()
  //stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.domElement)

  // 动画渲染函数
  function render() {
    //   设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行
    stats.update()
    renderer.render(scene, camera) //执行渲染操作
    mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
    requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  }
  render()

  // // 动画渲染循环
  // const clock = new THREE.Clock()
  // function render() {

  //   const spt = clock.getDelta() * 1000 //毫秒
  //   console.log('两帧渲染时间间隔(毫秒)', spt)
  //   console.log('帧率FPS', 1000 / spt)
  //   renderer.render(scene, camera) //执行渲染操作
  //   mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
  //   requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  // }
  // render()

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
  init1()
})
</script>
