import Image from "next/image";

export default function Icon({
  name,
  color,
}: {
  name: string;
  color?: string;
}) {
  return (
    <div style={{ fill: color || "var(--icon-color)" }}>
      <Image
        src={`/icons/${name}.svg`}
        alt={name}
        width={24}
        height={24}
        style={{ fill: color || "var(--icon-color)" }}
      />
    </div>
  );
}
