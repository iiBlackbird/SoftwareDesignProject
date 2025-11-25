'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '../../../lib/auth';
import NavigationBar from '../../../components/NavigationBar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = React.useState('Verifying your email...');

  React.useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then((data) => {
          setMessage(data.message);
        })
        .catch((err) => {
          setMessage(err.message);
        });
    }
  }, [token]);

  return (
    <div>
      <NavigationBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Email Verification
        </Typography>
        <Typography>{message}</Typography>
      </Container>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}