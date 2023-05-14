import * as THREE from 'three'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { Euler, Vector3, Color, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export interface BoxProps {
    props?: ThreeElements['mesh']
    rotation: THREE.Euler,
    // color?: Color,
    position?: Vector3, 
}

export const Box = ({
    props,
    rotation,
    // color
    position,
}: BoxProps) => {

    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)    
    
    // Import the 'DeskCube' object from the 'public' folder
    const obj = useLoader(OBJLoader, '/deskcube_obj.obj')
    
    // Define a 'Bounding Box' to re-position/move
    // the pivot to the center of the 'DeskCube' object
    const boundingBox = new THREE.Box3().setFromObject(obj);
    const boxSize = boundingBox.getSize(new THREE.Vector3());

    // Define the 'position' of the 'DeskCube' object, only
    // when no 'position' was given as parameter of the component
    position = position ? position : new THREE.Vector3(boxSize.x * - 0.5, boxSize.y * - 0.5, boxSize.z * - 0.5)

    // Define a 'Frame' doing the same when the object is updated
    useFrame((state, delta) => {
        ref.current.position.x = boxSize.x * - 0.5;
        ref.current.position.y = boxSize.y * - 0.5;
        ref.current.position.z = boxSize.z * - 0.5;
    })

    // Define a 'Frame' for when the 'Rotation' 
    // of the 'DeskCube' object is updated
    useFrame((state, delta) => {
        if(rotation){
            ref.current.setRotationFromEuler(rotation)
        }
    })

    return (
        <mesh
            {...props}
            // rotation={rotation}
            position={position}
            ref={ref}
            // scale={clicked ? 1.5 : 1}
            // onClick={(event) => click(!clicked)}
            // onPointerOver={(event) => hover(true)}
            // onPointerOut={(event) => hover(false)}>
        >
            <primitive object={obj} scale={1}/>
            {/* <meshStandardMaterial color={'hotpink'} /> */}
            {/* <boxGeometry args={[1, 1, 1]} /> */}
            {/* <meshStandardMaterial color={color ? color : 'cyan'} /> */}
            {/* <meshStandardMaterial color={'hotpink'} /> */}
        </mesh>
    )
}