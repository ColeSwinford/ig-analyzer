export const COLORS = {
  igBlue: "bg-[#0095F6] hover:bg-[#1877F2]",
  bgCard: "bg-[#121212]",
  border: "border-[#363636]",
};

export const STYLES = {
  buttonPrimary: `w-full py-2 px-4 rounded-lg font-semibold text-white text-sm transition-colors ${COLORS.igBlue} flex items-center justify-center gap-2 h-10`,
  buttonSecondary: `bg-[#363636] hover:bg-[#262626] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors border ${COLORS.border}`,
  card: `${COLORS.bgCard} border ${COLORS.border} rounded-xl overflow-hidden`,
  input: "bg-[#262626] border border-[#363636] text-white text-sm rounded-lg block w-full p-2.5 focus:ring-1 focus:ring-[#A8A8A8] focus:border-[#A8A8A8] outline-none",
};