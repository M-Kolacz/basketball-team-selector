import { redirect } from 'next/navigation';
export var metadata = {
    title: 'Login - Basketball Team Selector',
    description: 'Login to the Basketball Team Selector application',
};
export default function LoginPage() {
    redirect('/games');
}
