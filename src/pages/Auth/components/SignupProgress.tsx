import { motion } from "framer-motion";
import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";

interface SignupProgressProps {
  currentStep: number;
  steps: string[];
}

const SignupProgress = ({ currentStep, steps }: SignupProgressProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Steps Circles + Labels */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={label || `step-${index}`}
              className="relative flex flex-col items-center w-full z-0"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute top-2/6 left-1/2 w-full h-[2px] bg-border z-10">
                  <motion.div
                    className="h-[2px] bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
              {/* Steps Circle */}
              <div className="absolute flex items-center justify-center z-20">
                <div
                  className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center font transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary scale-115"
                      : isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground border-2 border-border"
                  )}
                >
                  {isActive ? (
                    stepNumber
                  ) : isCompleted ? (
                    <CheckCircle2 />
                  ) : (
                    stepNumber
                  )}
                </div>
              </div>
              {/* Step label */}
              <p
                className={clsx(
                  "mt-15 text-xs font-medium",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mt-8 bg-muted h-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default SignupProgress;
