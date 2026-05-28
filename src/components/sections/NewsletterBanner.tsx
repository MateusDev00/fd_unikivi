export function NewsletterBanner() {
  return (
    <section className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-4">
            <span className="font-serif text-3xl text-white font-bold">
              FD<span className="text-primary">UNIKIVI</span>
            </span>
            <span className="text-white/80 hidden sm:inline">|</span>
            <h3 className="font-serif text-2xl text-white">Inscreva-se agora</h3>
          </div>
          <div className="flex w-full lg:w-auto">
          </div>
        </div>
      </div>
    </section>
  );
}