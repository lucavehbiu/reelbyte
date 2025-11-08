import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-purple-pink bg-clip-text text-transparent">
            ReelByte
          </h1>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ReelByte. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
