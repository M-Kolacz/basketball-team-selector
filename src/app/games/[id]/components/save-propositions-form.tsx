'use client'
import { Button } from '#app/components/ui/button'

export const SavePropositionsForm = () => {
	return (
		<Button onClick={handleSave} disabled={isSaving}>
			{isSaving ? 'Saving...' : 'Save Changes'}
		</Button>
	)
}
