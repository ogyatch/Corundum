import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.6, 0.3, 2.4);
camera.lookAt(0, 0, 0);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 正八面体のジオメトリを作成
const geometry = new THREE.OctahedronGeometry();

// 各面にグラデーションを適用するための頂点カラーを設定
const colors = [];
const color1 = new THREE.Color(0xff0000); // 赤
const color2 = new THREE.Color(0x800080); // 紫

// 各面に対してグラデーションを設定
for (let i = 0; i < geometry.attributes.position.count; i += 3) {
    colors.push(color1.r, color1.g, color1.b); // 頂点1の色
    colors.push(color2.r, color2.g, color2.b); // 頂点2の色
    colors.push(color1.r, color1.g, color1.b); // 頂点3の色
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// マテリアルの作成
const material = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.DoubleSide });

// メッシュの作成
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

// ライトの追加
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// レンダリング関数
function render() {
    renderer.render(scene, camera);
}

// 初期レンダリング
render();

// ウィンドウのリサイズ対応
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
});
