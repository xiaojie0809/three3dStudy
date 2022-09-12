/* 
// 目标： hrd格式的环境贴图及背景

*/

import * as THREE from "three";
import { CubeTextureLoader } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/* ----------核心开始---------- */
// 导入RGBELoader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 加载hdr图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("textures/hdr/003.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; //纹理映射，不设置背景是张定着的图片。不会随场景转
  scene.background = texture;
  scene.environment = texture;
});
/* ----------核心end---------- */

// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10); // 相机的位置
scene.add(camera);

const sphereGeometry = new THREE.SphereGeometry(1, 100, 100);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.01,
});
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// // 给cube添加第二组uv
// cubeGeometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
// );

/* ----------核心结束---------- */

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
