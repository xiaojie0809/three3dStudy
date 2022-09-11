/* 
// 目标： 纹理加载进度 
1. 单张纹理的加载进度 
  .load ( url : String, onLoad : Function, onProgress : Function, onError : Function )
2. 整体加载进度-设置加载管理器
   LoadingManager
   LoadingManager( onLoad : Function, onProgress : Function, onError : Function )
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
let event = {};
event.onLoad = function () {
  console.log("图片加载完成");
};

event.onProgress = function (url, num, total) {
  console.log("图片加载完成:", url);
  console.log("图片加载进度:", num);
  console.log("图片总数:", total);
  let value = ((num / total) * 100).toFixed(2) + "%";
  console.log("加载进度的百分比：", value);
};
event.onError = function (e) {
  console.log("图片加载出现错误");
  console.log(e);
};
// 设置加载管理器
let loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);

const textureLoader = new THREE.TextureLoader(loadingManager);
// 单张纹理图的加载
const doorColorteTure = textureLoader.load(
  "textures/door/color.jpg"
  // event.onLoad,
  // undefined, // 暂不支持onProgress的回调
  // event.onError
);
const doorAlphateTure = textureLoader.load("./textures/door/alpha.jpg");

const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);

//导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("./textures/door/normal.jpg");
// 物品

const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);

const standardMaterial = new THREE.MeshStandardMaterial({
  map: doorColorteTure,
  // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
  // 黑色完全透明。白色完全不透明
  // alpha.jpg门的区域白色，其他区域黑色，实现只给门的区域贴纹理
  alphaMap: doorAlphateTure,
  transparent: true,
  // opacity: 0.6,
  // 定义要渲染哪一面，正面FontSide 背面 BackSide或者两者DoubleSide
  side: THREE.DoubleSide,
  // .aoMap : Texture
  // 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  displacementScale: 0.05, //影响程度
  roughness: 1,
  roughnessMap: roughnessTexture,
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
});

const cube = new THREE.Mesh(cubeGeometry, standardMaterial);
scene.add(cube);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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
