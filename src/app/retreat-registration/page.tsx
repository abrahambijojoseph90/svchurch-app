import { Metadata } from 'next';
import RegistrationForm from './RegistrationForm';

export const metadata: Metadata = {
  title: 'Church Retreat 2026 — Registration | Spring Valley Church',
  description:
    'Register for the Spring Valley Church Retreat, 28–31 May 2026 at Great Wenham, Colchester. A time of fellowship, worship, and renewal.',
  robots: { index: false, follow: false },
};

export default function RetreatRegistrationPage() {
  return <RegistrationForm />;
}
