import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function DiscoverFlow() {
  const [tests, setTests] = useState([])
  const [answers, setAnswers] = useState({})
  const [i, setI] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch(`${baseUrl}/api/discover/tests`).then(r => r.json()).then(setTests).catch(console.error)
  }, [])

  const current = tests[i]

  const next = () => setI((x) => Math.min(x + 1, tests.length))
  const prev = () => setI((x) => Math.max(x - 1, 0))

  const toggleMulti = (qid, value) => {
    const prevVals = Array.isArray(answers[qid]) ? answers[qid] : []
    const has = prevVals.includes(value)
    const newVals = has ? prevVals.filter(v => v !== value) : [...prevVals, value]
    setAnswers({ ...answers, [qid]: newVals })
  }

  const selectOne = (qid, value) => setAnswers({ ...answers, [qid]: value })

  const finish = async () => {
    const res = await fetch(`${baseUrl}/api/discover/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
    const data = await res.json()
    setResult(data)
    setI(tests.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Let’s figure it out together</h1>
          <div className="text-sm text-gray-500">Test {Math.min(i + 1, tests.length)} / {tests.length}</div>
        </div>

        {i < tests.length && current && (
          <div className="mt-8 bg-white rounded-2xl border p-6 shadow-sm">
            <p className="text-xl font-semibold">{current.title}</p>
            <p className="text-gray-600">{current.vibe}</p>
            <div className="mt-4 space-y-6">
              {current.questions.map((q) => (
                <div key={q.id}>
                  <p className="font-medium">{q.text}</p>
                  {q.type === 'single' && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => selectOne(q.id, opt)}
                          className={`px-3 py-2 rounded-xl border text-left ${answers[q.id] === opt ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === 'multi' && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const active = Array.isArray(answers[q.id]) && answers[q.id].includes(opt)
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleMulti(q.id, opt)}
                            className={`px-3 py-2 rounded-xl border text-left ${active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={prev} className="px-4 py-2 rounded-xl border hover:bg-gray-50">Back</button>
              {i === tests.length - 1 ? (
                <button onClick={finish} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">See my fit</button>
              ) : (
                <button onClick={next} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">Next</button>
              )}
            </div>
          </div>
        )}

        {i >= tests.length && result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-black">Your vibe match</h2>
            <Section title="Here are the careers that fit you best">
              <div className="flex flex-wrap gap-2">
                {result.best_fit_careers.map((r) => (
                  <span key={r} className="px-3 py-1 rounded-full bg-green-50 text-green-700">{r}</span>
                ))}
              </div>
            </Section>
            <Section title="Here are careers you should avoid">
              <div className="flex flex-wrap gap-2">
                {result.careers_to_avoid.map((r) => (
                  <span key={r} className="px-3 py-1 rounded-full bg-red-50 text-red-700">{r}</span>
                ))}
              </div>
            </Section>
            <Section title={result.ask_salary_prompt}>
              <p className="text-gray-600">Pick a role on the roadmap page to see bands.</p>
            </Section>
            <Section title={result.ask_full_roadmap_prompt}>
              <a href="/know" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white">Generate roadmap</a>
            </Section>
            <Section title={result.ask_counselor_prompt}>
              <a href="#" className="inline-block px-4 py-2 rounded-xl border">Talk to a counselor (coming soon)</a>
            </Section>
            <Section title="Here are courses you can start right now">
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(result.courses_to_start_now).map(([role, list]) => (
                  <div key={role} className="rounded-xl border p-4 bg-white">
                    <p className="font-semibold mb-2">{role}</p>
                    {list.map((c, i) => (
                      <a key={i} href={c.url} target="_blank" className="block text-indigo-600 underline underline-offset-4">{c.title}</a>
                    ))}
                  </div>
                ))}
              </div>
            </Section>

            <div className="pt-2">
              <a href="/" className="inline-block mt-2 px-4 py-2 rounded-xl border hover:bg-gray-50">Back to home</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-xl font-extrabold mb-2">{title}</h3>
      {children}
    </section>
  )
}
