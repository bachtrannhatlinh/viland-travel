import { create } from 'zustand'

export interface MultiStepFormState {
  stepData: Record<number, any>
  currentStep: number
  setStepData: (step: number, data: any) => void
  setCurrentStep: (step: number) => void
  reset: () => void
}

export const useMultiStepFormStore = create<MultiStepFormState>((set) => ({
  stepData: {},
  currentStep: 1,
  setStepData: (step, data) => set((state) => ({ stepData: { ...state.stepData, [step]: data } })),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set({ stepData: {}, currentStep: 1 }),
}))
