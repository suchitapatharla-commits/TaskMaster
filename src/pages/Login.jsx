import { useAuth } from '../context/AuthContext'
const Login = ({ onLogin }) => {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-background">
      <div className="text-center space-y-2">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-4xl font-medium tracking-tight text-foreground">TaskMaster</h1>
        <p className="text-muted-foreground">Your entire week, one place</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-border rounded-xl bg-card hover:bg-accent transition-all text-sm font-medium text-foreground"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Continue with Google
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your tasks, diary and calendar — all in one place.
      </p>
    </div>
  )
}

export default Login