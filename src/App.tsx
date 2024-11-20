import { useEffect, useMemo, useRef, useState } from "react"
import { SortBy, User } from "./lib/types"
import UsersTable from "./components/UsersTable"

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [colorRows, setColorRows] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState('')
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    setLoading(true)
    fetch('https://randomuser.me/api/?results=100')
    .then(res => res.json())
    .then(data => {
      setUsers(data.results)
      originalUsers.current = data.results
    })
    .catch(error => console.error(error))
    .finally(() => setLoading(false))
  }, [])

  const toggleRowsColors = () => {
    setColorRows(prevState => !prevState)
  }
  
  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleChangeFilterByCountry = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFilterByCountry(value.toLocaleLowerCase())
  }

  const filteredUsers = useMemo(() => {
    return filterByCountry
    ? users.filter(user => user.location.country.toLocaleLowerCase().includes(filterByCountry))
    : users 
  }, [users, filterByCountry])

  const sortedUsers = useMemo(() => {

    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    }

    return [...filteredUsers].sort((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const handleDelete = (id: string) => {
    const filteredUsers = users.filter(user => user.login.uuid !== id)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  return (
    <>
      <header>
        <h1>Prueba técnica React + TypeScript</h1>
        <div className="actions-container">
          <button onClick={toggleRowsColors}>
            Colorear filas
          </button>
          <button onClick={toggleSortByCountry}>
            {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
          </button>
          <button onClick={handleReset}>
            Resetear usuarios
          </button>
          <label htmlFor="filterByCountry">Filtra por país:
            <input id="filterByCountry" type="text" onChange={handleChangeFilterByCountry} />
          </label>
        </div>
      </header>
      <main>
        {loading ?
          <p>Loading...</p>
          :
          <UsersTable 
            users={sortedUsers} 
            colorRows={colorRows} 
            handleDelete={handleDelete} 
            handleChangeSort={handleChangeSort}
          />
        }
      </main>
    </>
  )
}

export default App
