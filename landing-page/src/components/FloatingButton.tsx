interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 z-50 flex items-center gap-2"
    >
      <span className="text-xl">💬</span>
      <span className="font-medium hidden sm:inline">立即咨询</span>
    </button>
  );
}
