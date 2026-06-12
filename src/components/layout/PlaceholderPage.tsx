type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold text-white">{title}</h1>
      <p className="mt-4 font-body text-[#849495]">Hello World</p>
    </div>
  );
}
