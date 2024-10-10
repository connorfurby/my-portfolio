import React, { useEffect, useCallback} from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Image from "next/image"
import { Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from 'embla-carousel-react'

type FullscreenModalProps = {
  isOpen: boolean
  onClose: () => void
  images: { src: string; alt: string; description: string; isVideo?: boolean }[]
  initialIndex: number // Add this new prop
}

export function FullscreenModal({ isOpen, onClose, images, initialIndex }: FullscreenModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: initialIndex }) // Set initial index

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!isOpen || !emblaApi) return

    const interval = setInterval(scrollNext, 10000)

    return () => clearInterval(interval)
  }, [isOpen, emblaApi, scrollNext])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 flex flex-col">
        <Carousel className="w-full flex-grow" ref={emblaRef}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative w-full rounded-lg overflow-hidden" style={{ height: "calc(80vh - 100px)" }}>
                    {image.isVideo ? (
                      <video
                        src={image.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-center text-sm">{image.description}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 space-x-2">
            <CarouselPrevious />
            <Button variant="outline" size="icon" onClick={onClose} className="h-8 w-8">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <CarouselNext />
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}