'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const AccountPage = () => {
   const { id } = useParams<{ id: string }>();
   return <div>{id}</div>;
};

export default AccountPage;
