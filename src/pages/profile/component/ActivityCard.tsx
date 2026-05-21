import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion";
import clsx from "clsx";

const ActivityCard = ({icon, count, label, borderColorOnHover, iconStyle}: {icon: LucideIcon, count: number, label: string, borderColorOnHover: string, iconStyle: string}) => {

    const Icon = icon;

    return (
        <motion.div whileHover={{y: 3}} transition={{duration: 0.2}} className={clsx("flex items-center gap-3 p-6 border border-border rounded-radius-xl shadow", borderColorOnHover)}>
            <div className={clsx("p-3 rounded-radius", iconStyle)}><Icon size={24} /></div>

            <div className="space-y-1">
                <h4 className="text-2xl">{count}</h4>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </motion.div>
    )
}

export default ActivityCard;