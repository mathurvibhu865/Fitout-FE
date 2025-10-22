import React from 'react';

interface Step {
  id: number | string;
  title: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  activeSteps: number[]; // Supports multiple active steps
  onStepClick?: (updatedSteps: number[]) => void; // Passes updated array
  color?: string;
  className?: string;
}

const Stepper = ({
  steps,
  activeSteps,
  onStepClick,
  color = '#C8C8C8',
  className = '',
}: StepperProps) => {
  // Toggle logic: add if not present, remove if already active
  const handleStepClick = (index: number) => {
    if (!onStepClick) return;

    const isActive = activeSteps.includes(index);
    const updatedSteps = isActive
      ? activeSteps.filter((i) => i !== index)
      : [...activeSteps, index];

    onStepClick(updatedSteps);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Static background line */}
      <div
        className="absolute h-5 bg-[#F1EDED] top-1/2 -translate-y-1/2 z-0 rounded-full"
        style={{
          left: '3.5%',
          right: '20.1%',
        }}
      />

      {/* Step elements */}
      <div
        className="grid relative z-10"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          paddingLeft: '0%',
          paddingRight: '0%',
        }}
      >
        {steps.map((step, index) => {
          const isActive = activeSteps.includes(index);
          const StepElement = onStepClick ? 'button' : 'div';

          return (
            <div key={step.id} className="relative h-32">
              {/* Step circle */}
              <StepElement
                type="button"
                className={`w-4 h-4 rounded-full flex items-center justify-center absolute top-1/2 shadow-md transition-all duration-300 ${
                  onStepClick ? 'cursor-pointer' : ''
                }`}
                style={{
                  left: '60%',
                  transform: 'translate(-935%, -50%)',
                  backgroundColor: isActive ? color : '#D1D5DB',
                  boxShadow: isActive ? `0 0 0 2px ${color}` : undefined,
                }}
                onClick={() => handleStepClick(index)}
              />

              {/* Icon & Title */}
              <div
                className="absolute flex flex-col items-center"
                style={{
                  top: '60%',
                  left: '16%',
                  transform: 'translate(-50%, 0%)',
                }}
              >
                {step.icon && (
                  <div className={`mt-1 ${isActive ? '' : 'opacity-50'}`}>
                    {step.icon}
                  </div>
                )}
                <span
                  className={`text-sm font-medium text-center ${
                    isActive ? 'font-semibold' : 'text-gray-500'
                  }`}
                  style={isActive ? { color } : undefined}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
