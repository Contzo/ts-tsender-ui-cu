export default function Spinner() {
  return (
    <div className="w-6 h-6 aspect-square relative">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-current animate-spin" />
    </div>
  );
}
