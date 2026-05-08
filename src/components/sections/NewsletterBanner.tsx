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
            <input
              type="email"
              placeholder="O seu email"
              className="flex-1 lg:w-80 px-5 py-4 bg-dark-light text-white placeholder:text-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-8 py-4 rounded-r-md font-medium hover:bg-primary/90 transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}