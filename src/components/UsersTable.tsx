import { SortBy, User } from "../lib/types"

interface Props {
  users: User[];
  colorRows: boolean;
  handleChangeSort: (sort: SortBy) => void;
}

const UsersTable: React.FC<Props> = ({ users, colorRows, handleChangeSort }) => {
  return (
    <table className={colorRows ? 'color-rows' : ''}>
      <thead>
        <tr>
          <th>Foto</th>
          <th 
            tabIndex={0}
            role="button"
            className="clickable"
            onClick={() => handleChangeSort(SortBy.NAME)}
          >
            Nombre
          </th>
          <th
            tabIndex={0}
            role="button"
            className="clickable"
            onClick={() => handleChangeSort(SortBy.LAST)}
          >
            Apellido
          </th>
          <th 
            tabIndex={0}
            role="button"
            className="clickable"
            onClick={() => handleChangeSort(SortBy.COUNTRY)}
          >
            Pais
          </th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => (
            <tr key={user.login.uuid}>
              <td>
                <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} />
              </td>
              <td>
                {user.name.first}
              </td>
              <td>
                {user.name.last}
              </td>
              <td>
                {user.location.country}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default UsersTable