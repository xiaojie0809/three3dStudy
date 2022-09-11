/* 
// 目标：标准网格材质MeshStandardMaterial
   灯光- 环境光，直线光
  位置贴图：用于突出层级 灰白黑 白色最高，黑色最低
*/

import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

/* ----------核心开始---------- */
const textureLoader = new THREE.TextureLoader();
const doorColorteTure = textureLoader.load("textures/door/color.jpg");
const doorAlphateTure = textureLoader.load("./textures/door/alpha.jpg");

const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);

/* ----------核心1开始---------- */
//导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
/* ----------核心1 end---------- */
// 物品

/* ----------核心2开始---------- */
/* 
需要设置集合体的分段数，高度贴图才能生效
widthSegments — （可选）宽度的分段数，默认值是1。
heightSegments — （可选）高度的分段数，默认值是1。
depthSegments — （可选）深度的分段数，默认值是1。
*/
// const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
/* ----------核心2 end---------- */
const standardMaterial = new THREE.MeshStandardMaterial({
  map: doorColorteTure,
  // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
  // 黑色完全透明。白色完全不透明
  // alpha.jpg门的区域白色，其他区域黑色，实现只给门的区域贴纹理
  alphaMap: doorAlphateTure,
  transparent: true,
  opacity: 0.6,
  // 定义要渲染哪一面，正面FontSide 背面 BackSide或者两者DoubleSide
  side: THREE.DoubleSide,
  // .aoMap : Texture
  // 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  /* ----------核心3 start--------- */
  displacementMap: doorHeightTexture,
  displacementScale: 0.05, //影响程度
  /* ----------核心3 end---------- */
});

const cube = new THREE.Mesh(cubeGeometry, standardMaterial);
scene.add(cube);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(light);
//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

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
