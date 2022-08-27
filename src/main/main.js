import * as THREE from "three";
import { Clock, MeshToonMaterial } from "three";
// 导入动画库
import gsap from "gsap";
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
// 物品
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 设置物品的位置
// cube.position.set(5, 0, 0);
// cube.position.x = 4;
// 物品的缩放
// cube.scale.set(2, 1, 1);
// cube.scale.x = 4;
// 物品的旋转
// 直接设置旋转属性，例如围绕x轴旋转90度
// cube.rotation.x = -Math.PI / 4;

// 围绕x轴旋转45度
// cube.rotation.set(-Math.PI / 4, 0, 0, "XZY");
scene.add(cube);
// 渲染
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//创建坐  标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
//创建控制器，让三维图形动起来
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;
// 设置动画
var animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  //   设置重复的次数，无限次循环-1
  repeat: -1,
  //   往返运动
  yoyo: true,
  //   delay，延迟2秒运动
  delay: 2,
  onComplete: () => {
    console.log("动画完成");
  },
  onStart: () => {
    console.log("动画开始");
  },
});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "power1.inOut" });

// window.addEventListener("dblclick", () => {
//   //   console.log(animate1);
//   if (animate1.isActive()) {
//     //   暂停
//     animate1.pause();
//   } else {
//     //   恢复
//     animate1.resume();
//   }
// });
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //   双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //   退出全屏，使用document对象
    document.exitFullscreen();
  }
  //   console.log(fullScreenElement);
});
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
const clock = new THREE.Clock();
function render() {
  // function render(time) {
  // time :DOMHighResTimeStamp指示当前被 requestAnimationFrame() 排序的回调函数被触发的时间。
  // cube.position.x += 0.01;
  // cube.rotation.x += 0.01;
  // if (cube.position.x > 5) {
  //   cube.position.x = 0;
  // }
  // let time = clock.getElapsedTime();
  // // 1表示以1m/s速度移动
  // // cube.position.x = ((time / 1000) % 5) * 1;
  // cube.position.x = (time % 5) * 1;
  controls.update();
  renderer.render(scene, camera);

  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
