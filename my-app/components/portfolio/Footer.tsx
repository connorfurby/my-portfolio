export default function Footer() {
  return (
    <footer className="py-6">
      <div className="container px-6 md:px-8">
        <div className="liquid-panel mx-auto flex flex-col items-center justify-between gap-3 rounded-[1.8rem] px-6 py-5 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with care by Connor Furby. Thanks for visiting.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          Software Engineering Portfolio
        </p>
        </div>
      </div>
    </footer>
  )
}
