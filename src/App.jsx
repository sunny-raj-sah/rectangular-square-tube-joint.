import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TubeSettingsPanel from './components/TubeSettingsPanel'
import * as THREE from 'three'

function roundAngle(angle, snapAngles = [0, 45, 90, 135, 180]) {
  let closest = snapAngles.reduce((prev, curr) =>
    Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
  )
  return closest
}

function Tube({ tube, isSelected, onSelect, updateTube }) {
  const meshRef = useRef()
  const { camera, raycaster, gl } = useThree()
  const [dragging, setDragging] = useState(false)

  // Drag handler using raycasting on ground plane Y=0
  useEffect(() => {
    if (!isSelected) return

    const onPointerDown = (e) => {
      e.stopPropagation()
      setDragging(true)
      gl.domElement.style.cursor = 'grabbing'
    }
    const onPointerUp = (e) => {
      e.stopPropagation()
      setDragging(false)
      gl.domElement.style.cursor = 'auto'
    }
    const onPointerMove = (event) => {
      if (!dragging) return
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      const mouseVector = new THREE.Vector2(x, y)
      raycaster.setFromCamera(mouseVector, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const intersection = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersection)
      if (intersection) {
        updateTube(tube.id, [intersection.x, tube.position[1], intersection.z].reduce((acc, val, i) => {
          if (i === 0) acc.position[0] = val
          else if (i === 2) acc.position[2] = val
          return acc
        }, { ...tube }))
        // or simpler
        updateTube(tube.id, { position: [intersection.x, tube.position[1], intersection.z] })
      }
    }

    const el = gl.domElement
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointermove', onPointerMove)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointermove', onPointerMove)
    }
  }, [dragging, gl.domElement, raycaster, camera, tube, updateTube, isSelected])

  return (
    <mesh
      ref={meshRef}
      position={tube.position}
      rotation={[
        (Math.PI / 180) * roundAngle((tube.rotation[0] * 180) / Math.PI),
        (Math.PI / 180) * roundAngle((tube.rotation[1] * 180) / Math.PI),
        (Math.PI / 180) * roundAngle((tube.rotation[2] * 180) / Math.PI),
      ]}
      onClick={() => onSelect(tube.id)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[tube.width, tube.height, tube.length]} />
      <meshStandardMaterial
        color={isSelected ? 'orange' : 'gray'}
        wireframe={tube.wireframe || false}
        opacity={tube.isJointHighlighted ? 0.5 : 1}
        transparent={tube.isJointHighlighted}
      />
    </mesh>
  )
}

export default function App() {
  const [tubes, setTubes] = useState([
    {
      id: 1,
      type: 'Square',
      width: 1,
      height: 1,
      thickness: 0.1,
      length: 3,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      wireframe: false,
      isJointHighlighted: false,
    },
  ])

  const [selectedTubeId, setSelectedTubeId] = useState(1)

  // Update tube props
  const updateTube = (id, newProps) => {
    setTubes((prev) =>
      prev.map((tube) => (tube.id === id ? { ...tube, ...newProps } : tube))
    )
  }

  // Add tube
  const addTube = () => {
    const newTube = {
      id: tubes.length + 1,
      type: 'Square',
      width: 1,
      height: 1,
      thickness: 0.1,
      length: 3,
      position: [2, 0, 0],
      rotation: [0, 0, 0],
      wireframe: false,
      isJointHighlighted: false,
    }
    setTubes((prev) => [...prev, newTube])
    setSelectedTubeId(newTube.id)
  }

  // Wireframe toggle
  const toggleWireframe = () => {
    setTubes((prev) =>
      prev.map((tube) => ({ ...tube, wireframe: !tube.wireframe }))
    )
  }

  // Simple bounding box collision detection for joint highlights
  useEffect(() => {
    const updated = tubes.map((tube) => ({ ...tube, isJointHighlighted: false }))
    for (let i = 0; i < tubes.length; i++) {
      for (let j = i + 1; j < tubes.length; j++) {
        const aBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...tubes[i].position),
          new THREE.Vector3(tubes[i].width, tubes[i].height, tubes[i].length)
        )
        const bBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...tubes[j].position),
          new THREE.Vector3(tubes[j].width, tubes[j].height, tubes[j].length)
        )
        if (aBox.intersectsBox(bBox)) {
          updated[i].isJointHighlighted = true
          updated[j].isJointHighlighted = true
        }
      }
    }
    setTubes(updated)
  }, [tubes])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <TubeSettingsPanel
        tube={tubes.find((t) => t.id === selectedTubeId)}
        updateTube={updateTube}
        addTube={addTube}
        toggleWireframe={toggleWireframe}
      />
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ flexGrow: 1 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {tubes.map((tube) => (
          <Tube
            key={tube.id}
            tube={tube}
            isSelected={tube.id === selectedTubeId}
            onSelect={setSelectedTubeId}
            updateTube={updateTube}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  )
}
