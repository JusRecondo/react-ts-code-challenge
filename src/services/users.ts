export const fetchUsers = async ({ pageParam = 1} : { pageParam?: number}) => {
  return await fetch(`https://randomuser.me/api/?results=10&seed=test&page=${pageParam}`)
    .then(res => {
      if (!res.ok) throw new Error ('Error fetching users')
      return res.json()
    })
    .then(data => {
      const currentPage = data.info.page
      //limit amount of pages
      const nextPage = currentPage > 3 ? undefined : currentPage + 1 
      return {
        users: data.results,
        nextPage
      }
    }
  )
}