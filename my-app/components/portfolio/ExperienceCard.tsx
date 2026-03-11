"use client"

import Image from "next/image"
import { Expand, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
  return (
    <Card className="liquid-panel liquid-panel-strong mb-4 overflow-hidden rounded-[1.75rem] pt-0 xl:h-[calc(100vh-14rem)] xl:min-h-[31rem] xl:max-h-[calc(100vh-14rem)]">
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
            <div className="liquid-panel liquid-soft max-w-[15rem] rounded-[1.1rem] p-2.5">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Why it stands out
              </div>
              <p className="text-sm leading-[1.2rem] text-muted-foreground">{project.spotlight}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid flex-1 gap-3 px-4 pb-4 xl:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)] xl:overflow-hidden">
        <div className="liquid-panel liquid-soft rounded-[1.25rem] p-3 xl:min-h-0 xl:overflow-y-auto xl:pr-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Key Contributions</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.images.length} media items
            </span>
          </div>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-[1.2rem] text-muted-foreground">
            {project.bullets.slice(0, 3).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="liquid-panel rounded-[1.25rem] p-2 xl:flex xl:min-h-0 xl:flex-col">
          <Carousel
            className="mx-auto w-full xl:flex xl:h-full xl:min-h-0 xl:flex-col"
            opts={{ loop: true }}
            setApi={(api) => {
              if (api) {
                onApiReady(project.title, api)
              }
            }}
          >
            <div className="relative xl:min-h-0 xl:flex-1">
              <CarouselContent className="xl:min-h-0 xl:flex-1">
                {project.images.map((image, imageIndex) => (
                  <CarouselItem key={`${project.title}-${imageIndex}`}>
                    <div className="p-0.5 xl:h-full">
                      <Card className="liquid-panel liquid-soft overflow-hidden rounded-[1.15rem] xl:h-full">
                        <CardContent className="p-1.5">
                          <AspectRatio
                            ratio={16 / 9}
                            className="bg-muted xl:max-h-[min(27vh,15rem)]"
                            tabIndex={0}
                            aria-label={`${project.title} media viewer. Use left and right arrow keys to change slides.`}
                            onKeyDown={(event) => {
                              if (event.key === "ArrowLeft") {
                                event.preventDefault()
                                const previousButton = event.currentTarget
                                  .closest("[role='region']")
                                  ?.querySelector<HTMLButtonElement>("[data-carousel-prev='true']")
                                previousButton?.click()
                              }

                              if (event.key === "ArrowRight") {
                                event.preventDefault()
                                const nextButton = event.currentTarget
                                  .closest("[role='region']")
                                  ?.querySelector<HTMLButtonElement>("[data-carousel-next='true']")
                                nextButton?.click()
                              }
                            }}
                          >
                            <div className="relative h-full w-full">
                              {image.isVideo ? (
                                <video
                                  src={image.src}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <>
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundImage: `url(${image.src})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      filter: "blur(12px)",
                                      opacity: 0.22,
                                    }}
                                  />
                                  <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 42vw"
                                    className="z-10 object-contain"
                                  />
                                </>
                              )}
                            </div>
                          </AspectRatio>
                          <p className="mt-1 text-center text-[11px] leading-[1rem] text-muted-foreground">{image.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                data-carousel-prev="true"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 border-white/12 bg-background/70 backdrop-blur-xl"
              />
              <CarouselNext
                data-carousel-next="true"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 border-white/12 bg-background/70 backdrop-blur-xl"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenFullscreen(project)}
                className="absolute bottom-3 right-3 z-20 rounded-full border-white/12 bg-background/70 backdrop-blur-xl"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex justify-center text-[11px] text-muted-foreground">
              Focus the media and use left/right arrow keys.
            </div>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  )
}
