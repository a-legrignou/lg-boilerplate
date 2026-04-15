import { useFormStatus } from "react-dom";

export function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="flex items-center justify-center gap-2 cursor-pointer bg-yellow-500 text-white font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
      {pending && <span className="animate-spin">⏳</span>}
      {pending ? "Envoi..." : "Envoyer"}
    </button>
  );
}
