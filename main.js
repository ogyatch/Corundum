import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const initialDistance = 5; // カメラの初期距離を一定に保つ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, initialDistance);
camera.lookAt(0, 0, 0); // 中心点を向く

// レンダラーの作成
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 背景色を白に設定
document.body.appendChild(renderer.domElement);

// 正八面体のジオメトリを作成
const geometry = new THREE.OctahedronGeometry();

// グラデーション用のカラーを設定
const color1 = new THREE.Color(0xDF0522); // 赤
const color2 = new THREE.Color(0xbc4e9c); // 紫
const color3 = new THREE.Color(0xff6384); // 淡いピンク
const color4 = new THREE.Color(0xe60073); // 濃いピンク

// 頂点ごとに適切な色を設定し、特に中央の四角形部分の境界線を目立たなくする
const colors = [];
const facesColors = [
    [color1, color2, color3],
    [color2, color3, color4],
    [color3, color4, color1],
    [color4, color1, color2],
    [color2, color1, color4],
    [color1, color3, color4],
    [color3, color2, color4],
    [color4, color3, color2]
];

// 各頂点に色を設定し、色のブレンドを強化して境界線が目立たなくする
for (let i = 0; i < geometry.attributes.position.count; i++) {
    const faceIndex = Math.floor(i / 9); // 1つの面ごとに3頂点
    const color = facesColors[faceIndex % facesColors.length][i % 3];
    
    // 隣接する色とブレンドすることで、境界線が目立たなくする
    const blendedColor = new THREE.Color(
        (color.r + facesColors[(faceIndex + 1) % facesColors.length][i % 3].r) / 2,
        (color.g + facesColors[(faceIndex + 1) % facesColors.length][i % 3].g) / 2,
        (color.b + facesColors[(faceIndex + 1) % facesColors.length][i % 3].b) / 2
    );
    colors.push(blendedColor.r, blendedColor.g, blendedColor.b);
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// マテリアルの作成
const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

// メッシュの作成
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

// 文字列をハッシュに変換し、それを方向にマッピングする関数
function stringToDirection(inputString) {
    // シンプルなハッシュ関数を使用
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }

    // ハッシュから方向ベクトルを計算
    let x = ((hash >> 16) & 0xff) / 255.0 * 2 - 1; // -1から1の範囲
    let y = ((hash >> 8) & 0xff) / 255.0 * 2 - 1;
    let z = (hash & 0xff) / 255.0 * 2 - 1;

    // ベクトルの正規化
    const length = Math.sqrt(x * x + y * y + z * z);
    x /= length;
    y /= length;
    z /= length;

    return { x, y, z };
}

// カメラの更新関数
function updateCameraPosition() {
    const inputString = document.getElementById('inputString').value;
    const direction = stringToDirection(inputString);

    // 一定の距離を保ちながらカメラの位置を設定
    camera.position.set(
        direction.x * initialDistance,
        direction.y * initialDistance,
        direction.z * initialDistance
    );
    camera.lookAt(0, 0, 0); // 常に中心点を向く

    render(); // カメラ位置を更新後に再描画
}

// イベントリスナーを設定
document.getElementById('updateCamera').addEventListener('click', updateCameraPosition);

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
