import { motion } from "framer-motion"
import AnimatedSection from "@/components/portfolio/AnimatedSection"
import { passions } from "@/components/portfolio/data"
import PassionCard from "@/components/portfolio/PassionCard"
import SectionHeading from "@/components/portfolio/SectionHeading"

export default function Passions() {
  return (
    <AnimatedSection id="passions" className="relative z-30 mb-16 pt-16" delay={0.03}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-8 h-24 bg-[radial-gradient(circle_at_center,hsl(var(--spotlight)/0.16),transparent_68%)] blur-3xl"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <SectionHeading
        eyebrow="Beyond Coding"
        title="The interests that shape how I think"
        description="The best work usually comes from more than just technical skill. These are the things that keep me curious, creative, and energized."
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {passions.map((passion) => (
          <PassionCard
            key={passion.title}
            icon={passion.icon}
            title={passion.title}
            description={passion.description}
            imageSrc={passion.imageSrc}
          />
        ))}
      </div>
    </AnimatedSection>
  )
}
