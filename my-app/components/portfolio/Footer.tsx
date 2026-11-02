import Image from "next/image"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="pb-10 pt-4">
      <div className="portfolio-container-wide">
        <div className="mx-auto flex flex-col items-center justify-between gap-4 border-t border-border/60 px-2 pt-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-card">
              <Image src="/imgs/logo.png" alt="" width={16} height={16} className="size-4" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-[-0.03em]">Connor Furby</p>
              <p className="text-xs text-muted-foreground">Designed and built end to end · {year}</p>
            </div>
          </div>
          <p className="font-accent text-sm italic text-muted-foreground">Software engineering with product sense.</p>
        </div>
      </div>
    </footer>
  )
}
