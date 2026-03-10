import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description: string
  align?: "left" | "center"
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignmentClass = align === "center" ? "items-center text-center" : "items-start text-left"
  const widthClass = align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"

  return (
    <motion.div
      className={`mb-8 flex flex-col gap-3 ${alignmentClass} ${widthClass}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, x: align === "center" ? 0 : -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Badge variant="outline" className="rounded-full border-border bg-background/85 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.22em] backdrop-blur-sm">
            {eyebrow}
          </Badge>
        </motion.div>
      ) : null}
      <div className="flex flex-col gap-3">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}
