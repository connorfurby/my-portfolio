"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { Project } from "@/components/portfolio/types"

type ExperienceCardProps = {
  project: Project
  onApiReady: (title: string, api: CarouselApi) => void
  onOpenFullscreen: (project: Project) => void
}

export default function ExperienceCard({
  project,
  onApiReady,
  onOpenFullscreen,
}: ExperienceCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const syncIndex = () => {
      setActiveImageIndex(carouselApi.selectedScrollSnap())
    }

    syncIndex()
    carouselApi.on("select", syncIndex)
    carouselApi.on("reInit", syncIndex)

    return () => {
      carouselApi.off("select", syncIndex)
      carouselApi.off("reInit", syncIndex)
    }
  }, [carouselApi])

  const activeImage = project.images[activeImageIndex] ?? project.images[0]

  return (
    <Card className="mb-4 overflow-hidden rounded-2xl xl:flex xl:h-[calc(100vh-14rem)] xl:min-h-[31rem] xl:max-h-[calc(100vh-14rem)] xl:flex-col">
      <CardHeader className="gap-3 border-b border-border/50 pb-4 pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-[40rem] flex-col gap-2.5">
            <div className="flex flex-wrap gap-1.5">
              {project.stack?.slice(0, 4).map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
            <CardTitle className="font-display text-[1.5rem] tracking-[-0.03em] xl:text-[1.65rem]">{project.title}</CardTitle>
            <CardDescription className="max-w-[34rem] text-sm leading-6">{project.description}</CardDescription>
          </div>

          {project.spotlight ? (
            <div className="w-full max-w-none border-l-2 border-primary/50 pl-4 sm:max-w-[16rem]">
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Why it stands out
              </div>
              <p className="text-sm leading-6 text-foreground/85">{project.spotlight}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid flex-1 gap-4 px-5 py-5 xl:min-h-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)] xl:overflow-hidden">
        <div className="flex min-h-0 flex-col order-2 xl:order-1">
          <Carousel
            className="mx-auto flex w-full min-h-0 flex-1 flex-col"
            opts={{ loop: true }}
            setApi={(api) => {
              if (api) {
                onApiReady(project.title, api)
                setCarouselApi((current) => (current === api ? current : api))
              }
            }}
          >
            <div
              className="relative min-h-[16rem] flex-1 overflow-hidden rounded-xl border border-border/70 bg-[radial-gradient(circle_at_50%_40%,hsl(var(--foreground)/0.05),transparent_55%),hsl(var(--muted)/0.35)] sm:min-h-[18rem]"
              tabIndex={0}
              aria-label={`${project.title} media viewer. Use left and right arrow keys to change slides.`}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault()
                  carouselApi?.scrollPrev()
                }

                if (event.key === "ArrowRight") {
                  event.preventDefault()
                  carouselApi?.scrollNext()
                }
              }}
            >
              <div className="h-full [&>div]:h-full [&>div>div]:h-full">
                <CarouselContent className="-ml-0 h-full min-h-0 flex-1">
                  {project.images.map((image, imageIndex) => (
                    <CarouselItem key={`${project.title}-${imageIndex}`} className="h-full pl-0">
                      <div className="relative h-full">
                        <div className="absolute inset-3 flex items-center justify-center sm:inset-4">
                          {image.isVideo ? (
                            <video
                              src={image.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="max-h-full max-w-full rounded-lg object-contain shadow-[0_18px_50px_hsl(var(--background)/0.45)]"
                            />
                          ) : (
                            <div className="relative h-full w-full">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 48vw"
                                className="object-contain drop-shadow-[0_16px_40px_hsl(var(--background)/0.4)]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>

              <CarouselPrevious
                data-carousel-prev="true"
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 border-border/70 bg-card/90 sm:left-3"
              />
              <CarouselNext
                data-carousel-next="true"
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 border-border/70 bg-card/90 sm:right-3"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenFullscreen(project)}
                className="absolute right-3 top-3 z-20 border-border/70 bg-card/90"
                aria-label="Expand media"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3 px-0.5">
              <div className="min-w-0 flex-1 text-[11px] leading-4 text-muted-foreground">
                {activeImage?.description}
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-wider text-muted-foreground">
                {String(activeImageIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
              </span>
            </div>
          </Carousel>
        </div>

        <div className="flex min-h-0 flex-col order-1 xl:order-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold tracking-tight">Key Contributions</span>
            <span className="text-[11px] text-muted-foreground">{project.images.length} media</span>
          </div>
          <ul className="flex min-h-0 flex-col gap-0 overflow-visible xl:overflow-y-auto">
            {project.bullets.map((bullet, index) => (
              <li
                key={bullet}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border/50 py-3 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
              >
                <span className="pt-0.5 font-mono text-[10px] tracking-wider text-primary/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
