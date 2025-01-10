import { UserResource } from '@clerk/types'

export const syncUserWithBackend = async (user: UserResource) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                username: user.username || user.firstName || user.emailAddresses[0].emailAddress
            })
        });

        if (!response.ok) {
            throw new Error('Failed to sync user');
        }

        return await response.json();
    } catch (error) {
        console.error('Error syncing user:', error);
        throw error;
    }
};