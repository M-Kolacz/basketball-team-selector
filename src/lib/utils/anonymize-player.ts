import { type Player } from '#app/lib/db.server'

export const formatPlayerName = (
	playerName: Player['name'],
	isAdmin: boolean,
): Player['name'] => {
	if (isAdmin) return playerName

	const name = playerName.split(' ')
	const anonymized = `${name[0]} ${(name[1] || [''])[0]}`

	return anonymized
}
