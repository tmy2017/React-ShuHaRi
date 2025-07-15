const App = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Hello World
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Tailwind CSS is working correctly!
      </p>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Primary Button
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Success Button
        </button>
      </div>
    </section>
  )
}

export default App