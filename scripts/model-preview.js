import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const mount = document.querySelector('[data-model-stage]');

if (mount) {
    initModel(mount).catch(() => {
        mount.textContent = 'Model preview unavailable.';
        mount.classList.add('model-stage--error');
    });
}

async function initModel(target) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const idleSpin = prefersReducedMotion ? 0 : 0.7;
    const dragSensitivity = 0.014;
    const maxFlickVelocity = 24;
    let spinVelocityX = 0;
    let spinVelocityY = idleSpin;
    let activePointerId = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let isDragging = false;

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    target.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff4e7, 0x9d736c, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(3.8, 5, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc98680, 1.4);
    fillLight.position.set(-4, 2.2, 3);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const texture = await textureLoader.loadAsync('enhanced-yeen/textures/yeb_base_color_1024.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0,
        transparent: true,
        alphaTest: 0.03,
        side: THREE.DoubleSide
    });

    const model = await loader.loadAsync('enhanced-yeen/source/ybeb.fbx');

    model.traverse((child) => {
        if (!child.isMesh) return;
        child.material = material;
        child.frustumCulled = false;
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;

    model.position.copy(center).multiplyScalar(-1);
    group.scale.setScalar(2.6 / maxAxis);
    group.add(model);

    camera.position.set(0, 0.18, 5.3);
    camera.lookAt(0, 0.05, 0);
    group.rotation.set(0.02, -0.35, 0);

    function stopDrag() {
        if (activePointerId !== null && target.hasPointerCapture(activePointerId)) {
            target.releasePointerCapture(activePointerId);
        }

        isDragging = false;
        activePointerId = null;
        target.classList.remove('model-stage--grabbing');
    }

    function applyDragPoint(x, y, time) {
        const elapsed = Math.max((time - lastPointerTime) / 1000, 0.001);
        const deltaX = x - lastPointerX;
        const deltaY = y - lastPointerY;

        if (deltaX === 0 && deltaY === 0) return;

        group.rotation.y += deltaX * dragSensitivity;
        group.rotation.x += deltaY * dragSensitivity;

        spinVelocityY = THREE.MathUtils.clamp((deltaX * dragSensitivity) / elapsed, -maxFlickVelocity, maxFlickVelocity);
        spinVelocityX = THREE.MathUtils.clamp((deltaY * dragSensitivity) / elapsed, -maxFlickVelocity, maxFlickVelocity);
        lastPointerX = x;
        lastPointerY = y;
        lastPointerTime = time;
    }

    target.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        activePointerId = event.pointerId;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        lastPointerTime = event.timeStamp;
        isDragging = true;
        spinVelocityX = 0;
        spinVelocityY = 0;
        target.setPointerCapture(activePointerId);
        target.classList.add('model-stage--grabbing');
    });

    target.addEventListener('pointermove', (event) => {
        if (!isDragging || event.pointerId !== activePointerId) return;
        event.preventDefault();

        const points = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];

        for (const point of points) {
            applyDragPoint(point.clientX, point.clientY, point.timeStamp || event.timeStamp);
        }
    });

    target.addEventListener('pointerup', (event) => {
        if (isDragging && event.pointerId === activePointerId) {
            applyDragPoint(event.clientX, event.clientY, event.timeStamp);
        }

        stopDrag();
    });
    target.addEventListener('pointercancel', stopDrag);
    target.addEventListener('lostpointercapture', () => {
        isDragging = false;
        activePointerId = null;
        target.classList.remove('model-stage--grabbing');
    });

    function resize() {
        const width = target.clientWidth;
        const height = target.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }

    function render() {
        const delta = clock.getDelta();

        if (!isDragging) {
            group.rotation.x += spinVelocityX * delta;
            group.rotation.y += spinVelocityY * delta;
            spinVelocityX = THREE.MathUtils.damp(spinVelocityX, 0, 1.15, delta);
            spinVelocityY = THREE.MathUtils.damp(spinVelocityY, idleSpin, 1.05, delta);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(target);
    resize();
    render();
}
