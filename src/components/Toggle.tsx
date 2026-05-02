"use client";

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`toggle-track ${checked ? "on" : "off"}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <div className="toggle-thumb" />
      </div>
      {label && <span className="text-sm text-[#5C3D2E]/70">{label}</span>}
    </label>
  );
}
