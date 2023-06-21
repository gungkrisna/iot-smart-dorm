import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';


const LedIcon = ({ size, color }) => {
    return (
        <MaterialCommunityIcons name='lightbulb-outline' size={size || 28} color={color || "#212121"} />
    );
};


const DoorLockIcon = ({ size, color }) => {
        return (
        <MaterialCommunityIcons name="door" size={size || 28} color={color || "#212121"} />
    )
}

const ChevronForward = ({ size, color }) => {
    return (
        <Ionicons name="chevron-forward-outline" size={size || 24} color={color || "#212121"} />
    )
}

export { LedIcon, DoorLockIcon, ChevronForward }