import { useEffect, useMemo, useRef, useState } from "react"
import { SortBy, User } from "./lib/types"
import UsersTable from "./components/UsersTable"
import { ThreeDots } from "react-loader-spinner"
import { fetchUsers } from "./services/users"

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [colorRows, setColorRows] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    setLoading(true)
    setError(false)
    
    fetchUsers(currentPage)
    .then(data => {
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.concat(data)
        originalUsers.current = updatedUsers
        return(updatedUsers)
      })
    })
    .catch(error => {
      setError(true)
      console.error(error)
    })
    .finally(() => setLoading(false))
  }, [currentPage])

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

  const handleAddPage = () => {
    setCurrentPage(currentPage => currentPage + 1)
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
        {users.length > 0 &&
          <>
            <UsersTable 
              users={sortedUsers} 
              colorRows={colorRows} 
              handleDelete={handleDelete} 
              handleChangeSort={handleChangeSort}
            />
            <button 
              onClick={handleAddPage}
            >
              Cargar más resultados
            </button>
          </>
        }
        {loading && 
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#fbfbfb"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{margin: '16px'}}
          />
        }
        {!loading && error && <p>Ha ocurrido un error</p>}

        {!loading && !error && users.length === 0 && <p>No hay usuarios</p>}
      </main>
    </>
  )
}

export default App
