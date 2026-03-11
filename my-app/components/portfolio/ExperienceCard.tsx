"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Expand, Sparkles } from "lucide-react"

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
    <Card className="liquid-panel liquid-panel-strong mb-4 overflow-hidden rounded-[1.75rem] pt-0 xl:flex xl:h-[calc(100vh-14rem)] xl:min-h-[31rem] xl:max-h-[calc(100vh-14rem)] xl:flex-col">
      <CardHeader className="gap-2 pb-2 pt-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-[32rem] flex-col gap-1.5">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em]">
                Featured Project
              </Badge>
              {project.stack?.slice(0, 4).map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full px-3 py-1">
                  {item}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-[1.4rem] tracking-tight xl:text-[1.38rem]">{project.title}</CardTitle>
            <CardDescription className="max-w-[30rem] text-sm leading-[1.25rem]">
              {project.description}
            </CardDescription>
          </div>

          {project.spotlight ? (
            <div className="liquid-panel liquid-soft w-full max-w-none rounded-[1.1rem] p-2.5 sm:max-w-[15rem]">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Why it stands out
              </div>
              <p className="text-sm leading-[1.2rem] text-muted-foreground">{project.spotlight}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid flex-1 gap-3 px-4 pb-4 xl:min-h-0 xl:grid-cols-[minmax(240px,0.82fr)_minmax(0,1.18fr)] xl:overflow-hidden">
        <div className="liquid-panel liquid-soft flex min-h-0 flex-col rounded-[1.25rem] p-3 xl:pr-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Key Contributions</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.images.length} media items
            </span>
          </div>
          <ul className="flex min-h-0 list-disc flex-col gap-1.5 overflow-visible pl-5 pr-1 text-sm leading-[1.35rem] text-muted-foreground xl:overflow-y-auto">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="liquid-panel flex min-h-0 flex-col rounded-[1.25rem] p-2">
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
              className="relative min-h-[15rem] flex-1 overflow-hidden rounded-[1.15rem] border border-border/55 bg-muted/70 sm:min-h-[17rem] dark:bg-muted/55"
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
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${image.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(24px)",
                            opacity: image.isVideo ? 0.12 : 0.24,
                            transform: "scale(1.08)",
                          }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,22,0.04),rgba(6,10,22,0.18))]" />

                        <div className="absolute inset-4 flex items-center justify-center">
                          {image.isVideo ? (
                            <video
                              src={image.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="max-h-full max-w-full rounded-[1rem] object-contain shadow-[0_18px_46px_rgba(0,0,0,0.24)]"
                            />
                          ) : (
                            <div className="relative h-full w-full">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 42vw"
                                className="object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.22)]"
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
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 border-border/55 bg-background/88 backdrop-blur-xl sm:left-3"
              />
              <CarouselNext
                data-carousel-next="true"
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 border-border/55 bg-background/88 backdrop-blur-xl sm:right-3"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenFullscreen(project)}
                className="absolute right-3 top-3 z-20 rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <div className="min-w-0 flex-1 text-center text-[11px] leading-[1rem] text-muted-foreground">
                {activeImage?.description}
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {activeImageIndex + 1}/{project.images.length}
              </span>
            </div>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  )
}
