'use client'

import { useEffect, useState } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_ESTIMATION_PARAMS, EstimationParams } from '@/lib/types'
import { generatePlanId } from '@/lib/utils'
import PlannerStepper from '@/components/planner/PlannerStepper'
import Step1Land from '@/components/planner/Step1Land'
import Step2Location from '@/components/planner/Step2Location'
import Step3PlantationType from '@/components/planner/Step3PlantationType'
import Step4PlantLibrary from '@/components/planner/Step4PlantLibrary'
import Step5FarmDesign from '@/components/planner/Step5FarmDesign'
import Step6Calculations from '@/components/planner/Step6Calculations'
import Step7Summary from '@/components/planner/Step7Summary'
import Step8Quote from '@/components/planner/Step8Quote'
import { generatePDF } from '@/lib/pdfGenerator'
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'

export default function PlannerPage() {
  const {
    currentStep, nextStep, prevStep, setCurrentStep,
    landAcres, selectedState, selectedDistrict, selectedTypeIds, selectedPlants,
    setEstimationParams, setPlanId, planId, calculations,
  } = usePlannerStore()

  const [pdfLoading, setPdfLoading] = useState(false)

  // Load estimation settings from Supabase on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('estimation_settings')
      .select('key, value')
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const params: Partial<EstimationParams> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((row: any) => {
          if (row.key in DEFAULT_ESTIMATION_PARAMS) {
            params[row.key as keyof EstimationParams] = row.value?.amount ?? row.value
          }
        })
        setEstimationParams({ ...DEFAULT_ESTIMATION_PARAMS, ...params })
      })
  }, [setEstimationParams])

  // Generate plan ID if not yet set
  useEffect(() => {
    if (!planId && currentStep >= 7) {
      setPlanId(generatePlanId())
    }
  }, [currentStep, planId, setPlanId])

  // Validation per step
  const canProceed = (): boolean => {
    if (currentStep === 1) return landAcres >= 0.5
    if (currentStep === 2) return !!selectedState && !!selectedDistrict
    if (currentStep === 3) return selectedTypeIds.length > 0
    if (currentStep === 4) return selectedPlants.length > 0 && calculations.allocationValid
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    nextStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleBack = () => {
    prevStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDownloadPDF = async () => {
    if (!planId) setPlanId(generatePlanId())
    setPdfLoading(true)
    try {
      await generatePDF(usePlannerStore.getState())
    } finally {
      setPdfLoading(false)
    }
  }

  const validationMessage = () => {
    if (currentStep === 1 && !canProceed()) return 'Please enter a valid land size (min 0.5 acres)'
    if (currentStep === 2 && !canProceed()) return 'Please select State and District'
    if (currentStep === 3 && !canProceed()) return 'Please select at least one plantation type'
    if (currentStep === 4 && selectedPlants.length === 0) return 'Please add at least one plant'
    if (currentStep === 4 && !calculations.allocationValid) return 'Plant allocations must total 100%'
    return null
  }

  const stepComponent = () => {
    switch (currentStep) {
      case 1: return <Step1Land />
      case 2: return <Step2Location />
      case 3: return <Step3PlantationType />
      case 4: return <Step4PlantLibrary />
      case 5: return <Step5FarmDesign />
      case 6: return <Step6Calculations />
      case 7: return <Step7Summary />
      case 8: return <Step8Quote />
      default: return <Step1Land />
    }
  }

  const validMsg = validationMessage()

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      <PlannerStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step content */}
        <div className="min-h-[500px]">
          {stepComponent()}
        </div>

        {/* Navigation buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-forest-700 hover:text-forest-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col items-center gap-2">
            {validMsg && (
              <p className="text-amber-600 text-sm font-medium">{validMsg}</p>
            )}
            <p className="text-gray-400 text-sm">Step {currentStep} of 8</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Download PDF button visible from step 6+ */}
            {currentStep >= 6 && (
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-forest-700 text-forest-700 font-semibold hover:bg-forest-50 transition-all disabled:opacity-50"
              >
                {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {pdfLoading ? 'Generating…' : 'Download PDF'}
              </button>
            )}

            {currentStep < 8 && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? 'Visualize Farm' : currentStep === 7 ? 'Request Quote' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
