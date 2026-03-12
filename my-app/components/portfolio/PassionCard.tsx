import { useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardTitle } from "@/components/ui/card"

interface PassionCardProps {
  icon: React.ElementType
  title: string
  description: string
  imageSrc: string
}

const PassionCard: React.FC<PassionCardProps> = ({ icon: Icon, title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const isInOriginalBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      setIsHovered(isInOriginalBounds)
    }
  }

  return (
    <motion.div
      className="group relative"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "surface-card h-full rounded-[1.5rem] border-border transition-all duration-300 ease-out",
          isHovered && "absolute w-full shadow-lg"
        )}
        style={{
          transform: isHovered ? "translateY(-4px) rotateX(1.5deg)" : "translateY(0px) rotateX(0deg)",
          zIndex: isHovered ? 40 : "auto",
        }}
      >
        <CardContent className="flex h-full flex-col p-5">
          <div className={cn("transition-opacity duration-300", isHovered ? "hidden" : "block")}>
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/35 transition-transform duration-300 group-hover:scale-105">
              <Icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg text-center">{title}</CardTitle>
          </div>
          {isHovered && (
            <motion.div
              className="flex h-full flex-col items-center justify-start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="rounded-2xl object-cover"
                />
              </div>
              <CardTitle className="mb-2 text-lg">{title}</CardTitle>
              <p className="flex-grow overflow-y-auto text-center text-sm leading-7 text-muted-foreground">{description}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PassionCard