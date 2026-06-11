export default function QuizQuestion({ question, index, selected, onChange }) {
  const { _id, text, options } = question

  function handleSelect(option) {
    onChange(_id, option)
  }

  return (
    <div className="card border-0 shadow-sm mb-4 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3 mb-3">
          <span
            className="badge rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 32, height: 32, fontSize: '0.85rem', background: '#f97316', color: 'white' }}
          >
            {index + 1}
          </span>
          <p className="fw-semibold mb-0" style={{ lineHeight: 1.5 }}>{text}</p>
        </div>

        <div className="d-flex flex-column gap-2">
          {options.map((option) => {
            const isSelected = selected === option
            return (
              <label
                key={option}
                className="d-flex align-items-center gap-3 p-3 rounded-3"
                style={{
                  cursor: 'pointer',
                  background: isSelected ? '#fff7ed' : '#f9fafb',
                  border: `2px solid ${isSelected ? '#f97316' : '#e5e7eb'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="radio"
                  name={`q-${_id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleSelect(option)}
                  className="form-check-input m-0 flex-shrink-0"
                  style={{ accentColor: '#f97316', width: 18, height: 18 }}
                />
                <span style={{ fontSize: '0.95rem' }}>{option}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
