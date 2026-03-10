export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="container flex flex-col items-center justify-between gap-3 px-6 md:flex-row md:px-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with care by Connor Furby. Thanks for visiting.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          Software Engineering Portfolio
        </p>
      </div>
    </footer>
  )
}
