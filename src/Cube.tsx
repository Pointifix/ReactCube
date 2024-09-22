import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import './Cube.css';
import Inputs from './Inputs';

const Cube: React.FC = () => {
    const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
    const cubeRef = useRef<THREE.Mesh | null>(null);
    const rotationDirectionRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
    const colorRef = useRef<string>("#ffffff");
    const mouseDownRef = useRef<boolean>(false);

    const rotationSpeedMultiplier: number = 0.02;

    useEffect(() => {
        if (!canvasWrapperRef.current) return;

        const currentCanvasWrapper = canvasWrapperRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentCanvasWrapper.clientWidth / currentCanvasWrapper.clientHeight,
            0.5,
            10
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(currentCanvasWrapper.clientWidth, currentCanvasWrapper.clientHeight);
        currentCanvasWrapper.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({color: colorRef.current});
        cubeRef.current = new THREE.Mesh(geometry, material);
        scene.add(cubeRef.current);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
        directionalLight.position.set(3, 2, 1);
        directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(directionalLight);

        camera.position.set(2, 2, 2);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const animate = () => {
            requestAnimationFrame(animate);

            if (cubeRef.current) {
                cubeRef.current.rotation.x += rotationDirectionRef.current.x * rotationSpeedMultiplier;
                cubeRef.current.rotation.y += rotationDirectionRef.current.y * rotationSpeedMultiplier;
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const {clientWidth, clientHeight} = currentCanvasWrapper;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (currentCanvasWrapper) {
                currentCanvasWrapper.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', handleResize);
        };
    });

    const handleColorChange = (newColor: string) => {
        if (!cubeRef.current) return;

        colorRef.current = newColor;
        (cubeRef.current.material as THREE.MeshStandardMaterial).color.set(colorRef.current);
    };

    const handleRotationDirectionChange = (newRotationDirection: { axis: "x" | "y", speed: number }) => {
        rotationDirectionRef.current[newRotationDirection.axis] = newRotationDirection.speed;
    };

    const handleMouseDown = () => {
        mouseDownRef.current = true;
    };
    const handleMouseUp = () => {
        mouseDownRef.current = false;
        rotationDirectionRef.current.set(0, 0);
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (mouseDownRef.current) {
            // x/y are flipped here because of the coordinate system difference between screen and world space
            rotationDirectionRef.current.x = e.movementY * rotationSpeedMultiplier * 2;
            rotationDirectionRef.current.y = e.movementX * rotationSpeedMultiplier * 2;
        }
    };

    return (
        <div>
            <div id="canvasWrapper"
                 ref={canvasWrapperRef}
                 onMouseDown={handleMouseDown}
                 onMouseUp={handleMouseUp}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={handleMouseUp}
            />
            <Inputs
                color={colorRef.current}
                onColorChange={handleColorChange}
                onRotationDirectionChange={handleRotationDirectionChange}
            />
        </div>
    );
};

export default Cube;