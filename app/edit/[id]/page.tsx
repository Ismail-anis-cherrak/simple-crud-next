'use client'

import axios from "axios"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

const Edit = ({params}:{params:{id:string}}) => {
  const [formData, setFormData] = useState({ term: '', explanation: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    const fetchInterpretations = async () => {
      try {
        const response = await axios.get(`/api/interpretations/${params.id}`)

        if (response.status !== 200) {
          throw new Error('Failed to fetch interpretations')
        }

        const data = response.data
        
        console.log(data)

        setFormData({term: data.term, explanation:data.explanation})
      } catch (error) {
        console.log('Error fetching interpretations', error)
        setError('Failed loading interpretations, please refresh.')
      }
    }

    fetchInterpretations()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/interpretations/${params.id}`, JSON.stringify(formData))
      if (response.status !== 200) {
        throw new Error('Failed to Edit the interpretation')
      }
      // Optionally clear the form on successful submission
      setFormData({ term: '', explanation: '' })
    } catch (error) {
      console.log('Error editing the interpretation', error)
      setError('Something went wrong, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit interpretation</h2>
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
          {isLoading ? 'Editing interpretation...' : 'Edit interpretation'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

export default Edit
 