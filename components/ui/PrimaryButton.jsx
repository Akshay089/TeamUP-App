import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "solid",
  className = "",
}) {
  const base =
    "rounded-2xl py-3.5 px-5 items-center justify-center active:opacity-90";
  const solid =
    "bg-teal-600 shadow-sm shadow-teal-900/15 disabled:bg-slate-300 disabled:shadow-none";
  const outline = "border-2 border-teal-600 bg-transparent disabled:border-slate-300";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.92}
      className={`${base} ${variant === "outline" ? outline : solid} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#0d9488" : "#fff"} />
      ) : (
        <Text
          className={`text-base font-semibold ${
            variant === "outline" ? "text-teal-700" : "text-white"
          }`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
