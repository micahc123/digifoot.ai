import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DataVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(5, 2, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true });
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);
    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gradient">Data Visualization</h3>
      <div ref={mountRef} className="w-full h-96 flex items-center justify-center" />
    </div>
  );
}