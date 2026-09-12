import dynamic from 'next/dynamic'

const FarmCanvasDynamic = dynamic(() => import('./FarmCanvas'), {
  ssr: false,
})

export default function Step5FarmDesign() {
  return (
    <div className="w-full">
      <FarmCanvasDynamic />
    </div>
  )
}
