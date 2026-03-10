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
    <Card className="surface-card mb-8 overflow-hidden rounded-[2rem] border-border bg-card pt-0 xl:max-h-[calc(100vh-10rem)]">
      <CardHeader className="gap-3 pb-5 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em]">
                Featured Project
              </Badge>
              {project.stack?.slice(0, 3).map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full border border-border bg-card px-3 py-1">
                  {item}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-2xl tracking-tight xl:text-[1.75rem]">{project.title}</CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6">
              {project.description}
            </CardDescription>
          </div>

          {project.spotlight ? (
            <div className="max-w-sm rounded-2xl border border-border bg-muted/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Why it stands out
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{project.spotlight}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:overflow-hidden">
        <div className="rounded-[1.5rem] border border-border bg-muted/35 p-4 xl:max-h-[calc(100vh-18rem)] xl:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Key Contributions</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.images.length} media items
            </span>
          </div>
          <ul className="flex list-disc flex-col gap-2.5 pl-5 text-sm leading-6 text-muted-foreground">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-4 xl:flex xl:max-h-[calc(100vh-18rem)] xl:flex-col">
          <Carousel
            className="mx-auto w-full xl:flex xl:h-full xl:flex-col"
            opts={{ loop: true }}
            setApi={(api) => {
              if (api) {
                onApiReady(project.title, api)
              }
            }}
          >
            <CarouselContent className="xl:flex-1">
              {project.images.map((image, imageIndex) => (
                <CarouselItem key={`${project.title}-${imageIndex}`}>
                  <div className="p-1 xl:h-full">
                    <Card className="overflow-hidden rounded-[1.5rem] border-border bg-muted/25 xl:h-full">
                      <CardContent className="p-3">
                        <AspectRatio ratio={16 / 9} className="bg-muted">
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
                                  sizes="(max-width: 768px) 100vw, 60vw"
                                  className="z-10 object-contain"
                                />
                              </>
                            )}
                          </div>
                        </AspectRatio>
                        <p className="mt-3 text-center text-sm text-muted-foreground">{image.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-4 flex justify-center gap-2">
              <CarouselPrevious />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenFullscreen(project)}
                className="rounded-full"
              >
                <Expand className="h-4 w-4" />
              </Button>
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  )
}
