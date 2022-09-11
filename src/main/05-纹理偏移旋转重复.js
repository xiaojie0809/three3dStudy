/* 
  目标：纹理的偏移，旋转，重复
 05-纹理偏移旋转重复
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
const texture = new THREE.TextureLoader().load("textures/color.jpg");
console.log(texture);
// 偏移  0.0 to 1.0.
// texture.offset.x = 0.5;
//  texture.offset.y = 0.5;
texture.offset.set(0.5, 0.5);
// 旋转 45deg (旋转中心点。(0.5, 0.5)对应纹理的正中心。默认值为(0,0)，即左下角。)
// texture.rotation = Math.PI / 4;
// texture.center.set(0.5, 0.5);

// 重复
texture.repeat.set(2, 3); // x轴重复两次，y轴重复3次
texture.wrapS = THREE.MirroredRepeatWrapping; // x轴镜像重复
texture.wrapT = THREE.RepeatWrapping; // Y轴简单重复

// 物品
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  map: texture,
});

const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube);

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
