import clsx from "clsx";

type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
  /**
   * `dark` = live `.pm-process-step` on `.section-dark-modern` (white number and heading). `light` = live `.process-step-modern` on investment's `.bg-light`: a
   * rgba(255,255,255,.05) number, 2px gold left border, #0a0a0a heading, #666 copy.
   */
  tone?: "dark" | "light";
};

export default function ProcessStep({ number, title, description, tone = "dark" }: ProcessStepProps) {
  if (tone === "light") {
    return (
      <div className="relative mb-[60px] flex last:mb-0">
        <span
          aria-hidden="true"
          className="absolute -left-5 -top-5 z-0 text-[4rem] font-black leading-none text-white/5"
        >
          {number}
        </span>
        <div className="relative z-[1] border-l-2 border-primary-gold pl-5">
          <h4 className="text-2xl font-bold text-dark-black">{title}</h4>
          <p className="mt-2.5 text-muted">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 flex items-start gap-5">
      <span aria-hidden="true" className="text-6xl font-black leading-[0.8] text-white">
        {number}
      </span>
      <div className="pt-2">
        <h4 className={clsx("text-xl font-bold text-white")}>{title}</h4>
        <p className="mt-2 text-white/70">{description}</p>
      </div>
    </div>
  );
}
