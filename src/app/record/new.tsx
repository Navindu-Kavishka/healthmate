import { Stack } from 'expo-router';

import { RecordForm } from '@/features/records/components/RecordForm';

export default function NewRecordScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add record' }} />
      <RecordForm />
    </>
  );
}