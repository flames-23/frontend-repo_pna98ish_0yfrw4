import { useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function KnowFlow() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    career: '',
    age: '',
    passions_or_skills: [],
    education_level: '',
    lifestyle_or_salary: '',
  })
  const [result, setResult] = useState(null)

  const questions = [
    {
      key: 'career',
      label: 'What career do you want to pursue?',
      type: 'text',
      placeholder: 'e.g., Software Developer, Product Designer...'
    },
    { key: 'age', label: 'How old are you?', type: 'number', placeholder: '18' },
    {
      key: 'passions_or_skills',
      label: 'What are your passions or skills?',
      type: 'chips',
      placeholder: 'Add a few like coding, design, writing...'
    },
    { key: 'education_level', label: 'What’s your current education level?', type: 'text', placeholder: '12th, B.Tech 2nd year, etc.' },
    { key: 'lifestyle_or_salary', label: 'What kind of lifestyle or salary do you want?', type: 'text', placeholder: 'e.g., ₹15L+ in 3 years, remote flexibility' },
  ]

  const next = () => setStep((s) => Math.min(s + 1, questions.length))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const addChip = (value) => {
    const v = value.trim()
    if (!v) return
    setForm((f) => ({ ...f, passions_or_skills: [...new Set([...(f.passions_or_skills||[]), v])] }))
  }

  const removeChip = (v) => {
    setForm((f) => ({ ...f, passions_or_skills: (f.passions_or_skills||[]).filter(x => x !== v) }))
  }

  const submit = async () => {
    setLoading(true)
    try {
      const payload = {
        career: form.career,
        age: form.age ? Number(form.age) : undefined,
        passions_or_skills: form.passions_or_skills,
        education_level: form.education_level,
        lifestyle_or_salary: form.lifestyle_or_salary,
      }
      const res = await fetch(`${baseUrl}/api/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
      setStep(questions.length)
    } catch (e) {
      console.error(e)
      alert('Something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Reverse-Engineer Your Role</h1>
          <div className="text-sm text-gray-500">Step {Math.min(step + 1, questions.length)} / {questions.length}</div>
        </div>

        {step < questions.length && (
          <div className="mt-8 bg-white rounded-2xl border p-6 shadow-sm">
            <p className="text-xl font-semibold">{questions[step].label}</p>

            {questions[step].type === 'text' && (
              <input
                className="mt-4 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={questions[step].placeholder}
                value={form[questions[step].key] || ''}
                onChange={(e) => setForm({ ...form, [questions[step].key]: e.target.value })}
              />
            )}

            {questions[step].type === 'number' && (
              <input
                type="number"
                className="mt-4 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={questions[step].placeholder}
                value={form[questions[step].key] || ''}
                onChange={(e) => setForm({ ...form, [questions[step].key]: e.target.value })}
              />
            )}

            {questions[step].type === 'chips' && (
              <div className="mt-4">
                <div className="flex gap-2 flex-wrap mb-3">
                  {(form.passions_or_skills||[]).map((chip) => (
                    <button key={chip} onClick={() => removeChip(chip)} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100">
                      {chip} ×
                    </button>
                  ))}
                </div>
                <ChipInput onAdd={addChip} placeholder={questions[step].placeholder} />
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button onClick={prev} className="px-4 py-2 rounded-xl border hover:bg-gray-50">Back</button>
              {step === questions.length - 1 ? (
                <button onClick={submit} disabled={loading || !form.career} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50">
                  {loading ? 'Cooking your roadmap…' : 'Generate Roadmap'}
                </button>
              ) : (
                <button onClick={next} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">Next</button>
              )}
            </div>
          </div>
        )}

        {step >= questions.length && result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-black">Stage-Wise Roadmap for {result.career}</h2>

            <Section title="Skills to learn">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.skills_to_learn.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section title="Courses (free + paid)">
              <div className="grid sm:grid-cols-2 gap-3">
                {result.courses.map((c, i) => (
                  <a key={i} href={c.url} target="_blank" className="rounded-xl border p-4 hover:shadow-md transition bg-white">
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-sm text-indigo-600">Open ↗</p>
                  </a>
                ))}
              </div>
            </Section>

            <Section title="Tools to master">
              <div className="flex flex-wrap gap-2">
                {result.tools_to_master.map((t, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">{t}</span>
                ))}
              </div>
            </Section>

            <Section title="Ideal side projects / activities">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.side_projects.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section title="Internships to target">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.internships.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            {result.certifications?.length > 0 && (
              <Section title="Certifications (optional but helpful)">
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {result.certifications.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Section>
            )}

            <Section title="Mistakes to avoid">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.mistakes_to_avoid.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section title="Realistic timeline">
              <div className="grid sm:grid-cols-2 gap-3">
                {result.timeline.map((stg, i) => (
                  <div key={i} className="rounded-xl border p-4 bg-white">
                    <p className="font-semibold">{stg.stage}</p>
                    <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                      {stg.focus.map((f, j) => <li key={j}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Expected salary ranges">
              <div className="rounded-xl border p-4 bg-white">
                <p>Entry: {result.salary_ranges.entry}</p>
                <p>Mid: {result.salary_ranges.mid}</p>
                <p>Senior: {result.salary_ranges.senior}</p>
                <p className="text-sm text-gray-500 mt-1">{result.salary_ranges.note}</p>
              </div>
            </Section>

            <Section title="How to build a portfolio">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.portfolio_tips.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section title="How to find your first opportunity">
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.first_opportunity.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
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

function ChipInput({ onAdd, placeholder }) {
  const [val, setVal] = useState('')
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAdd(val)
            setVal('')
          }
        }}
      />
      <button onClick={() => { onAdd(val); setVal('') }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Add</button>
    </div>
  )
}
