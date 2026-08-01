import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, type Group } from 'three'
import type { Product } from '../../types'
import { hexToRgb } from '../../utils/lighting'

type Props = {
  product: Product
  isOn: boolean
  brightness: number
  lightColor: string
  baseColor: string
  shadeColor: string
  metalColor: string
}

export function ProceduralLamp({
  product,
  isOn,
  brightness,
  lightColor,
  baseColor,
  shadeColor,
  metalColor,
}: Props) {
  const group = useRef<Group>(null)
  const intensity = isOn ? (brightness / 100) * 2.8 : 0
  const [lr, lg, lb] = useMemo(() => hexToRgb(lightColor.startsWith('#') ? lightColor : '#FFDCA0'), [lightColor])
  const emissiveIntensity = isOn ? 0.35 + (brightness / 100) * 1.4 : 0.02

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.05
  })

  const style = product.lampStyle

  return (
    <group ref={group} position={[0, style === 'pendant' ? 0.4 : -0.2, 0]}>
      {style === 'pendant' ? (
        <>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.55, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial
              color={shadeColor}
              roughness={0.35}
              transparent
              opacity={0.92}
              emissive={`rgb(${lr},${lg},${lb})`}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <pointLight
            position={[0, 0.7, 0]}
            intensity={intensity}
            color={lightColor}
            distance={12}
            decay={2}
          />
        </>
      ) : style === 'wall' ? (
        <>
          <mesh position={[-0.8, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.3, 0.55, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0.2, 0.25, 0]}>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial
              color={shadeColor}
              emissive={`rgb(${lr},${lg},${lb})`}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <pointLight position={[0.2, 0.25, 0.2]} intensity={intensity} color={lightColor} distance={10} />
        </>
      ) : style === 'floor' ? (
        <>
          <mesh position={[0, -1.35, 0]}>
            <cylinderGeometry args={[0.45, 0.5, 0.08, 32]} />
            <meshStandardMaterial color={baseColor} roughness={0.6} />
          </mesh>
          <mesh position={[-0.35, -0.2, 0]} rotation={[0, 0, 0.45]}>
            <torusGeometry args={[1.1, 0.035, 16, 64, Math.PI * 1.1]} />
            <meshStandardMaterial color={metalColor} metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.55, 0.85, 0]}>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial
              color={shadeColor}
              emissive={`rgb(${lr},${lg},${lb})`}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <pointLight position={[0.55, 0.85, 0]} intensity={intensity} color={lightColor} distance={14} />
        </>
      ) : (
        <>
          <mesh position={[0, -0.95, 0]}>
            <cylinderGeometry args={[0.35, 0.4, 0.06, 32]} />
            <meshStandardMaterial color={baseColor} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.15, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.45, 0.55, 32, 1, true]} />
            <meshStandardMaterial
              color={shadeColor}
              side={DoubleSide}
              roughness={0.45}
              emissive={`rgb(${lr},${lg},${lb})`}
              emissiveIntensity={emissiveIntensity * 0.8}
            />
          </mesh>
          <pointLight position={[0, 0.15, 0]} intensity={intensity} color={lightColor} distance={10} />
        </>
      )}
    </group>
  )
}
