export default function QuizQuestion({ question, index, selected, onChange }) {
  const { _id, text, options } = question

  function handleSelect(option) {
    onChange(_id, option)
  }

  return (
    <div className="card quiz-question mb-4">
      <div className="card-body">
        <div className="d-flex align-items-start gap-3 mb-3">
          <span
            className="question-number"
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
                className={`quiz-option ${isSelected ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`q-${_id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleSelect(option)}
                  className="form-check-input m-0 flex-shrink-0"
                  style={{ width: 18, height: 18 }}
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
