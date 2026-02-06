export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 text-foreground">
          &copy;
          <span className="ml-1">
            2023 - {currentYear} Jukelyn. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
