type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="mb-10 flex items-start gap-5">
      <span aria-hidden="true" className="text-6xl font-black leading-none text-white/5">
        {number}
      </span>
      <div className="pt-2">
        <h4 className="text-xl font-bold text-white">{title}</h4>
        <p className="mt-2 text-white/60">{description}</p>
      </div>
    </div>
  );
}
