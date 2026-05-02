import { View, Text, Switch } from 'react-native'
import { COLORS } from '@/src/constant'

interface ToggleProps {
  label: string
  description?: string
  value: boolean
  onValueChange: (v: boolean) => void
}

const Toggle = ({ label, description, value, onValueChange }: ToggleProps) => (
  <View className="flex-row items-center justify-between py-3">
    <View className="flex-1 mr-4">
      <Text className="text-zinc-100 font-medium">{label}</Text>
      {description && <Text className="text-zinc-500 text-sm mt-0.5">{description}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.iconDim, true: COLORS.brand }}
      thumbColor={COLORS.white}
    />
  </View>
)

export default Toggle
