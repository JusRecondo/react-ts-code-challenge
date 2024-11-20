import { useMemo, useState } from "react"
import { SortBy, User } from "./lib/types"
import UsersTable from "./components/UsersTable"
import { ThreeDots } from "react-loader-spinner" 
import { useUsers } from "./hooks/useUsers"

function App() {
  const {
    isLoading,
    isError,
    users,
    fetchNextPage,
    hasNextPage
  } = useUsers()

  const [colorRows, setColorRows] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState('')

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
              handleChangeSort={handleChangeSort}
            />
            {
              hasNextPage &&
              <button 
                onClick={() => fetchNextPage()}
              >
                Cargar más resultados
              </button>
            }
          </>
        }
        {isLoading && 
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
        {!isLoading && isError && <p>Ha ocurrido un error</p>}

        {!isLoading && !isError && users.length === 0 && <p>No hay usuarios</p>}
      </main>
    </>
  )
}

export default App
