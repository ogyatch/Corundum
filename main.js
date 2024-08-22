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

// 各面に対して隣接する面で似た色を共有するように設定
const colors = [];
for (let i = 0; i < geometry.attributes.position.count; i += 3) {
    if (i % 9 === 0) {
        // 一つの面
        colors.push(color1.r, color1.g, color1.b);
        colors.push(color2.r, color2.g, color2.b);
        colors.push(color3.r, color3.g, color3.b);
    } else {
        // 隣接する面
        colors.push(color3.r, color3.g, color3.b);
        colors.push(color4.r, color4.g, color4.b);
        colors.push(color1.r, color1.g, color1.b);
    }
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// 影のないマテリアルを使用
const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

// メッシュの作成
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

// ライトの追加は不要、影をつけないため

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
