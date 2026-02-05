'use client'

import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'
import CanvasEditor from './CanvasEditor'

interface Step5PreviewProps {
  state: PersonalizzaState
  updateState: (updates: Partial<PersonalizzaState>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PersonalizzaStep5({
  state,
  updateState,
  onNext,
  onPrev,
}: Step5PreviewProps) {
  const handleCanvasUpdate = (canvasData: any) => {
    updateState({ canvasData })
  }

  return (
    <div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <CanvasEditor
          state={state}
          onUpdate={handleCanvasUpdate}
        />
      </div>

      {/* Bottoni Navigazione */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-6 py-3"
        >
          ← Indietro
        </Button>
        <Button
          onClick={onNext}
          disabled={!state.canvasData}
          variant="primary"
          className="px-8 py-3"
        >
          Avanti →
        </Button>
      </div>
    </div>
  )
}
