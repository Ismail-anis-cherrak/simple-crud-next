'use client'

import axios from "axios"
import { ChangeEvent, FormEvent, useState } from "react"

const Create = () => {
  const [formData, setFormData] = useState({ term: '', explanation: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.term || !formData.explanation) {
      setError('Please fill all fields !!!')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post('/api/interpretations', JSON.stringify(formData))
      if (response.status !== 200) {
        throw new Error('Failed to create the interpretation')
      }
      // Optionally clear the form on successful submission
      setFormData({ term: '', explanation: '' })
    } catch (error) {
      console.log('Error creating the interpretation', error)
      setError('Something went wrong, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add new interpretation</h2>
      <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.term}
          onChange={handleInputChange}
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="explanation"
          rows={4}
          placeholder="Explanation"
          value={formData.explanation}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          className="bg-black text-white mt-5 px-4 py-1 pointer rounded-md"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Adding interpretation...' : 'Add interpretation'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

export default Create
