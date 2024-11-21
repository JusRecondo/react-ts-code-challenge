export const fetchUsers = async (page: number) => {
    return await fetch(
        `https://randomuser.me/api/?results=10&seed=test&page=${page}`
    )
        .then(res => {
            if (!res.ok) throw new Error('Error fetching users')
            return res.json()
        })
        .then(data => data.results)
}
