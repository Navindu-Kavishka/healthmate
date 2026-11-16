import { Stack, useLocalSearchParams } from 'expo-router';

import { RecordForm } from '@/features/records/components/RecordForm';

// edit record 
export default function EditRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Edit record' }} />
      <RecordForm recordId={Number(id)} />
    </>
  );
}