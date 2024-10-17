export default function BgGrid() {
  return (
    <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--gridbackground)_1px,transparent_0.5px),linear-gradient(to_bottom,var(--gridbackground)_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"></div>
  );
}
