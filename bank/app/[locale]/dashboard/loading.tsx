export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0e" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl animate-pulse" style={{ background: "linear-gradient(135deg, #1B5FBE, #4895EF)" }} />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full animate-bounce"
              style={{ background: "rgba(72,149,239,0.5)", animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
