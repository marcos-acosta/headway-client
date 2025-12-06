import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://4673yikrmh.execute-api.us-east-2.amazonaws.com/dev';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_BASE}/${path}${searchParams ? `?${searchParams}` : ''}`;

  const headers: HeadersInit = {};
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, { headers });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${API_BASE}/${path}`;

  const body = await request.text();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
