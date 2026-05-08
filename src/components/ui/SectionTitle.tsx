interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionTitle({ subtitle, title, description, centered = true }: SectionTitleProps) {
  return (
    <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      {subtitle && (
        <span className="text-primary font-sans text-sm uppercase tracking-wider">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-heading mt-2">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-body text-lg">{description}</p>
      )}
    </div>
  );
}