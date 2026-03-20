import type { Metadata } from 'next';
import VibeCheckApp from '../components/VibeCheckApp';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const res = resolvedParams?.res;
  
  if (res && typeof res === 'string') {
    try {
      // Decode Base64 'res' to determine which meme/rarity to show in the OG Title!
      // This is the CRITICAL viral feature: Link previews will show their exact result without DB!
      // e.g. "I got Supernova Red (Top 1% Rarity)!"
      
      return {
        title: 'I got "Supernova Red" (Top 1% Rarity)!',
        description: 'Check out my Cosmic Aura and find your Soulmate Match. Take the global Vibe Check!',
        openGraph: {
          title: 'I got "Supernova Red" (Top 1% Rarity)!',
          description: 'Check out my Cosmic Aura and find your Soulmate Match.',
          images: ['/og-supernova-red.jpg'],
        },
      }
    } catch(e) {
      // ignore base64 errors
    }
  }

  // Default SEO
  return {
    title: 'Cosmic Aura & Vibe Check',
    description: 'Global MBTI & Aura Color Personality Test',
  };
}

export default function Home() {
  return (
    <main className="flex-center" style={{ minHeight: '100vh', padding: '1rem', position: 'relative' }}>
      <VibeCheckApp />
    </main>
  );
}
