'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Land' },
  { n: 2, label: 'Location' },
  { n: 3, label: 'Type' },
  { n: 4, label: 'Plants' },
  { n: 5, label: 'Design' },
  { n: 6, label: 'Calculate' },
  { n: 7, label: 'Summary' },
  { n: 8, label: 'Quote' },
]

interface Props {
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function PlannerStepper({ currentStep, onStepClick }: Props) {
  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center">
          {STEPS.map((step, idx) => {
            const done = currentStep > step.n
            const active = currentStep === step.n
            return (
              <div key={step.n} className="flex items-center flex-1 min-w-0">
                {/* Step circle */}
                <button
                  onClick={() => done && onStepClick?.(step.n)}
                  disabled={!done}
                  className={cn(
                    'flex flex-col items-center gap-1 shrink-0',
                    done ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                      done
                        ? 'bg-forest-700 border-forest-700 text-white'
                        : active
                          ? 'bg-white border-forest-700 text-forest-700'
                          : 'bg-white border-gray-200 text-gray-400'
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : step.n}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium hidden sm:block whitespace-nowrap',
                      active ? 'text-forest-700' : done ? 'text-forest-600' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-1 transition-colors',
                      done ? 'bg-forest-700' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
