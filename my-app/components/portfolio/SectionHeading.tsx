import { motion } from "framer-motion"

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
  const widthClass = align === "center" ? "mx-auto max-w-4xl" : "max-w-4xl"

  return (
    <motion.div
      className={`mb-8 flex flex-col gap-3 ${alignmentClass} ${widthClass}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
      <div className="flex flex-col gap-3">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{description}</p>
      </div>
    </motion.div>
  )
}
