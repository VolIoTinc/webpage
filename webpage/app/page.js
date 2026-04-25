export default function Home() {
  const displayName = process.env.NEXT_PUBLIC_DISPLAY_NAME;
  const tagline = process.env.NEXT_PUBLIC_TAGLINE;
  const location = process.env.NEXT_PUBLIC_LOCATION;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center flex-grow flex flex-col justify-center">
        <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-6">
          Coming soon
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
          {displayName}
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-10">
          {tagline}
        </p>
        {location && (
          <div className="inline-block border-t border-white/30 pt-6 mx-auto">
            <p className="text-white/80">Based in {location}</p>
          </div>
        )}
      </div>
      <footer className="mt-16 text-xs text-white/50 tracking-wide">
        Empowered by{" "}
        <a
          href="https://voliotinc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          VolIoT
        </a>
      </footer>
    </main>
  );
}
