type Props = {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
};

const TONES = {
  error: "border-red-600 bg-red-50 text-red-800",
  success: "border-green-700 bg-green-50 text-green-800",
  info: "border-navy-500 bg-navy-50 text-navy-800",
};

export function Alert({ tone = "error", children }: Props) {
  return (
    <div
      role="alert"
      className={`border-l-4 px-4 py-3 text-sm font-medium ${TONES[tone]}`}
    >
      {children}
    </div>
  );
}
