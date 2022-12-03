/* 
// 
  // 目标：聚光灯各种属性及应用


*/

// 导入dat.gui
import * as dat from "dat.gui";
const gui = new dat.GUI();

import * as THREE from "three";
import { CubeTextureLoader } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/* ----------核心开始---------- */
// 导入RGBELoader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 加载hdr图
// const rgbeLoader = new RGBELoader();
// rgbeLoader.loadAsync("textures/hdr/003.hdr").then((texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping; //纹理映射，不设置背景是张定着的图片。不会随场景转
//   scene.background = texture;
//   scene.environment = texture;
// });
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

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;
scene.add(sphere);

// // 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;

// 接收阴影
plane.receiveShadow = true;
scene.add(plane);
// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
//直线光源
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 5, 5);
spotLight.castShadow = true;

// 阴影贴图的模糊度（越大越模糊）
spotLight.shadow.radius = 20;
// .mapSize : Vector2
// 一个Vector2定义阴影贴图的宽度和高度。(越大越清楚)
spotLight.shadow.mapSize.set(4096, 4096);
// 光随着物体进行打光.target : Object3D
// 聚光灯的方向是从它的位置到目标位置.默认的目标位置为原点 (0,0,0)。
spotLight.target = sphere;
// .angle : Float
//angle - 光线散射角度，最大为Math.PI/2。 从聚光灯的位置以弧度表示聚光灯的最大范围。应该不超过 Math.PI/2 (180/2)。默认值为 Math.PI/3 (180/3)。
spotLight.angle = Math.PI / 4;
// .distance : Float
// 光源发出光的最大距离，其强度根据光源的距离进行线下衰减。 0 为不衰减
spotLight.distance = 0;
// penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
spotLight.penumbra = 0;
// decay - 沿着光照距离的衰减量。
// 在 physically correct 模式下，decay 设置为等于2将实现现实世界的光衰减。
// 缺省值为 1。
// .physicallyCorrectLights : Boolean设置渲染器在物理光照模式下
// 是否使用物理上正确的光照模式。 默认是false。 示例：lights / physical
spotLight.decay = 0;
scene.add(spotLight);

gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
gui
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI / 2)
  .step(0.1);
gui.add(spotLight, "distance").min(0).max(20).step(0.01);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
gui.add(spotLight, "decay").min(0).max(5).step(0.01);
/* ----------核心结束---------- */

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
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
