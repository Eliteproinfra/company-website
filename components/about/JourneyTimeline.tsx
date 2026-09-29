import Reveal from "@/components/ui/Reveal";

type JourneyStep = {
  year: string;
  title: string;
  description: string;
};

export default function JourneyTimeline({ steps }: { steps: JourneyStep[] }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute top-0 bottom-0 left-1/2 hidden w-[2px] -translate-x-1/2 bg-primary-gold md:block" />

      <div className="space-y-10 md:space-y-14">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;
          const card = (
            <div className="relative rounded-md bg-white p-6 shadow-[0_5px_15px_rgba(0,0,0,0.1)] sm:p-8">
              <h3 className="text-xl font-bold text-dark-black">{step.title}</h3>
              <p className="mt-2 text-muted">{step.description}</p>
              <span className="absolute right-6 bottom-0 left-6 h-1 rounded-full bg-primary-gold" />
            </div>
          );

          return (
            <Reveal
              key={step.year}
              direction={isEven ? "left" : "right"}
              className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-8"
            >
              {isEven ? card : <div className="hidden md:block" />}

              <span className="relative z-10 mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-primary-gold bg-white text-sm font-bold text-primary-gold">
                {step.year}
              </span>

              {isEven ? <div className="hidden md:block" /> : card}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
