import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const gamesDir = path.join(process.cwd(), 'public', 'images', 'games');
    
    if (!fs.existsSync(gamesDir)) {
      return NextResponse.json({ error: 'Images directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(gamesDir);
    const images: Record<string, string> = {};
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.svg')) {
        const filePath = path.join(gamesDir, file);
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(file).substring(1);
        const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        images[file] = base64;
      }
    }
    
    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
