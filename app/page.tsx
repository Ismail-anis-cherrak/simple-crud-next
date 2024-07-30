'use client'
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"

interface IInterpretation{
  $id: string,
  term:string,
  explanation:string
}

export default function Home() {
  
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([])
  const [isloading,setIsloading] = useState(true)
  const [error,setError] = useState<string | null>(null)



  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsloading(true)
      try {
        const response = await axios.get('/api/interpretations')

        if (response.status !== 200) {
          throw new Error('Failed to fetch interpretations')
        }

        const data: IInterpretation[] = response.data
        setInterpretations(data)
        console.log(data)
      } catch (error) {
        console.log('Error fetching interpretations', error)
        setError('Failed loading interpretations, please refresh.')
      } finally {
        setIsloading(false)
      }
    }

    fetchInterpretations()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/interpretations/${id}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete this interpretation');
      }

      // Filter out the deleted interpretation
      setInterpretations(prevInterpretations =>
        prevInterpretations.filter(interpretation => interpretation.$id !== id)
      );
    } catch (error) {
      console.log('Error deleting this interpretation', error);
    }
  };


  return (

    <div>

      {error && <p className="py-4 text-red-500">{error}</p>}

      {isloading ? 
      <p>Loading ...</p>:
      

      <div className="p-4 my-2 rounded-md border-b leading-9s">
      {
        interpretations?.map(int=>(
          <div>
        <h1 className="font-bold py-4">{int.term}</h1>
        <div>{int.explanation}</div>
          <div className="flex gap-4 mt-4 justify-end">
            <Link href={`/edit/${int.$id}`} className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest ">Edit</Link>
            <button className="bg-red-500 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest text-white" onClick={() => handleDelete(int.$id)}>Delete</button> 
          </div>
      </div>
        ))
      }
      </div>
    }


     
    </div>
    
  )
}
