/* 
  目标：生成酷炫三角形科技物

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
// 物品 -生成50个随机顶点的三角形

for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(9);
  // 三个顶点，一个顶点3个向量 每个三角形9个随机数
  for (let j = 0; j < 9; j++) {
    vertices[j] = Math.random() * 10 - 5; //-5~5之间的随机数
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  // 随机颜色
  let color = new THREE.Color(Math.random(), Math.random(), Math.random()); 
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
  });
  // 根据集合体和材质创建物品
  const mesh = new THREE.Mesh(geometry, material);
  console.log(mesh);
  scene.add(mesh);
}

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
