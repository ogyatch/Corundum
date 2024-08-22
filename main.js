import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2, 0.2, -0.5);
camera.lookAt(0, 0, 0);

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

// 各頂点に色を設定し、色のブレンドを強化して境界線が目立たないように調整
for (let i = 0; i < geometry.attributes.position.count; i++) {
    const faceIndex = Math.floor(i / 9); // 1つの面ごとに3頂点
    const color = facesColors[faceIndex % facesColors.length][i % 3];
    
    // 隣接する色とブレンドすることで、境界線を目立たなくする
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

// カメラの更新関数
function updateCameraPosition() {
    let x = parseFloat(document.getElementById('x').value);
    let y = parseFloat(document.getElementById('y').value);
    let z = parseFloat(document.getElementById('z').value);

    const scaleFactor = 2.4 / z; // 2.4 は初期のZ座標値。これに基づいてスケールを調整します。
    
    x *= scaleFactor;
    y *= scaleFactor;
    z = 2.4; // Zを固定

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    render(); // カメラ位置を更新後に再描画
}

// ランダムなカメラ位置を生成し、サイズ感が許容範囲内かチェックする関数
function generateRandomCameraPosition() {
    let acceptable = false;

    while (!acceptable) {
        const randomX = (Math.random() * 4 - 2).toFixed(1); // -2 から 2 の範囲
        const randomY = (Math.random() * 4 - 2).toFixed(1); // -2 から 2 の範囲
        const randomZ = (Math.random() * 2 + 1.2).toFixed(1); // 1.2 から 3.2 の範囲
        
        const testScaleFactor = 2.4 / parseFloat(randomZ);

        // スケールファクターが1に近い場合にのみ、許容とする
        if (testScaleFactor >= 0.9 && testScaleFactor <= 1.1) {
            document.getElementById('x').value = randomX;
            document.getElementById('y').value = randomY;
            document.getElementById('z').value = randomZ;
            acceptable = true; // 許容範囲内ならループを抜ける
        }
    }

    updateCameraPosition(); // 新しいカメラ位置で再描画
}

// Generateボタンのイベントリスナー
document.getElementById('generateRandom').addEventListener('click', generateRandomCameraPosition);

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
