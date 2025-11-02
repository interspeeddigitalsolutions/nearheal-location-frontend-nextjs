export const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl mx-auto text-center lg:mx-0 lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 leading-snug">
              Find your local experts near you
            </h1>
            <a
              href="/listing"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              Get Started
            </a>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1713942589752-6c6bb58ca8b6?auto=format&fit=crop&w=800"
              alt="Healthcare Professional"
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
