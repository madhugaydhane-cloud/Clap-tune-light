import type { RoomType } from '../../types'

const roomPalette: Record<
  RoomType,
  { wall: string; floor: string; accent: string; furniture: string }
> = {
  'Modern Living Room': {
    wall: '#2A2622',
    floor: '#1A1714',
    accent: '#3A342E',
    furniture: '#241F1B',
  },
  'Minimal Bedroom': {
    wall: '#262428',
    floor: '#17161A',
    accent: '#353239',
    furniture: '#201E24',
  },
  'Study Room': {
    wall: '#23262A',
    floor: '#15181C',
    accent: '#30363C',
    furniture: '#1C2126',
  },
  'Reading Corner': {
    wall: '#2B241F',
    floor: '#181411',
    accent: '#3C322A',
    furniture: '#221C17',
  },
  'Dining Space': {
    wall: '#26231F',
    floor: '#161310',
    accent: '#38322C',
    furniture: '#201C18',
  },
}

type Props = {
  room: RoomType
  ambient: number
  lightColor: string
  revealed: number
}

export function VirtualRoom({ room, ambient, lightColor, revealed }: Props) {
  const palette = roomPalette[room]
  const opacity = 0.35 + revealed * 0.65

  return (
    <group>
      <ambientLight intensity={ambient} color={lightColor} />
      <hemisphereLight args={['#445566', '#110e0c', ambient * 0.6]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={palette.floor} roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.5, -6]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-6, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color={palette.accent} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      <mesh position={[6, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color={palette.accent} roughness={0.95} transparent opacity={opacity} />
      </mesh>

      {/* Minimal furniture silhouettes */}
      <mesh position={[-2.4, -0.95, -2.2]} castShadow>
        <boxGeometry args={[1.8, 0.55, 0.8]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh position={[2.2, -0.7, -1.8]} castShadow>
        <boxGeometry args={[0.9, 1.1, 0.7]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.75} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 2.4, -5.8]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.2} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}
