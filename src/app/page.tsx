import { LoginPage } from "@/components/pages/login/login";
import { TrackerPage } from "@/components/pages/tracker/tracker";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function Home( { searchParams }: PageProps ) {
  const cookieStore = cookies();
  const session = ( await cookieStore ).get( "session" );

  const params = searchParams ? await searchParams : undefined;
  const token = params?.token;

  // Logged-in user + invite token → clean URL
  if ( session && token ) {
    redirect( "/" );
  }

  // Logged-in user
  // temporarily bypassing auth for development
  if ( session || true ) {
    return <TrackerPage />;
  }

  // Default
  return <LoginPage />;
}
