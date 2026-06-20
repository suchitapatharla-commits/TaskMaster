import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="taskmaster-theme"
    >
      {children}
    </NextThemesProvider>
  )
}