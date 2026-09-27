interface CountryFlagProps {
  code: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-4 h-3",
  md: "w-6 h-4",
  lg: "w-8 h-6",
};

const CountryFlag = ({ code, name, size = "md" }: CountryFlagProps) => {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={`${name} flag`}
      className={`${sizeMap[size]} inline-block object-cover rounded-sm`}
      loading="lazy"
    />
  );
};

export default CountryFlag;
