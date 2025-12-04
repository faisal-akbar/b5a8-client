import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileStatsCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    index?: number
}

export function ProfileStatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    index = 0,
}: ProfileStatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="border-slate-200 transition-all hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
                            {description && (
                                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                            )}
                            {trend && (
                                <div className="mt-2 flex items-center gap-1">
                                    <span
                                        className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {trend.isPositive ? "+" : "-"}
                                        {Math.abs(trend.value)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">from last month</span>
                                </div>
                            )}
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
