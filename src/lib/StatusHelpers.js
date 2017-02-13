export const addStatus = (feed, status) => [...feed, status];

export const removeStatus = (list, id) => {
	const deleteIndex = list.findIndex(status => status.id === id)
	return [
		...list.slice(0,deleteIndex),
		...list.slice(deleteIndex+1)
	]
}
