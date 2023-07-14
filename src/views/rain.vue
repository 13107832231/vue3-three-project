<!--
 * @Author: XTC\QL00161 zhengjiefeng
 * @Date: 2023-05-31 10:56:23
 * @LastEditors: zhengjiefeng zhengjiefeng
 * @LastEditTime: 2023-07-05 13:59:00
 * @FilePath: \vue3-three-project\src\views\rain.vue
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

import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise' //
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
import rainImg from '@/assets/logo.png'
let camera, scene, renderer, stats, control, material

let sphere, terrain

let worldWidth = 256,
  worldDepth = 256,
  worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2

let clock = new THREE.Clock()

function init() {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 150000)
  camera.position.set(10000, 10000, 10000)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)

  createRain()

  createTerrain()

  var axesHelper = new THREE.AxesHelper(500)
  scene.add(axesHelper)
  const container = document.getElementById('container') as HTMLElement
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  stats = new Stats()
  container.appendChild(stats.dom)

  control = new OrbitControls(camera, renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)
}

//创建雨
function createRain() {
  const box = new THREE.Box3(
    new THREE.Vector3(-4000, 0, -4000),
    new THREE.Vector3(4000, 5000, 4000)
  )

  //创建雨
  material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    map: new THREE.TextureLoader().load(rainImg),
    depthWrite: false
  })

  material.onBeforeCompile = function (shader, renderer) {
    const getFoot = `
            uniform float top;
            uniform float bottom;
            uniform float time;
            #include <common>
            float angle(float x, float y){
              return atan(y, x);
            }
            vec2 getFoot(vec2 camera,vec2 normal,vec2 pos){
                vec2 position;

                float distanceLen = distance(pos, normal);

                float a = angle(camera.x - normal.x, camera.y - normal.y);

                pos.x > normal.x ? a -= 0.785 : a += 0.785; 

                position.x = cos(a) * distanceLen;
                position.y = sin(a) * distanceLen;
                
                return position + normal;
            }
            `
    const begin_vertex = `
            vec2 foot = getFoot(vec2(cameraPosition.x, cameraPosition.z),  vec2(normal.x, normal.z), vec2(position.x, position.z));
            float height = top - bottom;
            float y = normal.y - bottom - height * time;
            y = y + (y < 0.0 ? height : 0.0);
            float ratio = (1.0 - y / height) * (1.0 - y / height);
            y = height * (1.0 - ratio);
            y += bottom;
            y += position.y - normal.y;
            vec3 transformed = vec3( foot.x, y, foot.y );
            // vec3 transformed = vec3( position );
            `
    shader.vertexShader = shader.vertexShader.replace('#include <common>', getFoot)
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', begin_vertex)

    shader.uniforms.cameraPosition = {
      value: new THREE.Vector3(0, 200, 0)
    }
    shader.uniforms.top = {
      value: 5000
    }
    shader.uniforms.bottom = {
      value: 0
    }
    shader.uniforms.time = {
      value: 0
    }
    material.uniforms = shader.uniforms
  }

  var geometry = new THREE.BufferGeometry()

  const vertices = []
  const normals = []
  const uvs = []
  const indices = []

  for (let i = 0; i < 10000; i++) {
    const pos = new THREE.Vector3()
    pos.x = Math.random() * (box.max.x - box.min.x) + box.min.x
    pos.y = Math.random() * (box.max.y - box.min.y) + box.min.y
    pos.z = Math.random() * (box.max.z - box.min.z) + box.min.z

    const height = (box.max.y - box.min.y) / 15
    const width = height / 50

    vertices.push(
      pos.x + width,
      pos.y + height / 2,
      pos.z,
      pos.x - width,
      pos.y + height / 2,
      pos.z,
      pos.x - width,
      pos.y - height / 2,
      pos.z,
      pos.x + width,
      pos.y - height / 2,
      pos.z
    )

    normals.push(pos.x, pos.y, pos.z, pos.x, pos.y, pos.z, pos.x, pos.y, pos.z, pos.x, pos.y, pos.z)

    uvs.push(1, 1, 0, 1, 0, 0, 1, 0)

    indices.push(i * 4 + 0, i * 4 + 1, i * 4 + 2, i * 4 + 0, i * 4 + 2, i * 4 + 3)
  }

  // geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  // geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
  // geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))

  var mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  return mesh
}

//创建地形
function createTerrain() {
  var data = generateHeight(worldWidth, worldDepth)

  var geometry1 = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1)
  geometry1.rotateX(-Math.PI / 2)

  var vertices = geometry1.attributes.position.array

  for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * 10
  }

  let texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth))
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping

  let mesh = new THREE.Mesh(
    geometry1,
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  )
  scene.add(mesh)

  return mesh
}

//获取地形高度
function generateHeight(width, height) {
  let size = width * height
  let data = new Uint8Array(size)
  let perlin = new ImprovedNoise()
  let quality = 1
  let z = Math.random() * 100

  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < size; i++) {
      var x = i % width,
        y = ~~(i / width)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }

    quality *= 5
  }

  return data
}

//生成地形贴图
function generateTexture(data, width, height) {
  var canvas, canvasScaled, context, image, imageData, vector3, sun, shade

  vector3 = new THREE.Vector3(0, 0, 0)

  sun = new THREE.Vector3(1, 1, 1)
  sun.normalize()

  canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  context = canvas.getContext('2d')
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)

  image = context.getImageData(0, 0, canvas.width, canvas.height)
  imageData = image.data

  for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2]
    vector3.y = 2
    vector3.z = data[j - width * 2] - data[j + width * 2]
    vector3.normalize()

    shade = vector3.dot(sun)

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007)
  }

  context.putImageData(image, 0, 0)

  // Scaled 4x

  canvasScaled = document.createElement('canvas')
  canvasScaled.width = width * 4
  canvasScaled.height = height * 4

  context = canvasScaled.getContext('2d')
  context.scale(4, 4)
  context.drawImage(canvas, 0, 0)

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
  imageData = image.data

  for (var i = 0, l = imageData.length; i < l; i += 4) {
    var v = ~~(Math.random() * 5)

    imageData[i] += v
    imageData[i + 1] += v
    imageData[i + 2] += v
  }

  context.putImageData(image, 0, 0)

  return canvasScaled
}

function onWindowResize() {
  let windowHalfX = window.innerWidth / 2
  let windowHalfY = window.innerHeight / 2

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

//
function animate() {
  requestAnimationFrame(animate)

  render()
  stats.update()
}

var time = 0
function render() {
  time = (time + clock.getDelta() * 0.4) % 1

  material.cameraPosition = camera.position

  if (material.uniforms) {
    material.uniforms.cameraPosition.value = camera.position
    material.uniforms.time.value = time
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})
</script>
