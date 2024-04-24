import { createClient } from '@sanity/client';

export default createClient({
  projectId: 'vo608ppy', 
  dataset: 'production',
  useCdn: false, // `false` if you want to ensure fresh data
});
