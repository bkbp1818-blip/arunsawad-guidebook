export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Test Page Works!</h1>
        <p className="mt-2 text-gray-600">Deployment: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
