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
// 背景色を白に設定
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// 正八面体のジオメトリを作成
const geometry = new THREE.OctahedronGeometry();

// グラデーション用のカラーを設定
const color1 = new THREE.Color(0xDF0522); // 赤
const color2 = new THREE.Color(0xbc4e9c); // 紫
const color3 = new THREE.Color(0xff6384); // 淡いピンク
const color4 = new THREE.Color(0xe60073); // 濃いピンク

// 各面が自然に繋がるように、頂点カラーを設定
const colors = [];
const vertexColors = [
    color1, color2, color3,
    color3, color4, color1,
    color2, color3, color4,
    color4, color1, color2
];

for (let i = 0; i < geometry.attributes.position.count; i++) {
    const color = vertexColors[i % vertexColors.length];
    colors.push(color.r, color.g, color.b);
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// 影のないマテリアルを使用し、ワイヤーフレームを無効化
const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

// メッシュの作成
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

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
