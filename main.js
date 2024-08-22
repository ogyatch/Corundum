import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 正八面体（Octahedron）のジオメトリを作成
const geometry = new THREE.OctahedronGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

// レンダリング関数
function render() {
    renderer.render(scene, camera);
}

function updateCameraPosition() {
    const x = parseFloat(document.getElementById('x').value);
    const y = parseFloat(document.getElementById('y').value);
    const z = parseFloat(document.getElementById('z').value);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    render();
}

document.getElementById('updateCamera').addEventListener('click', updateCameraPosition);

// 初期レンダリング
render();

// ウィンドウのリサイズ対応
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
});
