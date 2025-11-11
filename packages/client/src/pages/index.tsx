import DefaultLayout from '~/components/layouts/DefaultLayout'

export default function Index() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 border border-gray-700 rounded-xl bg-gray-800/50 p-8 text-center shadow-2xl backdrop-blur-sm">
        <h1 className="text-4xl text-green-400 font-bold drop-shadow-lg">
          shadle
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          A Wordle-style game with colors
        </p>
        <button className="transform self-center rounded-lg from-green-500 to-green-600 bg-gradient-to-r px-8 py-3 text-white font-medium transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-lg" type="button">
          Start Playing
        </button>
      </div>
    </DefaultLayout>
  )
}
